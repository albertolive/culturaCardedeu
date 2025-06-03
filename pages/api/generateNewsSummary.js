import { withSentry } from "@sentry/nextjs"; // Assuming you use Sentry
import OpenAI from "openai";
import { week as getWeekDateRange } from "@lib/dates"; // Ensure this path is correct
import { getCalendarEvents } from "@lib/helpers"; // Ensure this path is correct
import { slug } from "@utils/helpers"; // Ensure this path is correct

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
  console.log(
    `🚀 ${LOG_PREFIX} Starting news summary generation (Structured JSON + Tailwind HTML Assembly)...`
  );

  const requestOrigin = req.headers.origin;
  if (requestOrigin) {
    if (process.env.NODE_ENV === "production") {
      const allowedProdOrigins = [
        "https://www.culturacardedeu.com",
        "http://www.culturacardedeu.com",
        "www.culturacardedeu.com",
      ]; // Replace with your domain
      if (!allowedProdOrigins.includes(requestOrigin)) {
        console.log(
          `❌ ${LOG_PREFIX} Forbidden origin in production:`,
          requestOrigin
        );
        return res.status(403).json({ error: "Forbidden: Invalid origin." });
      }
    } else {
      if (!/^http:\/\/localhost:\d+$/.test(requestOrigin) && requestOrigin) {
        console.log(
          `❌ ${LOG_PREFIX} Forbidden origin in development:`,
          requestOrigin
        );
        return res
          .status(403)
          .json({ error: "Forbidden: Invalid origin in development." });
      }
    }
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
    const { from, until } = getWeekDateRange();
    console.log(
      `📥 ${LOG_PREFIX} Fetching source calendar events for ${from.toISOString()} to ${until.toISOString()}...`
    );
    const { events } = await getCalendarEvents({
      from,
      until,
      maxResults: 5,
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
      summaryOutput = {
        title: "Una setmana tranquil·la a Cardedeu", // Adapt city
        summary:
          '<p class="text-lg text-gray-700">Aquesta setmana serà més tranquil·la al món cultural de Cardedeu. Aprofita per descobrir els racons més bonics del poble o gaudir d\'una bona lectura!</p>',
      };
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

      console.log(
        `🤖 ${LOG_PREFIX} Generating AI summary using structured JSON approach...`
      );
      const newPromptForStructuredJson = `
Ets un redactor cultural expert per a Cardedeu. La teva tasca és generar el contingut per a un post setmanal de notícies culturals.
Has de retornar un objecte JSON. No incloguis comentaris ni text fora del JSON.

CONTEXT DELS ESDEVENIMENTS DE LA SETMANA (utilitza això per informar la teva redacció):
${eventContextForAI}

ESTRUCTURA JSON DE RESPOSTA REQUERIDA:
{
  "seoTitle": "Un títol SEO concís i atractiu per a la pàgina de notícies (màx 60 caràcters, text pla). Inclou Cardedeu i paraules clau com 'agenda', 'plans', 'esdeveniments'. Aquest serà el títol principal de l'article (H1 a la pàgina).",
  "introductionHtml": "<p class=\"text-lg text-gray-700 mb-6\">Un paràgraf introductori (~100 paraules) en HTML que doni la benvinguda i presenti breument la setmana cultural. Inclou Cardedeu. Utilitza classes de Tailwind per a l'estil si ho consideres (ex: text-lg, text-gray-700, mb-6).</p>",
  "highlightedEvents": [
    {
      "originalEventId": "L'ID de l'esdeveniment original del context (ex: 'event_id_1'). Això és CRUCIAL per mapejar imatges posteriorment.",
      "aiGeneratedHeadingText": "Un títol breu i atractiu per a aquest esdeveniment destacat (text pla, sense HTML). Pot incloure un emoji rellevant al principi. Aquest text s'utilitzarà dins d'un <h2>.",
      "aiGeneratedDescriptionHtml": "<div class=\"text-gray-700 leading-relaxed\"><p>1-2 paràgrafs en HTML (<200 paraules en total) descrivint aquest esdeveniment de forma engrescadora. Inclou detalls clau. IMPRESCINDIBLE: dins d'aquesta descripció, crea un enllaç HTML <a class=\"text-blue-600 hover:text-blue-800 hover:underline font-medium\" href=\"URL_ENLLAÇ_DEL_CONTEXT\" title=\"TÍTOL_ORIGINAL_DEL_CONTEXT\">TEXT_DE_L_ENLLAÇ</a> cap a la pàgina de l'esdeveniment utilitzant la 'URL Enllaç' del context. El text de l'enllaç ha de ser el 'Títol Original' de l'esdeveniment o similar. L'atribut 'title' de l'enllaç també hauria de ser el 'Títol Original'. Pots utilitzar classes de Tailwind per a l'estil de l'enllaç.</p></div>"
    }
    // Repeteix aquesta estructura per a 4-6 esdeveniments destacats del context.
  ],
  "conclusionHtml": "<p class=\"text-lg text-gray-700 mt-8\">Un paràgraf de conclusió (~100 paraules) en HTML amb una crida a l'acció o una reflexió final. Anima a explorar més. Utilitza classes de Tailwind.</p>"
}

Instruccions addicionals:
- Selecciona entre 4 i 6 dels esdeveniments més interessants del context per destacar.
- Per cada esdeveniment destacat, assegura't que el "originalEventId" en el JSON correspon exactament a un "ID" del context proporcionat.
- La "aiGeneratedDescriptionHtml" ha d'incloure l'enllaç <a> com s'ha especificat.
- Mantingues un to proper, informatiu i entusiasta. Utilitza "Cardedeu" de forma natural.
- Tot l'HTML generat dins dels camps ...Html ha d'estar ben format.
`;

      const aiResponse = await openai.chat.completions.create({
        model: "openai/gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Ets un assistent expert en generar contingut cultural estructurat en format JSON, seguint estrictament les especificacions. Respon sempre en català. Inclou classes de Tailwind CSS dins l'HTML generat quan sigui apropiat per a paràgrafs i enllaços.",
          },
          { role: "user", content: newPromptForStructuredJson },
        ],
        max_tokens: 2500, // Increased for detailed structured JSON and potential Tailwind classes
        temperature: 0.7,
        response_format: { type: "json_object" },
      });

      const aiMessageContent = aiResponse.choices[0].message.content;
      if (!aiMessageContent)
        throw new Error("OpenAI response content is empty.");
      const structuredAiData = JSON.parse(aiMessageContent);
      if (
        !structuredAiData ||
        !structuredAiData.seoTitle ||
        !structuredAiData.highlightedEvents
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
      finalHtmlSummary +=
        structuredAiData.introductionHtml ||
        `<p class="text-lg text-gray-700 mb-6">Comença la setmana amb energia cultural a Cardedeu!</p>`;

      if (
        structuredAiData.highlightedEvents &&
        Array.isArray(structuredAiData.highlightedEvents)
      ) {
        structuredAiData.highlightedEvents.forEach((aiEventSection, index) => {
          if (
            !aiEventSection.originalEventId ||
            !aiEventSection.aiGeneratedHeadingText ||
            !aiEventSection.aiGeneratedDescriptionHtml
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
          let imageAltText = aiEventSection.aiGeneratedHeadingText.replace(
            /"/g,
            "&quot;"
          );

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
          const isLastItem =
            index === structuredAiData.highlightedEvents.length - 1;
          const itemClasses = `news-highlight-item py-6 ${
            isLastItem ? "mb-6" : "mb-8 pb-8 border-b border-gray-200"
          }`;

          finalHtmlSummary += `<div class="${itemClasses}">`;
          if (imageUrl) {
            finalHtmlSummary += `<img src="${imageUrl}" alt="${imageAltText}" class="w-full max-w-xl h-auto mb-4 rounded-lg block mx-auto shadow-md">`;
          }
          finalHtmlSummary += `<h2 class="text-2xl font-bold text-gray-800 mt-3 mb-3">${aiEventSection.aiGeneratedHeadingText}</h2>`;
          finalHtmlSummary += aiEventSection.aiGeneratedDescriptionHtml; // This already has Tailwind classes from AI's prompt
          finalHtmlSummary += `</div>`;
        });
      }
      finalHtmlSummary +=
        structuredAiData.conclusionHtml ||
        `<p class="text-lg text-gray-700 mt-8">Consulta l'agenda completa per a més detalls!</p>`;
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
    const { from: weekStart } = getWeekDateRange();
    const eventStartTime = new Date(weekStart);
    eventStartTime.setHours(0, 0, 0, 0);
    const eventEndTime = new Date(eventStartTime);
    eventEndTime.setHours(23, 59, 59, 999);

    let selectedEventImageForCalendar = null;
    const firstEventWithImage = cleanEventsForAIContextAndAssembly.find(
      (event) => event.images && event.images.length > 0
    );
    if (firstEventWithImage) {
      const imgPath = firstEventWithImage.images[0];
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
      endDate: eventEndTime.toISOString(),
      location: "Cardedeu", // Adapt city
      colorId: "9",
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
