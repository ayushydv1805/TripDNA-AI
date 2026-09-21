export function saveTrip(trip) {
  try {
    const trips = JSON.parse(localStorage.getItem("savedTrips") || "[]");

    const withoutDuplicate = trips.filter(
      (item) =>
        item.from?.toLowerCase() !== trip.from?.toLowerCase() ||
        item.to?.toLowerCase() !== trip.to?.toLowerCase()
    );

    const updated = [trip, ...withoutDuplicate].slice(0, 20);

    localStorage.setItem("savedTrips", JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save trip:", error);
  }
}

export function getTrips() {
  try {
    const trips = JSON.parse(localStorage.getItem("savedTrips") || "[]");
    return Array.isArray(trips) ? trips : [];
  } catch (error) {
    console.error("Failed to read saved trips:", error);
    return [];
  }
}

export function deleteTrip(index) {
  const trips = getTrips();

  if (index < 0 || index >= trips.length) return;

  trips.splice(index, 1);
  localStorage.setItem("savedTrips", JSON.stringify(trips));
}
