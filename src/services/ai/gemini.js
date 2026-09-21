import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function generateTripPlanWithGemini(
  from,
  to,
  days,
  budget,
  tripType
) {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const prompt = [
    "You are a professional travel planner.",
    "",
    "Create a " + days + "-day " + tripType + " trip itinerary.",
    "From: " + from,
    "Destination: " + to,
    "Budget: ₹" + budget,
    "",
    "Include:",
    "- Day-wise itinerary",
    "- Best attractions",
    "- Best restaurants",
    "- Budget tips",
    "- Packing list",
    "- Weather advice",
    "",
    "Return the answer in clean markdown.",
  ].join("\n");

  const result = await model.generateContent(prompt);
  return result.response.text();
}
