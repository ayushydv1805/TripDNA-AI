const RECENT_SEARCHES_KEY = "recentSearches";

export function addRecentSearch(from, to) {
  try {
    const searches = JSON.parse(
      localStorage.getItem(RECENT_SEARCHES_KEY) || "[]"
    );

    const normalizedFrom = from.trim().toLowerCase();
    const normalizedTo = to.trim().toLowerCase();

    const updated = [
      {
        from,
        to,
        date: new Date().toLocaleString(),
      },
      ...searches.filter(
        (item) =>
          item.from?.trim().toLowerCase() !== normalizedFrom ||
          item.to?.trim().toLowerCase() !== normalizedTo
      ),
    ].slice(0, 10);

    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to update recent searches:", error);
  }
}

export function getRecentSearches() {
  try {
    const searches = JSON.parse(
      localStorage.getItem(RECENT_SEARCHES_KEY) || "[]"
    );
    return Array.isArray(searches) ? searches : [];
  } catch (error) {
    console.error("Failed to read recent searches:", error);
    return [];
  }
}
