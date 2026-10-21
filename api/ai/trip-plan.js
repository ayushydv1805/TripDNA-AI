import { isJsonRequest, secureApiRequest } from "../../server/apiSecurity.js";

const MODEL = "inclusionai/ling-3.0-flash:free";
const UPSTREAM_TIMEOUT_MS = 25_000;

function sendError(res, status, error) {
  return res.status(status).json({ error });
}

function parseJson(content) {
  if (typeof content !== "string") return null;
  const trimmed = content.trim().replace(/^\u0060{3}(?:json)?\s*/i, "").replace(/\s*\u0060{3}$/, "");
  try {
    return JSON.parse(trimmed);
  } catch {
    const first = trimmed.indexOf("{");
    const last = trimmed.lastIndexOf("}");
    if (first >= 0 && last > first) {
      try { return JSON.parse(trimmed.slice(first, last + 1)); } catch { return null; }
    }
    return null;
  }
}

function validISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;
  const date = new Date(value + "T00:00:00Z");
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function safeNumber(value, fallback, min, max) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.round(parsed)));
}

async function requestPlan(apiKey, prompt) {
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
          content: "You are TripDNA, a careful travel planner. Produce valid JSON only when JSON is requested. Give practical routes and avoid claiming unverified prices, schedules, availability, or opening hours are confirmed. All budget estimates are INR. Avoid unsafe or illegal suggestions.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    }),
  });

  let data;
  try { data = await response.json(); }
  catch { throw new Error("The AI provider returned an unreadable response."); }

  if (!response.ok) {
    console.error("OpenRouter trip-plan request failed with status:", response.status);
    throw new Error("The AI service could not generate the itinerary. Please try again.");
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("The AI service returned an empty itinerary.");
  const parsed = parseJson(content);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("The AI returned an invalid itinerary format. Please generate it again.");
  }
  return parsed;
}

export default async function handler(req, res) {
  if (!secureApiRequest(req, res)) return;

  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendError(res, 405, "Method not allowed");
  }
  if (!isJsonRequest(req)) {
    return sendError(res, 415, "Send this request as application/json.");
  }

  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return sendError(res, 400, "A JSON object is required.");
  }
  let bodySize;
  try {
    bodySize = JSON.stringify(body).length;
  } catch {
    return sendError(res, 400, "The request body could not be read.");
  }
  if (bodySize > 100_000) {
    return sendError(res, 413, "The itinerary request is too large.");
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return sendError(res, 500, "OpenRouter API key is not configured on the server.");
  const from = typeof body.from === "string" ? body.from.trim().slice(0, 120) : "";
  const to = typeof body.to === "string" ? body.to.trim().slice(0, 120) : "";
  const days = safeNumber(body.days, 3, 1, 30);
  const budget = safeNumber(body.budget, 0, 0, 100000000);
  const travelers = safeNumber(body.travelers, 1, 1, 30);
  const tripTypeRaw = String(body.tripType || "Adventure").trim();
  const allowedTripTypes = ["Adventure", "Family", "Solo", "Couple", "Relaxation", "Culture", "Food", "Nature", "Business", "Road trip"];
  const tripType = allowedTripTypes.includes(tripTypeRaw) ? tripTypeRaw : "Adventure";
  const interests = typeof body.interests === "string" ? body.interests.trim().slice(0, 500) : "";
  const allowedTravelStyles = ["Relaxed", "Balanced", "Packed"];
  const requestedTravelStyle = typeof body.travelStyle === "string" ? body.travelStyle.trim() : "";
  const travelStyle = allowedTravelStyles.includes(requestedTravelStyle) ? requestedTravelStyle : "Balanced";
  const allowedFoodPreferences = ["No preference", "Vegetarian", "Vegan", "Jain", "Halal", "Local food", "Budget food"];
  const requestedFoodPreference = typeof body.foodPreference === "string" ? body.foodPreference.trim() : "";
  const foodPreference = allowedFoodPreferences.includes(requestedFoodPreference) ? requestedFoodPreference : "No preference";
  const startDate = typeof body.startDate === "string" ? body.startDate.trim() : "";
  const endDate = typeof body.endDate === "string" ? body.endDate.trim() : "";
  const regenerateDay = body.regenerateDay === undefined ? 0 : Number(body.regenerateDay);

  if (!from || !to) return sendError(res, 400, "Starting location and destination are required.");
  if (body.days !== undefined && (!Number.isInteger(Number(body.days)) || Number(body.days) < 1 || Number(body.days) > 30)) {
    return sendError(res, 400, "Trip length must be between 1 and 30 days.");
  }
  if (body.budget !== undefined && (!Number.isFinite(Number(body.budget)) || Number(body.budget) < 0)) {
    return sendError(res, 400, "Budget must be a valid non-negative number.");
  }
  if (startDate && !validISODate(startDate)) return sendError(res, 400, "Start date must be a valid date.");
  if (endDate && !validISODate(endDate)) return sendError(res, 400, "End date must be a valid date.");
  if (startDate && endDate && endDate < startDate) return sendError(res, 400, "End date cannot be before the start date.");
  if (body.regenerateDay !== undefined && (!Number.isInteger(regenerateDay) || regenerateDay < 0 || regenerateDay > days)) {
    return sendError(res, 400, "The day to regenerate is outside this trip.");
  }
  if (regenerateDay && (!body.existingPlan || typeof body.existingPlan !== "object" || Array.isArray(body.existingPlan) || !Array.isArray(body.existingPlan.days))) {
    return sendError(res, 400, "The existing itinerary is required to regenerate a day.");
  }
  if (regenerateDay && (!Number.isInteger(regenerateDay) || regenerateDay < 1 || regenerateDay > days)) {
    return sendError(res, 400, "The day to regenerate is outside this trip.");
  }

  const dateText = startDate
    ? "Start date: " + startDate + (endDate ? "\nEnd date: " + endDate : "")
    : "Travel dates are not fixed; do not assert current event or schedule details.";
  const preferences = [
    "Trip type: " + tripType,
    "Travel style: " + travelStyle,
    "Food preference: " + foodPreference,
    "Interests: " + (interests || "General highlights and local culture"),
  ].join("\n");
  const schema = [
    "{",
    '  "title": "short trip title",',
    '  "summary": "2-3 sentence overview",',
    '  "startDate": "YYYY-MM-DD or empty string",',
    '  "endDate": "YYYY-MM-DD or empty string",',
    '  "travelers": ' + travelers + ",",
    '  "days": [{"day":1,"date":"YYYY-MM-DD or empty string","title":"day theme","activities":[{"id":"unique short id","time":"09:00","title":"activity name","location":"place or area","description":"practical description","durationMinutes":90,"estimatedCost":0,"category":"Sightseeing"}]}],',
    '  "budgetBreakdown": [{"category":"Transport","estimatedCost":0,"note":"assumption"}],',
    '  "tips": ["short practical tip"]',
    "}",
  ].join("\n");
  let prompt;

  if (regenerateDay) {
    const oldPlan = body.existingPlan && typeof body.existingPlan === "object" ? body.existingPlan : {};
    const priorDay = Array.isArray(oldPlan.days) ? oldPlan.days.find((item) => Number(item.day) === regenerateDay) : null;
    prompt = "Create a replacement for ONLY day " + regenerateDay + " of this trip. Return JSON with this shape only: " +
      '{"day":' + regenerateDay + ',"date":"YYYY-MM-DD or empty string","title":"day theme","activities":[{"id":"unique short id","time":"09:00","title":"activity","location":"place","description":"practical description","durationMinutes":90,"estimatedCost":0,"category":"Sightseeing"}]}. ' +
      "Include 3-5 realistic activities in sensible geographic order. Do not repeat old activities unless necessary. Prices are approximate INR, not verified live quotes.\n" +
      "Starting location: " + from + "\nDestination: " + to + "\nTrip length: " + days +
      "\nTotal trip budget: INR " + budget + "\nTravelers: " + travelers + "\n" + dateText +
      "\nPreferences:\n" + preferences + "\nExisting trip context: " +
      JSON.stringify({ title: oldPlan.title, summary: oldPlan.summary, budgetBreakdown: oldPlan.budgetBreakdown, previousDay: priorDay });
  } else {
    prompt = "Create a useful, realistic " + days + "-day itinerary in JSON matching the schema below. Include 3-5 activities per day with times from morning through evening, geographic sense, realistic durations, descriptions, and approximate estimatedCost in INR per activity. Use 0 for free activities. Include every day from 1 to " + days +
      ". Do not invent confirmed opening hours, current availability, exact live prices, or transport schedules. Keep estimates consistent with total budget and number of travelers.\n" +
      "Starting location: " + from + "\nDestination: " + to + "\nTotal budget for all travelers: INR " + budget +
      "\nTravelers: " + travelers + "\n" + dateText + "\nPreferences:\n" + preferences +
      "\nReturn valid JSON only. Use this structure:\n" + schema;
  }

  try {
    const result = await requestPlan(apiKey, prompt);
    if (regenerateDay) {
      const day = result.day && typeof result.day === "object" ? result.day : result;
      if (!Array.isArray(day.activities)) return sendError(res, 502, "The AI response did not contain a valid replacement day. Please try again.");
      const normalizedDay = {
        day: regenerateDay,
        date: String(day.date || "").slice(0, 10),
        title: String(day.title || "Updated day plan").slice(0, 160),
        activities: day.activities.slice(0, 12).map((activity, index) => ({
          id: "day-" + regenerateDay + "-activity-" + (index + 1),
          time: String(activity.time || "").slice(0, 20),
          title: String(activity.title || "Activity").slice(0, 160),
          location: String(activity.location || to).slice(0, 160),
          description: String(activity.description || "").slice(0, 700),
          durationMinutes: safeNumber(activity.durationMinutes, 60, 0, 1440),
          estimatedCost: safeNumber(activity.estimatedCost, 0, 0, 10000000),
          category: String(activity.category || "Activity").slice(0, 50),
        })),
      };
      return res.status(200).json({ content: normalizedDay });
    }

    if (!Array.isArray(result.days) || result.days.length === 0) {
      return sendError(res, 502, "The AI response did not contain itinerary days. Please generate it again.");
    }
    const validDays = result.days
      .filter((day) => day && Array.isArray(day.activities))
      .slice(0, days)
      .map((day, index) => ({
        day: index + 1,
        date: String(day.date || "").slice(0, 10),
        title: String(day.title || "Day " + (index + 1)).slice(0, 160),
        activities: day.activities.slice(0, 12).map((activity, activityIndex) => ({
          id: "day-" + (index + 1) + "-activity-" + (activityIndex + 1),
          time: String(activity.time || "").slice(0, 20),
          title: String(activity.title || "Activity").slice(0, 160),
          location: String(activity.location || to).slice(0, 160),
          description: String(activity.description || "").slice(0, 700),
          durationMinutes: safeNumber(activity.durationMinutes, 60, 0, 1440),
          estimatedCost: safeNumber(activity.estimatedCost, 0, 0, 10000000),
          category: String(activity.category || "Activity").slice(0, 50),
        })),
      }));
    if (validDays.length !== days) return sendError(res, 502, "The AI returned an incomplete itinerary. Please generate it again.");

    const itinerary = {
      title: String(result.title || to + " trip").slice(0, 160),
      summary: String(result.summary || "").slice(0, 1200),
      startDate: startDate || String(result.startDate || "").slice(0, 10),
      endDate: endDate || String(result.endDate || "").slice(0, 10),
      travelers,
      budget,
      tripType,
      travelStyle,
      foodPreference,
      interests,
      days: validDays,
      budgetBreakdown: Array.isArray(result.budgetBreakdown) ? result.budgetBreakdown.slice(0, 12).map((item) => ({
        category: String(item.category || "Other").slice(0, 60),
        estimatedCost: safeNumber(item.estimatedCost, 0, 0, 100000000),
        note: String(item.note || "").slice(0, 300),
      })) : [],
      tips: Array.isArray(result.tips) ? result.tips.slice(0, 20).map((tip) => String(tip).slice(0, 500)) : [],
    };
    return res.status(200).json({ content: itinerary });
  } catch (error) {
    console.error("Trip planner function error:", error);
    return sendError(res, 502, error instanceof Error ? error.message : "Unable to generate the itinerary right now.");
  }
}
