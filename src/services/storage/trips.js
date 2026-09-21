const SAVED_TRIPS_KEY = "savedTrips";

export function getTrips() {
  try {
    const trips = JSON.parse(localStorage.getItem(SAVED_TRIPS_KEY) || "[]");
    return Array.isArray(trips) ? trips : [];
  } catch (error) {
    console.error("Failed to read saved trips:", error);
    return [];
  }
}

export function saveTrip(trip) {
  try {
    const trips = getTrips();

    const withoutDuplicate = trips.filter(
      (item) =>
        item.from?.trim().toLowerCase() !== trip.from?.trim().toLowerCase() ||
        item.to?.trim().toLowerCase() !== trip.to?.trim().toLowerCase()
    );

    localStorage.setItem(
      SAVED_TRIPS_KEY,
      JSON.stringify([trip, ...withoutDuplicate].slice(0, 20))
    );
  } catch (error) {
    console.error("Failed to save trip:", error);
  }
}

export function deleteTrip(index) {
  const trips = getTrips();
  if (index < 0 || index >= trips.length) return;

  trips.splice(index, 1);
  localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(trips));
}
