import { scheduleCloudSync } from "../../../services/storage/cloudSync";

const RECENT_SEARCHES_KEY = "recentSearches";

export function addRecentSearch(from, to) {
  const safeFrom = String(from || "").trim();
  const safeTo = String(to || "").trim();
  if (!safeFrom || !safeTo) return;

  const searches = getRecentSearches();
  const normalizedFrom = safeFrom.toLowerCase();
  const normalizedTo = safeTo.toLowerCase();
  const now = new Date();
  const updated = [
    { from: safeFrom, to: safeTo, date: now.toLocaleString(), updatedAt: now.toISOString() },
    ...searches.filter(
      (item) =>
        item.from?.trim().toLowerCase() !== normalizedFrom ||
        item.to?.trim().toLowerCase() !== normalizedTo
    ),
  ].slice(0, 10);

  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    scheduleCloudSync();
  } catch (error) {
    console.error("Failed to update recent searches:", error);
  }
}

export function getRecentSearches() {
  try {
    const searches = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]");
    return Array.isArray(searches)
      ? searches.filter((item) => item && typeof item.from === "string" && typeof item.to === "string")
      : [];
  } catch (error) {
    console.error("Failed to read recent searches:", error);
    return [];
  }
}
