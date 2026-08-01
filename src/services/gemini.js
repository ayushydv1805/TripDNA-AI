import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

export async function generateTripPlan(from, to, days, budget, tripType) {
  const prompt = `
You are a professional travel planner.

Create a ${days}-day ${tripType} trip itinerary.

From: ${from}
Destination: ${to}
Budget: ₹${budget}

Include:
- Day-wise itinerary
- Best attractions
- Best restaurants
- Budget tips
- Packing list
- Weather advice

Return the answer in clean markdown.
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}