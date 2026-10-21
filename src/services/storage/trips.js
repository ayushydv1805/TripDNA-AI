import { scheduleCloudSync } from "./cloudSync";

const SAVED_TRIPS_KEY = "savedTrips";

export function getTrips() {
  try {
    const trips = JSON.parse(localStorage.getItem(SAVED_TRIPS_KEY) || "[]");
    return Array.isArray(trips) ? trips.filter((trip) => trip && typeof trip === "object") : [];
  } catch (error) {
    console.error("Failed to read saved trips:", error);
    return [];
  }
}

export function saveTrip(trip) {
  if (!trip || typeof trip !== "object") return false;
  const from = String(trip.from || "").trim();
  const to = String(trip.to || "").trim();
  if (!from || !to) return false;

  const now = new Date();
  const entry = {
    ...trip,
    from,
    to,
    date: trip.date || now.toLocaleString(),
    updatedAt: now.toISOString(),
  };

  try {
    const trips = getTrips();
    const withoutDuplicate = trips.filter(
      (item) =>
        item.from?.trim().toLowerCase() !== from.toLowerCase() ||
        item.to?.trim().toLowerCase() !== to.toLowerCase()
    );
    localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify([entry, ...withoutDuplicate].slice(0, 20)));
    scheduleCloudSync();
    return true;
  } catch (error) {
    console.error("Failed to save trip:", error);
    return false;
  }
}

export function deleteTrip(index) {
  const trips = getTrips();
  if (!Number.isInteger(index) || index < 0 || index >= trips.length) return;
  trips.splice(index, 1);
  try {
    localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(trips));
    scheduleCloudSync();
  } catch (error) {
    console.error("Failed to delete saved trip:", error);
  }
}
