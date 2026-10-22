// Run: node lib/parseAiJson.check.mjs
// The two raw replies below are real production failures from
// /api/analyzeImage (2026-10-22): a raw line break inside "description".
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("./parseAiJson.js", import.meta.url));
const { parseAiJson } = await import(
  "data:text/javascript;base64," + src.toString("base64")
);

const failures = [
  {
    "name": "failure at char 229",
    "raw": "{\n  \"title\": \"2es Jornades de Pensament i Consciència de Cardedeu\",\n  \"description\": \"Participa en les 2es Jornades de Pensament i Consciència de Cardedeu amb conferències, cinema, exposicions i diàlegs sobre presons i llibertat.\n\nAquestes jornades culturals i de reflexió se celebren a diversos espais emblemàtics de Cardedeu, oferint una programació diversa i profunda centrada en la llibertat, els drets humans i la memòria històrica. Entre els actes destacats hi trobem la projecció del documental \\\"Les culpables\\\" de la cardedeuenca Marta Duran a l'Esbarjo, conferències filosòfiques a la Fàbrica de Cultura amb Nacho Bañeres, i el concert d'Albert Marquès \\\"Amplify voices\\\" al TAC, el qual busca amplificar les veus de les persones afectades per la violència institucional i la censura.\n\nEl cicle també compta amb una exposició commemorativa dels 40 anys de tallers artístics a les presons de Catalunya, així com taules de diàleg i presentacions amb figures rellevants com el M.H. President del Parlament Sr. Josep Rull i el Sr. Raül Romeva a les sales polivalents Tèxtil Rase Vella, i actes amb Montserrat Dameson a l'Espai Awen. És una oportunitat única per al debat ciutadà, la empatia i el creixement cultural al nostre municipi.\",\n  \"startDate\": \"2026-10-16T19:00\",\n  \"endDate\": \"2026-11-06T20:00\",\n  \"location\": \"Cardedeu\"\n}",
    "title": "2es Jornades de Pensament i Consciència de Cardedeu",
    "words": 182,
    "startDate": "2026-10-16T19:00",
    "endDate": "2026-11-06T20:00",
    "location": "Cardedeu"
  },
  {
    "name": "failure at char 234",
    "raw": "{\n  \"title\": \"2es Jornades de Pensament i Consciència de Cardedeu\",\n  \"description\": \"Participa en les 2es Jornades de Pensament i Consciència de Cardedeu sota el lema \\\"Presons i Llibertat\\\", amb un programa divers d'actes culturals.\n\nAquestes jornades culturals i de reflexió se celebren a diversos espais de Cardedeu entre el 16 d'octubre i el 6 de novembre de 2026. El programa inclou la projecció del documental \\\"Les culpables\\\" de la cardedeuenca Marta Duran a l'Esbarjo amb col·loqui posterior sobre l'avortament adolescent, la conferència del filòsof Nacho Bañeres titulada \\\"El narcisisme i la presó del jo\\\" a la Fàbrica de Cultura S2, i el concert d'Albert Marquès \\\"Amplify voices\\\" al TAC per amplificar veus afectades per la violència institucional i la censura.\\n\\nAl llarg de les setmanes, el cicle també compta amb l'exposició dels 40 anys de tallers artístics a les presons de Catalunya a la Fàbrica de Cultura, així com la mostra de treballs artístics de tapissos, fotografia, pintura i ceràmica oberta fins al 6 de novembre. Destaca també el diàleg titulat \\\"La presó: perspectiva personal i política\\\" amb el M.H. President del Parlament Sr. Josep Rull i el H. Sr. Raül Romeva a les Sales Polivalents Tèxtil Rase Vella, i finalment un col·loqui amb Montserrat Dameson a l'Espai Awen sobre el seu llibre \\\"El lloc sagrat\\\". Un esdeveniment profund i obert a tota la ciutadania per promoure el debat empàtic i la llibertat.\",\n  \"startDate\": \"2026-10-16T19:00\",\n  \"endDate\": \"2026-11-06T20:00\",\n  \"location\": \"Cardedeu\"\n}",
    "title": "2es Jornades de Pensament i Consciència de Cardedeu",
    "words": 222,
    "startDate": "2026-10-16T19:00",
    "endDate": "2026-11-06T20:00",
    "location": "Cardedeu"
  }
];

for (const f of failures) {
  assert.throws(() => JSON.parse(f.raw), "strict JSON.parse must reject it");
  const d = parseAiJson(f.raw);
  assert.deepEqual(Object.keys(d), ["title", "description", "startDate", "endDate", "location"]);
  assert.equal(d.title, f.title);
  assert.equal(d.description.split(/\s+/).length, f.words);
  assert.equal(d.startDate, f.startDate);
  assert.equal(d.endDate, f.endDate);
  assert.equal(d.location, f.location);
  assert.ok(d.description.includes("\n"), "line break survives as a newline");
}

const valid = { title: "T", description: "a\nb", startDate: null, endDate: null, location: null };
assert.deepEqual(parseAiJson(JSON.stringify(valid)), valid);
assert.deepEqual(parseAiJson("```json\n" + JSON.stringify(valid, null, 2) + "\n```"), valid);
assert.throws(() => parseAiJson("not json"));

console.log("parseAiJson ok");
