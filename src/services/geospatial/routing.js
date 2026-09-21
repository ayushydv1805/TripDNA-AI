const BASE_URL = "https://router.project-osrm.org/route/v1/driving";

export async function getRoute(from, to) {
  if (!from || !to) return null;

  try {
    const response = await fetch(
      BASE_URL +
        "/" +
        from.lon +
        "," +
        from.lat +
        ";" +
        to.lon +
        "," +
        to.lat +
        "?overview=full&geometries=geojson"
    );

    if (!response.ok) {
      throw new Error("Routing request failed (" + response.status + ").");
    }

    const data = await response.json();

    if (!Array.isArray(data.routes) || !data.routes.length) return null;

    return {
      distance: data.routes[0].distance / 1000,
      duration: data.routes[0].duration / 3600,
      coordinates: data.routes[0].geometry.coordinates,
    };
  } catch (error) {
    console.error("Routing error:", error);
    return null;
  }
}
