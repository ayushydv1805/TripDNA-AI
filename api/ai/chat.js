const MODEL = "inclusionai/ling-3.0-flash:free";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey =
    process.env.OPENROUTER_API_KEY ||
    process.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "OpenRouter API key is not configured on the server.",
    });
  }

  const body = req.body || {};
  const question = String(body.question || "").trim();
  const from = String(body.from || "").trim();
  const to = String(body.to || "").trim();

  if (!question || !from || !to) {
    return res.status(400).json({
      error: "question, from and to are required.",
    });
  }

  if (question.length > 1200) {
    return res.status(400).json({
      error: "Question is too long.",
    });
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + apiKey,
          "Content-Type": "application/json",
          "HTTP-Referer":
            process.env.VERCEL_URL
              ? "https://" + process.env.VERCEL_URL
              : "https://trip-dna-ai.vercel.app",
          "X-Title": "TripDNA AI",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are a professional travel guide. The trip starts from " +
                from +
                " and the destination is " +
                to +
                ". Give practical travel advice and clearly mention uncertainty when information may change.",
            },
            {
              role: "user",
              content: question,
            },
          ],
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter chat error:", data);
      return res.status(502).json({
        error: "The AI service could not answer right now.",
      });
    }

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(502).json({
        error: "The AI service returned an empty response.",
      });
    }

    return res.status(200).json({ content });
  } catch (error) {
    console.error("AI chat function error:", error);
    return res.status(500).json({
      error: "Unable to contact the AI service right now.",
    });
  }
}
