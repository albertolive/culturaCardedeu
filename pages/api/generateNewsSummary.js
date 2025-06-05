import { withSentry } from "@sentry/nextjs"; // Assuming you use Sentry
import OpenAI from "openai";
import {
  week as getWeekDateRange,
  weekend as getWeekendDateRange,
} from "@lib/dates"; // Ensure this path is correct
import { getCalendarEvents } from "@lib/helpers"; // Ensure this path is correct
import { slug } from "@utils/helpers"; // Ensure this path is correct
import { MONTHS } from "@utils/constants"; // Import Catalan month names

// Helper function to strip HTML tags and clean text
function stripHtmlAndClean(text) {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// Helper function to format week range in Catalan
function formatWeekRangeInCatalan(from, until) {
  const startDate = new Date(from);
  const endDate = new Date(until);

  // Adjust end date to be the last day of the week (Sunday)
  const adjustedEndDate = new Date(endDate);
  adjustedEndDate.setDate(adjustedEndDate.getDate() - 1);

  const startDay = startDate.getDate();
  const endDay = adjustedEndDate.getDate();
  const month = adjustedEndDate.getMonth(); // Use end date month as it's more reliable for week ranges
  const year = adjustedEndDate.getFullYear();

  const monthName = MONTHS[month];

  return `Setmana del ${startDay} al ${endDay} de ${monthName} de ${year}`;
}

// Helper function to format weekend range in Catalan
function formatWeekendRangeInCatalan(from, until) {
  const startDate = new Date(from);
  const endDate = new Date(until);

  // Adjust end date to be the last day of the weekend (Sunday)
  const adjustedEndDate = new Date(endDate);
  adjustedEndDate.setDate(adjustedEndDate.getDate() - 1);

  const startDay = startDate.getDate();
  const endDay = adjustedEndDate.getDate();
  const month = adjustedEndDate.getMonth();
  const year = adjustedEndDate.getFullYear();

  const monthName = MONTHS[month];

  return `Cap de setmana del ${startDay} al ${endDay} de ${monthName} de ${year}`;
}

// Helper function to generate event URL
function generateEventUrl(event) {
  if (!event.title || !event.formattedStart || !event.id) {
    console.warn(
      "[generateNewsSummary] generateEventUrl: Missing required event properties. Event:",
      event
    );
    return null;
  }
  const eventSlug = slug(event.title, event.formattedStart, event.id);
  return `${process.env.NEXT_PUBLIC_DOMAIN_URL}/${eventSlug}`;
}

// Helper function to prepare clean event data.
function prepareEventForAIAndAssembly(eventFromGetCalendarEvents) {
  const cleanDescription = stripHtmlAndClean(
    eventFromGetCalendarEvents.description
  );
  const eventUrl = generateEventUrl(eventFromGetCalendarEvents);

  return {
    id: eventFromGetCalendarEvents.id,
    title: eventFromGetCalendarEvents.title,
    images: eventFromGetCalendarEvents.images || [],
    imageUploaded: eventFromGetCalendarEvents.imageUploaded,
    description: cleanDescription,
    location: eventFromGetCalendarEvents.location,
    startDate: eventFromGetCalendarEvents.formattedStart,
    startTime: eventFromGetCalendarEvents.startTime,
    eventUrl: eventUrl,
    slug: eventFromGetCalendarEvents.slug,
  };
}

async function handler(req, res) {
  const LOG_PREFIX = "[generateNewsSummary]";

  // Determine summary type from query parameter
  const summaryType = req.query.type || "weekly";
  const isWeekendSummary = summaryType === "weekend";

  console.log(
    `🚀 ${LOG_PREFIX} Starting ${summaryType} summary generation (Structured JSON + Tailwind HTML Assembly)...`
  );

  // Authentication: GitHub Actions (via secret token) + localhost for development
  if (process.env.NODE_ENV === "production") {
    // In production, require secret token for GitHub Actions
    const authToken =
      req.headers.authorization?.replace("Bearer ", "") ||
      req.headers["x-api-token"];
    const expectedToken = process.env.WORKFLOW_SECRET;

    if (!expectedToken) {
      console.error(`❌ ${LOG_PREFIX} WORKFLOW_SECRET not configured`);
      return res.status(500).json({ error: "Server configuration error." });
    }

    if (!authToken || authToken !== expectedToken) {
      console.log(`❌ ${LOG_PREFIX} Unauthorized access attempt in production`);
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid or missing token." });
    }

    console.log(`✅ ${LOG_PREFIX} Authenticated GitHub Actions request`);
  } else {
    // In development, allow localhost only
    const requestOrigin = req.headers.origin;
    if (requestOrigin && !/^http:\/\/localhost:\d+$/.test(requestOrigin)) {
      console.log(
        `❌ ${LOG_PREFIX} Forbidden origin in development:`,
        requestOrigin
      );
      return res
        .status(403)
        .json({ error: "Forbidden: Invalid origin in development." });
    }
    console.log(`✅ ${LOG_PREFIX} Development request from localhost`);
  }
  if (req.method !== "POST" && req.method !== "GET") {
    console.log(`❌ ${LOG_PREFIX} Invalid method:`, req.method);
    return res
      .status(405)
      .json({ error: "Method Not Allowed. Use GET or POST." });
  }
  console.log(`✅ ${LOG_PREFIX} Method accepted:`, req.method);

  // --- Environment Variable Checks ---
  console.log(`🔐 ${LOG_PREFIX} Checking environment variables...`);
  const criticalEnvVars = {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    NEWS_CALENDAR_ID_OR_NEXT:
      process.env.NEWS_CALENDAR_ID || process.env.NEXT_PUBLIC_NEWS_CALENDAR_ID,
    NEXT_PUBLIC_CREATE_NEWS_EVENT: process.env.NEXT_PUBLIC_CREATE_NEWS_EVENT,
    NEXT_PUBLIC_DOMAIN_URL: process.env.NEXT_PUBLIC_DOMAIN_URL,
  };

  // Check WORKFLOW_SECRET only in production
  if (process.env.NODE_ENV === "production") {
    criticalEnvVars.WORKFLOW_SECRET = process.env.WORKFLOW_SECRET;
  }
  for (const [key, value] of Object.entries(criticalEnvVars)) {
    console.log(`- ${key}:`, value ? "✅ Set" : "❌ Missing");
    if (!value) {
      const errorMessage = `${key} no configurat al servidor.`;
      console.error(`❌ ${LOG_PREFIX} ${errorMessage}`);
      return res.status(500).json({ error: errorMessage });
    }
  }
  console.log(
    "- GITHUB_MODELS_ENDPOINT:",
    process.env.GITHUB_MODELS_ENDPOINT ? "✅ Set" : "ℹ️ Not Set (using default)"
  );
  console.log("- NODE_ENV:", process.env.NODE_ENV);

  // --- Configuration ---
  const NEWS_CALENDAR_ID =
    process.env.NEWS_CALENDAR_ID || process.env.NEXT_PUBLIC_NEWS_CALENDAR_ID;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_MODELS_ENDPOINT =
    process.env.GITHUB_MODELS_ENDPOINT || "https://models.github.ai/inference";

  console.log(
    `⚙️ ${LOG_PREFIX} Configuration: NEWS_CALENDAR_ID: ${NEWS_CALENDAR_ID}, GITHUB_MODELS_ENDPOINT: ${GITHUB_MODELS_ENDPOINT}`
  );
  const openai = new OpenAI({
    baseURL: GITHUB_MODELS_ENDPOINT,
    apiKey: GITHUB_TOKEN,
  });

  try {
    const { from, until } = isWeekendSummary
      ? getWeekendDateRange()
      : getWeekDateRange();
    console.log(
      `📥 ${LOG_PREFIX} Fetching source calendar events for ${from.toISOString()} to ${until.toISOString()}...`
    );
    const { events } = await getCalendarEvents({
      from,
      until,
      maxResults: 20,
      filterByDate: false,
    });
    console.log(`📥 ${LOG_PREFIX} Raw events fetched:`, events?.length || 0);

    const cleanEventsForAIContextAndAssembly =
      events
        ?.filter((event) => !event.isAd)
        ?.map((event) => prepareEventForAIAndAssembly(event)) || [];

    let summaryOutput; // This will hold { title: "SEO Title", summary: "HTML Content" }

    if (cleanEventsForAIContextAndAssembly.length === 0) {
      console.log(`😴 ${LOG_PREFIX} No events found, using fallback summary.`);

      if (isWeekendSummary) {
        summaryOutput = {
          title: "Un cap de setmana tranquil a Cardedeu",
          summary:
            '<p class="text-lg text-gray-700 mb-6">Aquest cap de setmana serà més tranquil al món cultural de Cardedeu. Aprofita per passejar pels carrers del centre històric, gaudir de la natura als voltants o relaxar-te amb una bona lectura!</p>',
        };
      } else {
        summaryOutput = {
          title: "Una setmana tranquil·la a Cardedeu", // Adapt city
          summary:
            '<p class="text-lg text-gray-700 mb-6">Aquesta setmana serà més tranquil·la al món cultural de Cardedeu. Aprofita per descobrir els racons més bonics del poble o gaudir d\'una bona lectura!</p>',
        };
      }
    } else {
      const eventContextForAI = cleanEventsForAIContextAndAssembly
        .map(
          (event) =>
            `- ID: ${event.id}\n Títol Original: ${event.title}\n  Data: ${
              event.startDate
            }${
              event.startTime && event.startTime !== "00:00"
                ? ` a les ${event.startTime}`
                : ""
            }\n  Lloc: ${
              event.location || "N/A"
            }, Cardedeu \n  Descripció Original: ${
              event.description
            }...\n  URL Enllaç: ${event.eventUrl || "N/A"}`
        )
        .join("\n\n");

      // Format the date range in Catalan
      const formattedDateRange = isWeekendSummary
        ? formatWeekendRangeInCatalan(from, until)
        : formatWeekRangeInCatalan(from, until);

      console.log(
        `🤖 ${LOG_PREFIX} Generating AI summary using structured JSON approach...`
      );

      const promptPrefix = `Ets un assistent expert en generar contingut cultural estructurat en format JSON per a una web d'agenda cultural. Respon sempre en català. El contingut ha de seguir aquestes directrius:`;

      const contextSection = `CONTEXT DELS ESDEVENIMENTS ${
        isWeekendSummary ? "DEL CAP DE SETMANA" : "DE LA SETMANA"
      } (utilitza això per informar la teva redacció):
      ${eventContextForAI}

      ${
        isWeekendSummary ? "CAP DE SETMANA" : "SETMANA"
      } A RESUMIR: ${formattedDateRange}
              IMPORTANT: El títol SEO ha d'incloure exactament aquesta franja de dates i el mes correcte tal com s'indica aquí dalt.`;

      const periodWord = isWeekendSummary ? "cap de setmana" : "setmana";

      // Multiple creative examples inspired by Time Out Barcelona approach
      const seoTitleExamples = isWeekendSummary
        ? [
            "Que fer aquest cap de setmana a Cardedeu – Els millors plans del 3 al 5 de juny",
            "Cap de setmana perfecte a Cardedeu: del 3 al 5 de juny de 2024",
            "Descobreix Cardedeu aquest cap de setmana – Plans del 3 al 5 de juny",
            "Cultura i diversió a Cardedeu: cap de setmana del 3 al 5 de juny",
            "Els imprescindibles del cap de setmana a Cardedeu – 3 al 5 de juny",
            "Cardedeu t'espera aquest cap de setmana: plans del 3 al 5 de juny",
          ]
        : [
            "Agenda cultural a Cardedeu – Setmana del 3 al 9 de juny: dansa, escacs i exposicions",
            "Setmana cultural a Cardedeu: del 3 al 9 de juny de 2024",
            "Què fer aquesta setmana a Cardedeu – Plans del 3 al 9 de juny",
            "Cultura en directe a Cardedeu: setmana del 3 al 9 de juny",
            "Els millors events de la setmana a Cardedeu – 3 al 9 de juny",
            "Cardedeu vibra aquesta setmana: agenda del 3 al 9 de juny",
            "Descobreix la setmana cultural de Cardedeu – 3 al 9 de juny",
          ];

      const seoTitleExample =
        seoTitleExamples[Math.floor(Math.random() * seoTitleExamples.length)];

      const instructionsSection = `1. La resposta ha de ser un objecte JSON estructurat amb les següents claus:
        - "seoTitle": títol optimitzat per a cercadors (aproximat d'uns 50-60 caràcters), amb el nom del poble i la franja de dates. Sigues CREATIU i ORIGINAL! Pots usar diferents estils: pregunta directa ("Què fer..."), descriptiu ("Cultura i diversió..."), emotiu ("Cardedeu t'espera..."), o informatiu ("Els millors events..."). Exemple: "${seoTitleExample}".
        - "metaDescription": descripció breu de 150-160 caràcters per a SEO, que resumeixi la proposta del ${periodWord}.
        - "introduction": paràgraf introductori en HTML amb classes EXACTES: class="text-lg text-gray-700 mb-6"
        - "events": array d'esdeveniments amb:
          - "originalEventId": identificador original
          - "heading": títol breu i cridaner de l'activitat
          - "description": paràgraf en HTML amb classes EXACTES: class="text-lg text-gray-700 mb-4", explicant data, hora, lloc i un enllaç amb el títol.
        - "conclusion": paràgraf en HTML amb classes EXACTES: class="text-lg text-gray-700 mt-8"

      2. Estil:
        - To periodístic, proper i informatiu
        - Ús de català correcte i ric
        - Evita frases genèriques; destaca què fa especial cada activitat
        - OBLIGATORI: utilitza sempre les classes EXACTES especificades per cada element

      3. Important:
        - Tot el contingut ha de ser 100% en català
        - Les dates han d'estar en format llarg amb el dia i el mes (ex: "el 6 de juny a les 19:00")
        - Els enllaços han de tenir EXACTAMENT aquestes classes: class="text-[#ECB84A] underline"
        - Mai utilitzis altres classes de Tailwind, només les especificades aquí`;

      const newPromptForStructuredJson = `${promptPrefix}

      ${contextSection}
      ${instructionsSection}

      Resposta només amb el JSON sol·licitat.`;

      const agendaOrPlans = isWeekendSummary
        ? "plans de cap de setmana"
        : "agenda cultural";
      const systemPrompt = `Ets un assistent especialitzat en continguts culturals de Cardedeu. Redacta un resum ${
        isWeekendSummary ? "del cap de setmana" : "setmanal"
      } periodístic i SEO-òptim en català. Utilitza un to neutre i informatiu (tercera persona) i estructura el text en HTML semàntic amb títols (<h1>, <h2>), paràgrafs curts i llistes quan convingui. Emprar paraules clau rellevants (p. ex. 'Cardedeu', '${agendaOrPlans}', noms d'esdeveniments destacats) en titulars i descripcions. Inclou una meta descripció atractiva amb paraules clau al front. Assegura't que les classes de Tailwind CSS (per ex. text-lg, font-medium) s'apliquin a paràgrafs i enllaços quan pertoqui. Només respon en format JSON vàlid seguint l'esquema indicat, sense cap text extra. Respon sempre en català`;

      const aiResponse = await openai.chat.completions.create({
        model: "openai/gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          { role: "user", content: newPromptForStructuredJson },
        ],
        max_tokens: 3500, // Increased for detailed structured JSON and potential Tailwind classes
        temperature: 0.5,
        response_format: { type: "json_object" },
      });

      const aiMessageContent = aiResponse.choices[0].message.content;

      if (!aiMessageContent)
        throw new Error("OpenAI response content is empty.");
      const structuredAiData = JSON.parse(aiMessageContent);
      if (
        !structuredAiData ||
        !structuredAiData.seoTitle ||
        !structuredAiData.events
      ) {
        throw new Error(
          "AI did not return the expected structured JSON format."
        );
      }
      console.log(
        `✅ ${LOG_PREFIX} Successfully parsed structured JSON from AI.`
      );

      // --- API-SIDE HTML ASSEMBLY with Tailwind CSS ---
      console.log(
        `🛠️ ${LOG_PREFIX} Assembling final HTML from structured AI data...`
      );
      let finalHtmlSummary = "";
      const defaultIntroduction = isWeekendSummary
        ? `<p class="text-lg text-gray-700 mb-6">Descobreix els millors plans per gaudir aquest cap de setmana a Cardedeu!</p>`
        : `<p class="text-lg text-gray-700 mb-6">Comença la setmana amb energia cultural a Cardedeu!</p>`;

      finalHtmlSummary += structuredAiData.introduction || defaultIntroduction;

      if (structuredAiData.events && Array.isArray(structuredAiData.events)) {
        structuredAiData.events.forEach((aiEventSection, index) => {
          if (
            !aiEventSection.originalEventId ||
            !aiEventSection.heading ||
            !aiEventSection.description
          ) {
            console.warn(
              `⚠️ ${LOG_PREFIX} Skipping malformed AI event section:`,
              aiEventSection
            );
            return; // Skip this iteration
          }

          const originalEvent = cleanEventsForAIContextAndAssembly.find(
            (ce) => ce.id === aiEventSection.originalEventId
          );

          let imageUrl = null;
          let imageAltText = aiEventSection.heading.replace(/"/g, "&quot;");

          if (originalEvent) {
            let imgPath = null;

            // First try imageUploaded, then fall back to images array
            if (
              originalEvent.imageUploaded &&
              originalEvent.imageUploaded.length > 0
            ) {
              imgPath = originalEvent.imageUploaded;
            } else if (
              originalEvent.images &&
              originalEvent.images.length > 0
            ) {
              imgPath = originalEvent.images[0];
            }

            if (imgPath) {
              imageUrl = imgPath.startsWith("http")
                ? imgPath
                : `${process.env.NEXT_PUBLIC_DOMAIN_URL}${
                    imgPath.startsWith("/") ? "" : "/"
                  }${imgPath}`;
              imageAltText = originalEvent.title.replace(/"/g, "&quot;");
            }
          }

          // Spacing and separator: Add border to all except the last one.
          const isLastItem = index === structuredAiData.events.length - 1;
          const itemClasses = `news-highlight-item py-6 ${
            isLastItem ? "mb-6" : "mb-8 pb-8 border-b border-gray-200"
          }`;

          finalHtmlSummary += `<div class="${itemClasses}">`;
          if (imageUrl) {
            finalHtmlSummary += `<img src="${imageUrl}" alt="${imageAltText}" class="w-full max-w-sm h-auto mb-4 rounded-lg block mx-auto shadow-md">`;
          }
          finalHtmlSummary += `<h2 class="text-2xl font-bold text-gray-800 mt-3 mb-3">${aiEventSection.heading}</h2>`;
          finalHtmlSummary += aiEventSection.description; // This already has Tailwind classes from AI's prompt
          finalHtmlSummary += `</div>`;
        });
      }
      const defaultConclusion = isWeekendSummary
        ? `<p class="text-lg text-gray-700 mt-8">Gaudeix al màxim d'aquest cap de setmana i consulta l'agenda completa per a més plans!</p>`
        : `<p class="text-lg text-gray-700 mt-8">Consulta l'agenda completa per a més detalls!</p>`;

      finalHtmlSummary += structuredAiData.conclusion || defaultConclusion;
      console.log(
        `✅ ${LOG_PREFIX} Final HTML assembled. Length:`,
        finalHtmlSummary.length
      );

      summaryOutput = {
        title:
          structuredAiData.seoTitle || "Resum Setmanal Cultural de Cardedeu",
        summary: finalHtmlSummary,
      };
    }

    // --- Create calendar event with the summary using Pipedream ---
    console.log(
      `📅 ${LOG_PREFIX} Preparing data for Pipedream to create calendar event...`
    );

    // Use appropriate date range for calendar event based on summary type
    const { from: eventRangeStart, until: eventRangeEnd } = isWeekendSummary
      ? getWeekendDateRange()
      : getWeekDateRange();
    const eventStartTime = new Date(eventRangeStart);
    eventStartTime.setHours(0, 0, 0, 0);

    // eventRangeEnd from getWeekendDateRange/getWeekDateRange is typically exclusive
    // (e.g., Monday 00:00:00 for a summary period ending Sunday 23:59:59).
    // To get the actual last day of the period for the calendar event, we subtract one day
    // from eventRangeEnd and then set it to the end of that day.
    const actualLastDayOfPeriod = new Date(eventRangeEnd);
    actualLastDayOfPeriod.setDate(actualLastDayOfPeriod.getDate() - 1);
    actualLastDayOfPeriod.setHours(23, 59, 59, 999);

    let selectedEventImageForCalendar = null;
    const firstEventWithImage = cleanEventsForAIContextAndAssembly.find(
      (event) =>
        event.imageUploaded &&
        event.imageUploaded.length > 0 &&
        event.images &&
        event.images.length > 0
    );
    if (firstEventWithImage) {
      const imgPath = firstEventWithImage.imageUploaded;
      selectedEventImageForCalendar = imgPath.startsWith("http")
        ? imgPath
        : `${process.env.NEXT_PUBLIC_DOMAIN_URL}${
            imgPath.startsWith("/") ? "" : "/"
          }${imgPath}`;
    } else {
      selectedEventImageForCalendar = `${process.env.NEXT_PUBLIC_DOMAIN_URL}/static/images/banners/cultura-cardedeu-banner-0.jpeg`; // Default
    }

    const eventDataForPipedream = {
      title: summaryOutput.title, // This is the SEO Title, H1 for the page
      description: summaryOutput.summary, // The fully assembled HTML body with H2s, images, etc.
      startDate: eventStartTime.toISOString(),
      endDate: actualLastDayOfPeriod.toISOString(), // Use the corrected end date
      location: "Cardedeu", // Adapt city
      colorId: isWeekendSummary ? "10" : "9", // Different color for weekend events
      eventImage: selectedEventImageForCalendar, // Main image for the GCal event if Pipedream uses it
    };

    console.log(
      `💾 ${LOG_PREFIX} Sending event to Pipedream... Target Calendar: ${NEWS_CALENDAR_ID}`
    );
    const pipedreamResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_CREATE_NEWS_EVENT
      }?calendarId=${encodeURIComponent(NEWS_CALENDAR_ID)}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventDataForPipedream),
      }
    );

    if (!pipedreamResponse.ok) {
      let errorDetail = `Pipedream request failed: ${pipedreamResponse.status} ${pipedreamResponse.statusText}`;
      try {
        const errorData = await pipedreamResponse.json();
        errorDetail = errorData?.error || JSON.stringify(errorData);
      } catch (e) {
        errorDetail = await pipedreamResponse.text().catch(() => errorDetail);
      }
      console.error(`❌ ${LOG_PREFIX} Pipedream Error:`, errorDetail);
      throw new Error(errorDetail);
    }

    const pipedreamResult = await pipedreamResponse.json();
    const newEventId = pipedreamResult.id;
    console.log(
      `✅ ${LOG_PREFIX} Calendar event created via Pipedream! ID:`,
      newEventId
    );

    // Optional: Ping Google sitemap
    try {
      console.log(`📊 ${LOG_PREFIX} Notifying search engines...`);
      await fetch(
        `http://www.google.com/ping?sitemap=${encodeURIComponent(
          `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/sitemap-news`
        )}`
      );
      console.log(`✅ ${LOG_PREFIX} Search engines notified.`);
    } catch (e) {
      console.warn(
        `⚠️ ${LOG_PREFIX} Failed to notify search engines:`,
        e.message
      );
    }

    return res.status(200).json({
      success: true,
      summary: summaryOutput,
      event: { id: newEventId },
      eventsProcessed: cleanEventsForAIContextAndAssembly.length,
    });
  } catch (error) {
    console.error(
      `❌ ${LOG_PREFIX} Critical error:`,
      error.message,
      error.stack
    );
    return res
      .status(500)
      .json({ error: error.message || "Failed to generate news summary." });
  }
}

export default withSentry(handler);
