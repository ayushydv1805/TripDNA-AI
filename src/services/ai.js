import OpenAI from "openai";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function generateTripPlan(
  from,
  to,
  days,
  budget,
  tripType
) {
  const prompt = `
You are a professional travel planner.

Create a detailed ${days}-day ${tripType} trip.

Starting City: ${from}
Destination: ${to}

Total Budget: ₹${budget}

Return the itinerary in this exact format.

# Day 1
Time:
Place:
Description:
Food:
Estimated Cost:

# Day 2
Time:
Place:
Description:
Food:
Estimated Cost:

Continue until all ${days} days are completed.

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

  const completion = await client.chat.completions.create({
   model: "inclusionai/ling-3.0-flash:free",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return completion.choices[0].message.content;
}