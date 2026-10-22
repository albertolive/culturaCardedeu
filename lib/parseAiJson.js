// Parses a JSON reply from an AI model.
//
// Models wrap JSON in a markdown code fence even when told not to, and
// sometimes put raw line breaks inside string values, which JSON.parse
// rejects. The retry escapes control characters inside string literals only,
// so a raw line break and an escaped "\n" decode to the same string.
//
// Check: node lib/parseAiJson.check.mjs

const escapeControlCharsInStrings = (text) =>
  text.replace(/"(?:[^"\\]|\\.)*"/g, (str) =>
    str.replace(
      /[\x00-\x1f]/g,
      (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"),
    ),
  );

export function parseAiJson(text) {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return JSON.parse(escapeControlCharsInStrings(cleaned));
  }
}
