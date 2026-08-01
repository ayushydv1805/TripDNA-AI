export function saveTrip(trip) {
  const trips =
    JSON.parse(localStorage.getItem("savedTrips")) || [];

  trips.unshift(trip);

  localStorage.setItem(
    "savedTrips",
    JSON.stringify(trips.slice(0, 20))
  );
}

export function getTrips() {
  return JSON.parse(localStorage.getItem("savedTrips")) || [];
}

export function deleteTrip(index) {
  const trips =
    JSON.parse(localStorage.getItem("savedTrips")) || [];

  trips.splice(index, 1);

  localStorage.setItem(
    "savedTrips",
    JSON.stringify(trips)
  );
}