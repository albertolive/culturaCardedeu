import { withSentry } from "@sentry/nextjs";
import OpenAI from "openai";

async function handler(req, res) {
  const requestOrigin = req.headers.origin;

  if (requestOrigin) {
    // Only check if Origin header is present
    if (process.env.NODE_ENV === "production") {
      const allowedProdOrigins = [
        "https://www.culturacardedeu.com",
        "http://www.culturacardedeu.com", // To handle cases if site is accessed via HTTP
        "www.culturacardedeu.com",
      ];
      if (!allowedProdOrigins.includes(requestOrigin)) {
        return res.status(403).json({ error: "Forbidden: Invalid origin." });
      }
    } else {
      // Development or other non-production environments
      // For development, allow any localhost origin (e.g., http://localhost:3000)
      if (!/^http:\/\/localhost:\d+$/.test(requestOrigin)) {
        return res
          .status(403)
          .json({ error: "Forbidden: Invalid origin in development." });
      }
    }
  }
  // If Origin header is not present, allow by default.
  // This covers same-origin requests (browser might not send 'Origin')
  // and non-browser clients (curl, Postman).

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!process.env.GITHUB_TOKEN) {
    console.error("GITHUB_TOKEN no configurat al servidor.");
    return res
      .status(500)
      .json({ error: "GITHUB_TOKEN no configurat al servidor." });
  }

  const token = process.env.GITHUB_TOKEN;
  const endpoint = "https://models.github.ai/inference";
  const openai = new OpenAI({ baseURL: endpoint, apiKey: token });

  const { imageData, imageType } = req.body; // e.g., imageType = 'image/jpeg' or 'image/png'

  if (!imageData || !imageType) {
    return res
      .status(400)
      .json({ error: "Missing imageData or imageType in request body." });
  }

  const prompt = `# TASK: Cultural Event Poster Analysis for Cardedeu

You are GPT-4o (multimodal). You will receive an image of a cultural-event poster. Your sole output must be a single JSON object—no extra text or formatting—conforming exactly to the schema below.

## JSON SCHEMA
{
  "title": string|null,       // SEO H1 (≤70 chars)
  "description": string|null, // Catalan description (150–500 words; opening meta ≤160 chars) + at least two paragraphs separated by "\\n" (literal backslash+n)
  "startDate": string|null,   // ISO 8601 date or datetime (YYYY-MM-DD or YYYY-MM-DDTHH:mm)
  "endDate": string|null,     // Same as startDate
  "location": string|null     // Specific Cardedeu venue
}

## FIELD RULES

1. title
    • Max 70 chars, impactful, keyword-rich.
    • If no clear title → null.

2. description
    • Must start with an opening meta (≤160 chars). Then include at least two body paragraphs separated by the literal sequence "\\n" (backslash+n).
    • Aim for 300–500 words total; if insufficient data, at least 150 words.
    • Integrate any visible accessibility or category details into this narrative.
    • Include event type, participants, unique Cardedeu context, audience, pricing (if visible).
    • Natural, engaging Catalan; no keyword stuffing.
    • If insufficient info → null.

3. startDate / endDate
    • Dates must strictly match ISO 8601: YYYY-MM-DD or YYYY-MM-DDTHH:mm (zero-padded two-digit month and day, optional time). No extra characters; if unable to format properly, return null.
    • If a weekday (e.g., 'dissabte') is provided with the date, choose the year when that month-day falls on that weekday (prefer current year, otherwise next year). If no weekday given or still ambiguous, then if month/day ≥ today → current year; else → next year.
    • Single-day events: endDate = startDate. Multi-day: use actual end date.
    • If still unclear → null.

4. location
    • Specific venue in Cardedeu (e.g., "Teatre Auditori de Cardedeu").
    • Map generic names: "teatre municipal" → "Teatre Municipal de Cardedeu".
    • If none → null.

## ANALYSIS GUIDELINES

- Prioritize clearly readable text; never hallucinate.
- Translate non-Catalan text accurately into Catalan.
- Enforce all character limits and data formats exactly.
- Use null for unknown or unclear fields.
- Only return the JSON object—no extra commentary.

## EXAMPLE OUTPUT
{
  "title": "Concert de Jazz al Teatre Municipal de Cardedeu",
  "description": "Vine a gaudir del millor jazz al cor de Cardedeu amb artistes internacionals.\n\nEl Teatre Municipal de Cardedeu presentarà una nit única amb melodies clàssiques i arranjaments originals. L'esdeveniment, pensat per a adults, ofereix un ambient íntim i acollidor. Entrades: 15€ a taquilla i en línia.",
  "startDate": "2025-06-15T21:00",
  "endDate": "2025-06-15T23:30",
  "location": "Teatre Municipal de Cardedeu"
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${imageType};base64,${imageData}`,
                detail: "auto", // medium detail is sufficient for text extraction and costs less
              },
            },
          ],
        },
      ],
      max_tokens: 1200, // Increased to accommodate detailed descriptions
      response_format: { type: "json_object" },
    });

    const messageContent = response.choices[0].message.content;

    if (!messageContent) {
      console.error("OpenAI response content is empty.");
      return res
        .status(500)
        .json({ error: "Failed to analyze image: Empty response from AI." });
    }

    let structuredData = null;
    try {
      structuredData = JSON.parse(messageContent);
    } catch (e) {
      console.error("Failed to parse OpenAI JSON response:", e);
      console.error("Raw OpenAI response:", messageContent);
      return res.status(500).json({
        error:
          "Failed to parse analysis results. The AI response was not valid JSON.",
        rawResponse: messageContent,
      });
    }

    // Basic validation of the structure, though JSON_object mode should guarantee it
    if (
      !structuredData ||
      typeof structuredData.title === "undefined" ||
      typeof structuredData.description === "undefined" // Validating the consolidated description field
    ) {
      console.error(
        "Parsed data does not have the expected structure:",
        structuredData
      );
      return res.status(500).json({
        error: "Parsed analysis results have an unexpected structure.",
        data: structuredData,
      });
    }

    return res.status(200).json(structuredData);
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    let errorMessage = "Failed to analyze image.";
    if (error.response) {
      console.error("OpenAI API Error Response:", error.response.data);
      errorMessage = error.response.data.error
        ? error.response.data.error.message
        : errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return res.status(500).json({ error: errorMessage });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

export default withSentry(handler);
