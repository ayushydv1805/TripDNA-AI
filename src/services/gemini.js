export async function generateTripPlan(from, to, days, budget, tripType) {
  const response = await fetch("/api/ai/trip-plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, days, budget, tripType }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to generate itinerary.");
  }

  return data.content;
}
