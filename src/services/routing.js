const BASE_URL = "https://router.project-osrm.org/route/v1/driving";

export async function getRoute(from, to) {
  try {
    const response = await fetch(
      `${BASE_URL}/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`
    );

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) return null;

    return {
      distance: data.routes[0].distance / 1000,
      duration: data.routes[0].duration / 3600,
      coordinates: data.routes[0].geometry.coordinates,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}