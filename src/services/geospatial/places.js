const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

export async function getNearbyPlaces(lat, lon, category) {
  if (!API_KEY) {
    console.warn("Geoapify API key is missing.");
    return [];
  }

  try {
    const response = await fetch(
      "https://api.geoapify.com/v2/places?categories=" +
        encodeURIComponent(category) +
        "&filter=circle:" +
        lon +
        "," +
        lat +
        ",5000&limit=10&apiKey=" +
        API_KEY
    );

    if (!response.ok) {
      throw new Error("Places API request failed (" + response.status + ").");
    }

    const data = await response.json();
    return Array.isArray(data.features) ? data.features : [];
  } catch (error) {
    console.error("Nearby places error:", error);
    return [];
  }
}
