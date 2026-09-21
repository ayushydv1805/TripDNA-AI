const BASE_URL = "https://nominatim.openstreetmap.org/search";

export async function getCoordinates(city) {
  const query = city?.trim();
  if (!query) return null;

  try {
    const response = await fetch(
      BASE_URL +
        "?q=" +
        encodeURIComponent(query) +
        "&format=json&limit=1"
    );

    if (!response.ok) {
      throw new Error("Geocoding request failed (" + response.status + ").");
    }

    const data = await response.json();

    if (!Array.isArray(data) || !data.length) return null;

    return {
      lat: Number.parseFloat(data[0].lat),
      lon: Number.parseFloat(data[0].lon),
      name: data[0].display_name,
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}
