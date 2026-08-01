const API_KEY = "YOUR_GEOAPIFY_KEY";

export async function getHotels(lat, lon) {
  try {
    const url = `https://api.geoapify.com/v2/places?categories=accommodation.hotel&filter=circle:${lon},${lat},5000&limit=10&apiKey=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    return data.features || [];
  } catch (err) {
    console.log(err);
    return [];
  }
}