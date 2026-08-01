const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

export async function getNearbyPlaces(lat, lon, category) {
  const url = `https://api.geoapify.com/v2/places?categories=${category}&filter=circle:${lon},${lat},5000&limit=10&apiKey=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  return data.features;
}