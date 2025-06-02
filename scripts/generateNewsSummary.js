// scripts/generateNewsSummary.js
const { google } = require('googleapis');
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai"); // Or use axios/fetch for REST
const { week: getWeekDateRange } = require('../lib/dates'); // Assuming lib/dates.js can be used or adapted

// --- Configuration ---
const MAIN_CALENDAR_ID = '8e1jse11ireht56ho13r6a470s@group.calendar.google.com'; // Your main events calendar
const NEWS_CALENDAR_ID = process.env.NEWS_CALENDAR_ID || 'YOUR_NEWS_CALENDAR_ID'; // The new calendar for news
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT; // e.g., https://your-resource.openai.azure.com/
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const OPENAI_DEPLOYMENT_NAME = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o'; // Your GPT-4o deployment name

// Authenticate with Google Calendar API for write access
const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/calendar.events']
  // GOOGLE_APPLICATION_CREDENTIALS environment variable should be set
  // to the path of your service account key file.
});
const calendar = google.calendar({ version: 'v3', auth });

// --- Helper Functions ---

async function getUpcomingEvents() {
  const { from, until } = getWeekDateRange(); // Get dates for the upcoming week

  try {
    const response = await calendar.events.list({
      calendarId: MAIN_CALENDAR_ID,
      timeMin: from.toISOString(),
      timeMax: until.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 50, // Adjust as needed
    });

    if (!response.data.items) return [];
    return response.data.items.map(event => ({
      summary: event.summary,
      description: event.description || '',
      startDate: event.start.dateTime || event.start.date,
      endDate: event.end.dateTime || event.end.date,
      location: event.location || ''
    }));
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }
}

async function generateNewsSummaryOpenAI(events) {
  if (!events || events.length === 0) {
    return { title: "No events planned this week", summary: "Enjoy the quiet week!" };
  }

  const client = new OpenAIClient(AZURE_OPENAI_ENDPOINT, new AzureKeyCredential(AZURE_OPENAI_API_KEY));

  const eventDetails = events.map(e =>
    `- ${e.summary} (From: ${e.startDate} To: ${e.endDate}${e.location ? ', Location: ' + e.location : ''}${e.description ? '\n  Description: ' + e.description.substring(0,100) + '...' : ''})`
  ).join('\n');

  const messages = [
    { role: "system", content: "You are an assistant that creates engaging weekly news summaries about events in Cardedeu. The summary should have a catchy title and a friendly tone." },
    { role: "user", content: `Here are the events for next week in Cardedeu:\n${eventDetails}\n\nPlease generate a news summary post. The title should be something like 'The Best Plans in Cardedeu This Week' or 'What to do this weekend in Cardedeu'. The summary should highlight some of the most interesting events. Format the output as a JSON object with 'title' and 'summary' keys. The summary should be plain text, suitable for a blog post.` }
  ];

  try {
    const result = await client.getChatCompletions(OPENAI_DEPLOYMENT_NAME, messages, {
      maxTokens: 800, // Adjust as needed
      temperature: 0.7,
    });

    if (result.choices && result.choices.length > 0) {
      const content = result.choices[0].message.content;
      // Attempt to parse the JSON from the content
      try {
        // The model might return the JSON string within triple backticks
        const jsonMatch = content.match(/```json\n(.*\n)```/s);
        const jsonString = jsonMatch ? jsonMatch[1].trim() : content.trim();
        return JSON.parse(jsonString);
      } catch (parseError) {
        console.error("Error parsing OpenAI response JSON:", parseError, "Raw content:", content);
        // Fallback if JSON parsing fails
        return { title: "Weekly Summary for Cardedeu", summary: content };
      }
    } else {
      throw new Error("OpenAI returned no choices.");
    }
  } catch (error) {
    console.error('Error generating news summary with OpenAI:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function createNewsEvent(title, summaryContent) {
  const { from: weekStart } = getWeekDateRange(); // Get start of the upcoming week
  const eventStartTime = new Date(weekStart);
  // Set to Monday 00:00:00 for an all-day event representation for the week's summary
  eventStartTime.setHours(0, 0, 0, 0);

  const event = {
    summary: title,
    description: summaryContent,
    start: {
      date: eventStartTime.toISOString().split('T')[0], // All-day event for the start of the week
      timeZone: 'Europe/Madrid', // Or your specific timezone
    },
    end: {
      date: eventStartTime.toISOString().split('T')[0], // All-day event, so end date is same as start
      timeZone: 'Europe/Madrid',
    },
    // Optional: add a reminder or other properties
    // Reminders can be useful if you want to be notified before it's "published"
  };

  try {
    const createdEvent = await calendar.events.insert({
      calendarId: NEWS_CALENDAR_ID,
      resource: event,
    });
    console.log('News event created:', createdEvent.data.htmlLink);
    return createdEvent.data;
  } catch (error) {
    console.error('Error creating news event:', error);
    throw error;
  }
}

// --- Main Execution ---
async function main() {
  if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_API_KEY || !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error('Missing required environment variables: AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, GOOGLE_APPLICATION_CREDENTIALS, and possibly NEWS_CALENDAR_ID.');
    process.exit(1);
  }

  try {
    console.log('Fetching upcoming events...');
    const upcomingEvents = await getUpcomingEvents();
    console.log(`Found ${upcomingEvents.length} events.`);

    if (upcomingEvents.length === 0) {
      console.log("No upcoming events to summarize. Skipping news generation.");
      // Optionally, still create a "no events" post if desired
      // await createNewsEvent("No Events This Week in Cardedeu", "It looks like a quiet week in Cardedeu. Check back next week for more updates!");
      return;
    }

    console.log('Generating news summary with OpenAI...');
    const { title, summary } = await generateNewsSummaryOpenAI(upcomingEvents);
    console.log(`Generated summary - Title: ${title}`);

    console.log('Creating news event in Google Calendar...');
    await createNewsEvent(title, summary);

    console.log('Successfully generated and stored news summary.');
  } catch (error) {
    console.error('Failed to generate weekly news summary:', error);
    process.exit(1);
  }
}

main();
