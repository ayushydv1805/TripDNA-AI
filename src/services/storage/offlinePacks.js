const OFFLINE_KEY = "tripDnaOfflinePacks";
const ITINERARY_KEY = "tripDnaItineraries";
const ROUTE_CACHE_KEY = "tripDataCache";
const SAVED_TRIPS_KEY = "savedTrips";
const MAX_OFFLINE_PACKS = 8;

function normalize(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function routeKey(from, to) {
  return normalize(from) + "|" + normalize(to);
}

function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
}

function readPacks() {
  const value = readJson(OFFLINE_KEY, []);
  return Array.isArray(value) ? value.filter((item) => item && item.id && item.from && item.to) : [];
}

function compactPlaceList(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 6).map((place) => {
    const properties = place?.properties || place || {};
    const lat = properties.lat ?? place?.lat;
    const lon = properties.lon ?? place?.lon;
    return {
      name: String(properties.name || "Place").slice(0, 120),
      address: String(properties.address_line1 || properties.formatted || place?.address || place?.formatted || "").slice(0, 220),
      categories: Array.isArray(properties.categories) ? properties.categories.slice(0, 5) : Array.isArray(place?.categories) ? place.categories.slice(0, 5) : [],
      lat: Number.isFinite(Number(lat)) ? Number(lat) : null,
      lon: Number.isFinite(Number(lon)) ? Number(lon) : null,
      url: String(properties.website || place?.url || "").slice(0, 500),
    };
  });
}

function compactTrip(trip) {
  if (!trip || typeof trip !== "object") return null;
  return {
    weather: trip.weather || null,
    forecast: Array.isArray(trip.forecast) ? trip.forecast.slice(0, 5) : [],
    routeInfo: trip.routeInfo
      ? { distance: trip.routeInfo.distance, duration: trip.routeInfo.duration }
      : null,
    hotels: compactPlaceList(trip.hotels),
    restaurants: compactPlaceList(trip.restaurants),
    attractions: compactPlaceList(trip.attractions),
    hospitals: compactPlaceList(trip.hospitals),
    pharmacies: compactPlaceList(trip.pharmacies),
    petrolPumps: compactPlaceList(trip.petrolPumps),
    destinationImage: String(trip.destinationImage || "").slice(0, 1000),
  };
}

export function getOfflinePacks() {
  return readPacks().sort((a, b) => String(b.savedAt).localeCompare(String(a.savedAt)));
}

export function saveOfflinePack(from, to) {
  const safeFrom = String(from || "").trim();
  const safeTo = String(to || "").trim();
  if (!safeFrom || !safeTo) {
    return { ok: false, error: "A starting location and destination are required." };
  }

  const key = routeKey(safeFrom, safeTo);
  const routeCache = readJson(ROUTE_CACHE_KEY, []);
  const itineraryCache = readJson(ITINERARY_KEY, []);
  const savedTrips = readJson(SAVED_TRIPS_KEY, []);
  const cachedTrip = Array.isArray(routeCache) ? routeCache.find((item) => item.key === key) : null;
  const itineraryEntry = Array.isArray(itineraryCache) ? itineraryCache.find((item) => item.key === key) : null;
  const routeEntry = Array.isArray(savedTrips)
    ? savedTrips.find((item) => routeKey(item.from, item.to) === key)
    : null;
  const budget = readJson(
    "tripDnaBudget:" + key,
    { settings: null, expenses: [] }
  );

  if (!itineraryEntry?.plan && !cachedTrip?.data && !routeEntry) {
    return {
      ok: false,
      error: "Search this route and generate an itinerary or save a trip before creating an offline pack.",
    };
  }

  const pack = {
    id: key,
    from: safeFrom,
    to: safeTo,
    savedAt: new Date().toISOString(),
    route: routeEntry ? {
      distance: Number(routeEntry.distance) || null,
      duration: Number(routeEntry.duration) || null,
      date: routeEntry.date || "",
    } : cachedTrip?.data?.routeInfo
      ? {
          distance: Number(cachedTrip.data.routeInfo.distance) || null,
          duration: Number(cachedTrip.data.routeInfo.duration) || null,
          date: "",
        }
      : null,
    itinerary: itineraryEntry?.plan || null,
    budget: {
      settings: budget?.settings || null,
      expenses: Array.isArray(budget?.expenses) ? budget.expenses.slice(0, 100) : [],
    },
    destination: compactTrip(cachedTrip?.data),
    note: "Saved offline snapshot. Live weather, routes, opening hours and place availability are not refreshed while offline.",
  };

  const updated = [pack, ...readPacks().filter((item) => item.id !== key)].slice(0, MAX_OFFLINE_PACKS);
  try {
    localStorage.setItem(OFFLINE_KEY, JSON.stringify(updated));
    return { ok: true, pack };
  } catch (error) {
    console.warn("Could not store offline pack:", error);
    return {
      ok: false,
      error: "The offline pack could not be saved. Device storage may be full; remove older offline packs and try again.",
    };
  }
}

export function deleteOfflinePack(id) {
  const updated = readPacks().filter((item) => item.id !== id);
  try {
    localStorage.setItem(OFFLINE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.warn("Could not remove offline pack:", error);
    return false;
  }
}

export function exportOfflinePack(pack) {
  if (!pack || typeof pack !== "object") return false;
  try {
    const content = JSON.stringify(pack, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const safeFrom = String(pack.from || "start").replace(/[^a-z0-9]+/gi, "-");
    const safeTo = String(pack.to || "destination").replace(/[^a-z0-9]+/gi, "-");
    anchor.href = url;
    anchor.download = "TripDNA-offline-" + safeFrom + "-to-" + safeTo + ".json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.warn("Could not export offline pack:", error);
    return false;
  }
}
