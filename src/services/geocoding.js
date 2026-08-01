const BASE_URL = "https://nominatim.openstreetmap.org/search";

export async function getCoordinates(city) {
  try {
    const response = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(city)}&format=json&limit=1`
    );

    const data = await response.json();

    if (!data.length) return null;

    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      name: data[0].display_name,
    };
  } catch (error) {
    console.error("Geocoding Error:", error);
    return null;
  }
}