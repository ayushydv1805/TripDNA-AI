const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

export async function searchPlaces(text) {
  const query = text?.trim();

  if (!query || query.length < 2 || !API_KEY) return [];

  try {
    const response = await fetch(
      "https://api.geoapify.com/v1/geocode/autocomplete?text=" +
        encodeURIComponent(query) +
        "&limit=5&apiKey=" +
        API_KEY
    );

    if (!response.ok) {
      throw new Error("Autocomplete request failed (" + response.status + ").");
    }

    const data = await response.json();
    return Array.isArray(data.features) ? data.features : [];
  } catch (error) {
    console.error("Autocomplete error:", error);
    return [];
  }
}
