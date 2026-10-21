const STORAGE_KEY = "tripDnaItineraries";
const MAX_SAVED_PLANS = 12;

function routeKey(from, to) {
  return [String(from || "").trim().toLowerCase().replace(/\s+/g, " "), String(to || "").trim().toLowerCase().replace(/\s+/g, " ")].join("|");
}

function readPlans() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value.filter((item) => item && item.plan && item.key) : [];
  } catch (error) {
    console.warn("Could not read saved itineraries:", error);
    return [];
  }
}

export function getSavedItinerary(from, to) {
  const key = routeKey(from, to);
  const saved = readPlans().find((item) => item.key === key);
  return saved?.plan || null;
}

export function saveItinerary(from, to, plan) {
  if (!from || !to || !plan || !Array.isArray(plan.days)) return false;
  const key = routeKey(from, to);
  const entry = {
    key,
    from: String(from).trim(),
    to: String(to).trim(),
    savedAt: new Date().toISOString(),
    plan,
  };
  const updated = [entry, ...readPlans().filter((item) => item.key !== key)].slice(0, MAX_SAVED_PLANS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.warn("Could not save this itinerary on the device:", error);
    return false;
  }
}

export function itineraryToText(plan, from, to, budget) {
  if (!plan || !Array.isArray(plan.days)) return typeof plan === "string" ? plan : "";
  const lines = [
    plan.title || "TripDNA AI Itinerary",
    (from || "") + " → " + (to || ""),
    "Travelers: " + (plan.travelers || 1),
  ];
  if (plan.startDate || plan.endDate) lines.push("Dates: " + (plan.startDate || "TBD") + " to " + (plan.endDate || "TBD"));
  if (budget !== undefined) lines.push("Planned budget: ₹" + Number(budget || 0).toLocaleString("en-IN"));
  if (plan.summary) lines.push("", plan.summary);

  for (const day of plan.days) {
    lines.push("", "Day " + day.day + (day.date ? " — " + day.date : "") + ": " + (day.title || ""));
    for (const activity of Array.isArray(day.activities) ? day.activities : []) {
      lines.push(
        (activity.time ? activity.time + " · " : "") +
        (activity.title || "Activity") +
        (activity.location ? " — " + activity.location : "") +
        " (approx. ₹" + Number(activity.estimatedCost || 0).toLocaleString("en-IN") + ")"
      );
      if (activity.description) lines.push("  " + activity.description);
    }
  }

  if (Array.isArray(plan.budgetBreakdown) && plan.budgetBreakdown.length) {
    lines.push("", "AI budget notes");
    for (const item of plan.budgetBreakdown) {
      lines.push(item.category + ": ₹" + Number(item.estimatedCost || 0).toLocaleString("en-IN") + (item.note ? " — " + item.note : ""));
    }
  }
  if (Array.isArray(plan.tips) && plan.tips.length) {
    lines.push("", "Travel tips");
    for (const tip of plan.tips) lines.push("• " + tip);
  }
  lines.push("", "Costs and timings are estimates; verify current opening hours, availability, and prices before travel.");
  return lines.join("\n");
}
