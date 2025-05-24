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

  const prompt = `Analitza la imatge proporcionada, que probablement és un cartell d'esdeveniment o material promocional similar. Extreu els següents detalls en català, estructurats en un objecte JSON. Assegura't que tot el contingut sigui 100% en català, utilitzi expressions culturals locals quan sigui apropiat, sigui únic, original, eviti contingut duplicat i mantingui la naturalitat del llenguatge.

Extreu els següents camps:

- title: El títol principal o nom de l'esdeveniment, optimitzat per a SEO com un títol H1. Ha de ser concís (idealment menys de 70 caràcters), impactant, incloure paraules clau rellevants i, si és un aspecte clau, la ubicació (p.ex., "Concert de Jazz a Cardedeu"). Ha de representar amb precisió l'esdeveniment i ser atractiu per a l'audiència.

- description: Un text descriptiu complet i detallat de l'esdeveniment (objectiu 300-500 paraules), basat en la informació visual de la imatge i optimitzat per a SEO. Aquest camp ha d'integrar diversos aspectes:
    1.  **Inici Concís (Meta Descripció)**: Comença la descripció amb un resum molt breu i atractiu (màxim 160 caràcters) que funcioni com una meta descripció. Aquest resum ha d'incloure paraules clau naturals sobre l'esdeveniment i animar a llegir més.
    2.  **Cos Detallat (Descripció Completa)**: Després del resum inicial, desenvolupa una descripció més extensa amb els següents punts:
        -   Estructura en paràgrafs curts i llegibles per facilitar la lectura. Separa els paràgrafs amb un sol salt de línia (utilitza \`\\n\` en la cadena JSON) per assegurar una bona llegibilitat en la visualització.
        -   Utilitza un to proper però professional, adequat per a la promoció d'un esdeveniment cultural.
        -   Inclou detalls específics de l'esdeveniment extrets de la imatge o inferits lògicament, salientant:
            -   Tipus d'esdeveniment cultural (concert, exposició, taller, xerrada, etc.).
            -   Artistes o participants principals (si n'hi ha).
            -   Aspectes únics o destacats de l'esdeveniment.
            -   Context cultural o històric rellevant (si aplica i es pot inferir).
            -   Públic objectiu al qual s'adreça (si es pot inferir).
            -   Valor cultural que aporta a la comunitat (si es pot inferir).
        -   **Optimització SEO integrada**: Al llarg de tota la descripció (tant el resum inicial com el cos detallat), incorpora de forma natural:
            -   Vocabulari cultural català específic i ric.
            -   Paraules clau rellevants (anteriorment pensades com una llista separada, ara integrades fluidament).
            -   Referències geogràfiques rellevants (més enllà de la ubicació principal, si és pertinent).
            -   Menciona institucions o entitats organitzadores/col·laboradores si apareixen a la imatge o són clarament deduïbles.
            -   Incorpora terminologia pròpia del sector cultural de manera fluida.
            -   Evita la sobrecàrrega de paraules clau (keyword stuffing); la prioritat és la llegibilitat i el valor per a l'usuari.

- startDate: La data i hora d'inici de l'esdeveniment en format YYYY-MM-DDTHH:mm. Si l'any no s'especifica, assumeix l'any actual o el següent si la data ja ha passat. Si l'hora i els minuts no són especificats o no es poden determinar, retorna només la data en format YYYY-MM-DD. Si no es pot determinar un dia específic (per exemple, "Mitjans de juliol"), retorna null.

- endDate: La data i hora de finalització de l'esdeveniment en format YYYY-MM-DDTHH:mm. Si és un esdeveniment d'un sol dia, endDate ha de ser igual a startDate (incloent l'hora si està disponible). Si l'hora i els minuts no són especificats o no es poden determinar, retorna només la data en format YYYY-MM-DD. Si no es pot determinar una data de finalització, utilitza la mateixa que startDate. Si no es pot determinar un dia específic, retorna null.

- location: El lloc o ubicació de l'esdeveniment. Si no es pot trobar, retorna null.

Requisits addicionals per a tots els camps de text:
1. Si no es pot trobar alguna informació específica per a un camp de text (ex. \`location\`), retorna \`null\` per aquest camp. Per \`startDate\` i \`endDate\`, si no es pot determinar una data/hora específica, segueix les instruccions de format o retorna \`null\` si no es pot ni tan sols determinar un dia.
2. Tots els textos han d'estar exclusivament en català. Si es detecta text en un altre idioma a la imatge, tradueix-lo al català.

Exemple de format de resposta JSON esperat:
{
  "title": "Festival de Jazz de Tardor a Cardedeu",
  "description": "Viu la màgia del jazz amb artistes internacionals al Teatre Principal de Cardedeu. No et perdis el concert inaugural del Festival de Jazz de Tardor!\\nEl Festival de Jazz de Tardor de Cardedeu torna un any més per omplir de música els racons de la ciutat. Aquesta edició comptarà amb la participació d'artistes de renom internacional així com talent local emergent, oferint una programació diversa que abraça des del jazz més clàssic fins a les fusions contemporànies més innovadores. Durant tres caps de setmana intensos, el Teatre Principal serà l'epicentre del festival, acollint els concerts principals. El concert inaugural, a càrrec del reconegut saxofonista internacional John Doe Quartet, promet ser una nit inoblidable... (continua la descripció fins a 300-500 paraules).",
  "startDate": "2024-10-15T21:30",
  "endDate": "2024-10-15T21:30",
  "location": "Teatre Principal"
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
                detail: "low", // low detail is sufficient for text extraction and costs less
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
