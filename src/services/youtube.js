const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export async function getTravelVideos(place) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        place + " travel guide"
      )}&type=video&maxResults=4&key=${API_KEY}`
    );

    const data = await response.json();

    return data.items || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}