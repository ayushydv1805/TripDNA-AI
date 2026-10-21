const API_BASE = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

async function requestItinerary(payload) {
  const response = await fetch(API_BASE + "/api/ai/trip-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("The itinerary service returned an invalid response.");
  }

  if (!response.ok) throw new Error(data.error || "Failed to generate itinerary.");
  if (!data.content || typeof data.content !== "object") {
    throw new Error("The itinerary service returned an incomplete result.");
  }
  return data.content;
}

export function generateTripPlan(from, to, options) {
  return requestItinerary({
    from,
    to,
    days: options.days,
    budget: options.budget,
    tripType: options.tripType,
    travelers: options.travelers,
    startDate: options.startDate,
    endDate: options.endDate,
    interests: options.interests,
    travelStyle: options.travelStyle,
    foodPreference: options.foodPreference,
  });
}

export function regenerateTripDay(from, to, options, plan, dayNumber) {
  return requestItinerary({
    from,
    to,
    days: options.days,
    budget: options.budget,
    tripType: options.tripType,
    travelers: options.travelers,
    startDate: options.startDate,
    endDate: options.endDate,
    interests: options.interests,
    travelStyle: options.travelStyle,
    foodPreference: options.foodPreference,
    regenerateDay: dayNumber,
    existingPlan: plan,
  });
}
