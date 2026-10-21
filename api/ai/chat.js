import { isJsonRequest, secureApiRequest } from "../../server/apiSecurity.js";

const MODEL = "inclusionai/ling-3.0-flash:free";
const UPSTREAM_TIMEOUT_MS = 20_000;

export default async function handler(req, res) {
  if (!secureApiRequest(req, res)) return;

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!isJsonRequest(req)) {
    return res.status(415).json({ error: "Send this request as application/json." });
  }

  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: "A JSON object is required." });
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  const from = typeof body.from === "string" ? body.from.trim() : "";
  const to = typeof body.to === "string" ? body.to.trim() : "";

  if (!question || !from || !to) {
    return res.status(400).json({ error: "question, from and to are required." });
  }
  if (question.length > 1200) {
    return res.status(400).json({ error: "Question is too long." });
  }
  if (from.length > 120 || to.length > 120) {
    return res.status(400).json({ error: "Locations must be 120 characters or fewer." });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OpenRouter API key is not configured on the server." });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.VERCEL_URL
          ? "https://" + process.env.VERCEL_URL
          : "https://trip-dna-ai.vercel.app",
        "X-Title": "TripDNA AI",
      },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "You are a professional travel guide. The trip starts from " +
              from + " and the destination is " + to +
              ". Give practical travel advice and clearly mention uncertainty when information may change.",
          },
          { role: "user", content: question },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      // Do not log the upstream body, which may contain user-supplied content.
      console.error("OpenRouter chat request failed with status:", response.status);
      return res.status(502).json({ error: "The AI service could not answer right now." });
    }

    let data;
    try {
      data = await response.json();
    } catch {
      return res.status(502).json({ error: "The AI service returned an unreadable response." });
    }

    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      return res.status(502).json({ error: "The AI service returned an empty response." });
    }

    return res.status(200).json({ content });
  } catch (error) {
    const timedOut = error?.name === "TimeoutError" || error?.name === "AbortError";
    console.error("AI chat request failed:", timedOut ? "upstream timeout" : error?.name || "unknown error");
    return res.status(timedOut ? 504 : 502).json({
      error: timedOut
        ? "The AI service took too long to respond. Please try again."
        : "Unable to contact the AI service right now.",
    });
  }
}
