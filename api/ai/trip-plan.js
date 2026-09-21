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
  const from = String(body.from || "").trim();
  const to = String(body.to || "").trim();
  const days = Number(body.days);
  const budget = Number(body.budget);
  const tripType = String(body.tripType || "Adventure").trim();

  if (!from || !to || !Number.isFinite(days) || !Number.isFinite(budget)) {
    return res.status(400).json({
      error: "from, to, days and budget are required.",
    });
  }

  const safeDays = Math.min(Math.max(Math.round(days), 1), 30);
  const safeBudget = Math.max(Math.round(budget), 0);

  const prompt = `
You are a professional travel planner.

Create a detailed ${safeDays}-day ${tripType} trip.

Starting City: ${from}
Destination: ${to}
Total Budget: ₹${safeBudget}

Return the itinerary in this format.

# Day 1
Time:
Place:
Description:
Food:
Estimated Cost:

Continue until all ${safeDays} days are completed.

After that include:
Overall Budget Breakdown
Travel Tips
Best Time To Visit
Packing List
Safety Tips
Local Foods To Try
Shopping Places

Avoid unnecessary text.
Make the itinerary realistic.
`;

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
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter trip-plan error:", data);
      return res.status(502).json({
        error: "The AI service could not generate the itinerary.",
      });
    }

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(502).json({
        error: "The AI service returned an empty itinerary.",
      });
    }

    return res.status(200).json({ content });
  } catch (error) {
    console.error("Trip planner function error:", error);
    return res.status(500).json({
      error: "Unable to generate the itinerary right now.",
    });
  }
}
