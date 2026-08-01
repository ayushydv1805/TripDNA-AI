import OpenAI from "openai";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function askTripAI(question, from, to) {
  const completion = await client.chat.completions.create({
    model: "inclusionai/ling-3.0-flash:free",
    messages: [
      {
        role: "system",
        content: `You are a professional travel guide. The trip starts from ${from} and destination is ${to}. Give accurate, practical travel advice.`,
      },
      {
        role: "user",
        content: question,
      },
    ],
  });

  return completion.choices[0].message.content;
}