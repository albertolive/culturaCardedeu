// Hosted ai-gateway client for application runtime code (not CI).
//
// Points at the shared ai-gateway endpoint (albertolive/ai-gateway), which
// resolves a cascade name to a provider/model/key and fails over across the
// whole cascade server-side. This repo holds ONE key (GATEWAY_TOKEN) and sends
// a cascade name — never a provider, model id, or provider API key — so a
// model swap or deprecation is a one-line edit in ai-gateway, not here.
//
// Usage:
//   import { complete } from "@lib/gatewayClient";
//   const text = await complete("Summarize this weather forecast: ...");
//   const text = await complete("...", { cascade: "frontier" }); // paid, opt-in
//
// Env: GATEWAY_TOKEN (required). Optional: AI_GATEWAY_URL to override the
//      endpoint (defaults to the hosted ai-gateway).
//
// Note: vision is NOT served by the gateway yet — /api/analyzeImage calls
// Gemini directly for that, and is the one documented exception.

const GATEWAY_URL =
  process.env.AI_GATEWAY_URL ||
  "https://ai-gateway-livid-eight.vercel.app/api/chat/completions";

export async function complete(prompt, { cascade = "general", system, temperature = 0.1 } = {}) {
  const token = process.env.GATEWAY_TOKEN;
  if (!token) {
    throw new Error("GATEWAY_TOKEN not set");
  }

  const messages = [
    ...(system ? [{ role: "system", content: system }] : []),
    { role: "user", content: prompt },
  ];

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: cascade, messages, temperature }),
  });

  if (!res.ok) {
    throw new Error(`ai-gateway HTTP ${res.status}: ${await res.text()}`);
  }

  const body = await res.json();
  return body.choices?.[0]?.message?.content ?? null;
}
