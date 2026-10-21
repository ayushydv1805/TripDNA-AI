import { calculateBudget } from "../../../services/travel/budget";
import { getCoordinates } from "../../../services/geospatial/geocoding";
import { getDestinationImage, getDestinationImages } from "../../../services/media/images";
import { getNearbyPlaces } from "../../../services/geospatial/places";
import { getRoute } from "../../../services/geospatial/routing";
import { getTravelModes } from "../../../services/travel/travelModes";
import { saveTrip } from "../../../services/storage/trips";
import { saveCachedTrip } from "../../../services/storage/tripCache";
import { getForecast, getWeather } from "../../../services/weather/weather";
import { addRecentSearch } from "../utils/recentSearches";

async function withFallback(label, load, fallback) {
  try {
    const result = await load();
    return result ?? fallback;
  } catch (error) {
    console.warn("TripDNA could not load " + label + "; continuing with partial results.", error);
    return fallback;
  }
}

export async function loadTripData(from, to) {
  const [fromLocation, toLocation] = await Promise.all([
    getCoordinates(from),
    getCoordinates(to),
  ]);

  if (!fromLocation || !toLocation) throw new Error("Could not find one of the locations.");
  const routeInfo = await getRoute(fromLocation, toLocation);
  if (!routeInfo) throw new Error("Could not calculate a route for these locations.");

  // Persist the route before optional providers load, so provider failures do
  // not prevent the valid search from appearing in history.
  saveTrip({
    from,
    to,
    date: new Date().toLocaleString(),
    distance: routeInfo.distance,
    duration: routeInfo.duration,
  });
  addRecentSearch(from, to);

  const [
    weather, forecast, hotels, restaurants, attractions, hospitals,
    pharmacies, atms, petrolPumps, destinationImage, destinationImages,
  ] = await Promise.all([
    withFallback("weather", () => getWeather(toLocation.lat, toLocation.lon), null),
    withFallback("forecast", () => getForecast(toLocation.lat, toLocation.lon), []),
    withFallback("hotels", () => getNearbyPlaces(toLocation.lat, toLocation.lon, "accommodation.hotel"), []),
    withFallback("restaurants", () => getNearbyPlaces(toLocation.lat, toLocation.lon, "catering.restaurant"), []),
    withFallback("attractions", () => getNearbyPlaces(toLocation.lat, toLocation.lon, "tourism.attraction"), []),
    withFallback("hospitals", () => getNearbyPlaces(toLocation.lat, toLocation.lon, "healthcare.hospital"), []),
    withFallback("pharmacies", () => getNearbyPlaces(toLocation.lat, toLocation.lon, "healthcare.pharmacy"), []),
    withFallback("ATMs", () => getNearbyPlaces(toLocation.lat, toLocation.lon, "service.financial.atm"), []),
    withFallback("petrol stations", () => getNearbyPlaces(toLocation.lat, toLocation.lon, "service.vehicle.fuel"), []),
    withFallback("destination image", () => getDestinationImage(to), ""),
    withFallback("destination images", () => getDestinationImages(to), []),
  ]);

  const routeDistance = Number(routeInfo.distance) || 0;
  const trip = {
    fromLocation,
    toLocation,
    routeInfo,
    weather,
    forecast: Array.isArray(forecast) ? forecast : [],
    hotels: Array.isArray(hotels) ? hotels : [],
    restaurants: Array.isArray(restaurants) ? restaurants : [],
    attractions: Array.isArray(attractions) ? attractions : [],
    hospitals: Array.isArray(hospitals) ? hospitals : [],
    pharmacies: Array.isArray(pharmacies) ? pharmacies : [],
    atms: Array.isArray(atms) ? atms : [],
    petrolPumps: Array.isArray(petrolPumps) ? petrolPumps : [],
    budget: calculateBudget(routeDistance),
    travelModes: getTravelModes(routeDistance),
    destinationImage: destinationImage || "",
    destinationImages: Array.isArray(destinationImages) ? destinationImages : [],
  };

  saveCachedTrip(from, to, trip);
  return trip;
}
