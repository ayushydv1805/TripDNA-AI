
const API_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;

export async function getDestinationImage(place) {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${place}&per_page=1&client_id=${API_KEY}`
    );

    const data = await response.json();

    if (data.results.length > 0) {
      return data.results[0].urls.regular;
    }

    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}
export async function getDestinationImages(place) {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${place}&per_page=6&client_id=${API_KEY}`
    );

    const data = await response.json();

    return data.results.map((img) => img.urls.regular);
  } catch (err) {
    console.error(err);
    return [];
  }
}