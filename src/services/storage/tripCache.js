const TRIP_CACHE_KEY = "tripDataCache";
const MAX_CACHED_TRIPS = 4;

function normalizeLocation(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function cacheKey(from, to) {
  return normalizeLocation(from) + "|" + normalizeLocation(to);
}

function readCache() {
  try {
    const value = JSON.parse(localStorage.getItem(TRIP_CACHE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch (error) {
    console.warn("Could not read cached TripDNA results:", error);
    return [];
  }
}

function compactTrip(trip) {
  return {
    ...trip,
    forecast: Array.isArray(trip.forecast) ? trip.forecast.slice(0, 7) : [],
    hotels: Array.isArray(trip.hotels) ? trip.hotels.slice(0, 10) : [],
    restaurants: Array.isArray(trip.restaurants) ? trip.restaurants.slice(0, 10) : [],
    attractions: Array.isArray(trip.attractions) ? trip.attractions.slice(0, 12) : [],
    hospitals: Array.isArray(trip.hospitals) ? trip.hospitals.slice(0, 10) : [],
    pharmacies: Array.isArray(trip.pharmacies) ? trip.pharmacies.slice(0, 10) : [],
    atms: Array.isArray(trip.atms) ? trip.atms.slice(0, 10) : [],
    petrolPumps: Array.isArray(trip.petrolPumps) ? trip.petrolPumps.slice(0, 10) : [],
    destinationImages: Array.isArray(trip.destinationImages) ? trip.destinationImages.slice(0, 8) : [],
  };
}

export function getCachedTrip(from, to) {
  if (!from || !to) return null;
  const key = cacheKey(from, to);
  const entry = readCache().find((item) => item.key === key);
  return entry?.data && typeof entry.data === "object" ? entry.data : null;
}

export function saveCachedTrip(from, to, trip) {
  if (!from || !to || !trip || typeof trip !== "object") return false;
  const entry = {
    key: cacheKey(from, to),
    from: String(from).trim(),
    to: String(to).trim(),
    savedAt: new Date().toISOString(),
    data: compactTrip(trip),
  };
  const updated = [entry, ...readCache().filter((item) => item.key !== entry.key)].slice(0, MAX_CACHED_TRIPS);

  try {
    localStorage.setItem(TRIP_CACHE_KEY, JSON.stringify(updated));
    return true;
  } catch {
    try {
      localStorage.setItem(TRIP_CACHE_KEY, JSON.stringify([entry]));
      return true;
    } catch (fallbackError) {
      console.warn("Could not persist this TripDNA result on this device:", fallbackError);
      return false;
    }
  }
}
