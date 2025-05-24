import { withSentry } from "@sentry/nextjs";
import OpenAI from 'openai';

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!process.env.GITHUB_TOKEN) {
    console.error("GITHUB_TOKEN no configurat al servidor.");
    return res.status(500).json({ error: "GITHUB_TOKEN no configurat al servidor." });
  }

  const token = process.env.GITHUB_TOKEN;
  const endpoint = "https://models.github.ai/inference";
  const openai = new OpenAI({ baseURL: endpoint, apiKey: token });

  const { imageData, imageType } = req.body; // e.g., imageType = 'image/jpeg' or 'image/png'

  if (!imageData || !imageType) {
    return res.status(400).json({ error: "Missing imageData or imageType in request body." });
  }

  const prompt = `Analyze the provided image, which is likely an event poster or similar promotional material. Extract the following details:
- title: The main title or name of the event.
- description: A brief, concise description of the event.
- startDate: The start date of the event in YYYY-MM-DD format. If the year is not specified, assume the current year or the next upcoming year if the date has passed.
- endDate: The end date of the event in YYYY-MM-DD format. If it's a single-day event, endDate should be the same as startDate. If no end date is discernible, use the same as startDate.
- location: The venue or location of the event.

Return the information as a JSON object with the keys: "title", "description", "startDate", "endDate", "location".
If any specific piece of information cannot be found in the image, return null for that field. For example, if a description is not present, the JSON should be { "title": "Example Event", "description": null, ... }.
Ensure dates are strictly in YYYY-MM-DD format. If a specific day cannot be determined (e.g. "Mid July"), return null for the date field.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${imageType};base64,${imageData}`,
                detail: "low" // low detail is sufficient for text extraction and costs less
              },
            },
          ],
        },
      ],
      max_tokens: 500, // Increased slightly to accommodate potentially verbose descriptions or titles
      response_format: { type: "json_object" },
    });

    const messageContent = response.choices[0].message.content;
    
    if (!messageContent) {
      console.error("OpenAI response content is empty.");
      return res.status(500).json({ error: "Failed to analyze image: Empty response from AI." });
    }

    let structuredData = null;
    try {
      structuredData = JSON.parse(messageContent);
    } catch (e) {
      console.error("Failed to parse OpenAI JSON response:", e);
      console.error("Raw OpenAI response:", messageContent);
      return res.status(500).json({ error: "Failed to parse analysis results. The AI response was not valid JSON.", rawResponse: messageContent });
    }

    // Basic validation of the structure, though JSON_object mode should guarantee it
    if (!structuredData || typeof structuredData.title === 'undefined') {
        console.error("Parsed data does not have the expected structure:", structuredData);
        return res.status(500).json({ error: "Parsed analysis results have an unexpected structure.", data: structuredData });
    }

    return res.status(200).json(structuredData);

  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    let errorMessage = "Failed to analyze image.";
    if (error.response) {
      console.error("OpenAI API Error Response:", error.response.data);
      errorMessage = error.response.data.error ? error.response.data.error.message : errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return res.status(500).json({ error: errorMessage });
  }
}

export default withSentry(handler);
