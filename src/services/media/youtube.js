const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export async function getTravelVideos(place) {
  if (!API_KEY || !place?.trim()) return [];

  try {
    const response = await fetch(
      "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" +
        encodeURIComponent(place.trim() + " travel guide") +
        "&type=video&maxResults=4&key=" +
        API_KEY
    );

    if (!response.ok) {
      throw new Error("YouTube request failed (" + response.status + ").");
    }

    const data = await response.json();
    return Array.isArray(data.items) ? data.items : [];
  } catch (error) {
    console.error("Travel videos error:", error);
    return [];
  }
}
