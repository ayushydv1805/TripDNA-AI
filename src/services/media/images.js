const API_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;

async function searchImages(place, perPage) {
  if (!API_KEY || !place?.trim()) return [];

  try {
    const response = await fetch(
      "https://api.unsplash.com/search/photos?query=" +
        encodeURIComponent(place.trim()) +
        "&per_page=" +
        perPage +
        "&client_id=" +
        API_KEY
    );

    if (!response.ok) {
      throw new Error("Unsplash request failed (" + response.status + ").");
    }

    const data = await response.json();

    return Array.isArray(data.results)
      ? data.results.map((image) => image?.urls?.regular).filter(Boolean)
      : [];
  } catch (error) {
    console.error("Image search error:", error);
    return [];
  }
}

export async function getDestinationImage(place) {
  const images = await searchImages(place, 1);
  return images[0] || null;
}

export async function getDestinationImages(place) {
  return searchImages(place, 6);
}
