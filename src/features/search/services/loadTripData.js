import { calculateBudget } from "../../../services/travel/budget";
import { getCoordinates } from "../../../services/geospatial/geocoding";
import {
  getDestinationImage,
  getDestinationImages,
} from "../../../services/media/images";
import { getNearbyPlaces } from "../../../services/geospatial/places";
import { getRoute } from "../../../services/geospatial/routing";
import { getTravelModes } from "../../../services/travel/travelModes";
import { saveTrip } from "../../../services/storage/trips";
import { getForecast, getWeather } from "../../../services/weather/weather";
import { addRecentSearch } from "../utils/recentSearches";

export async function loadTripData(from, to) {
  const [fromLocation, toLocation] = await Promise.all([
    getCoordinates(from),
    getCoordinates(to),
  ]);

  if (!fromLocation || !toLocation) {
    throw new Error("Could not find one of the locations.");
  }

  const routeInfo = await getRoute(fromLocation, toLocation);

  if (!routeInfo) {
    throw new Error("Could not calculate a route for these locations.");
  }

  const [
    weather,
    forecast,
    hotels,
    restaurants,
    attractions,
    hospitals,
    pharmacies,
    atms,
    petrolPumps,
    destinationImage,
    destinationImages,
  ] = await Promise.all([
    getWeather(toLocation.lat, toLocation.lon),
    getForecast(toLocation.lat, toLocation.lon),
    getNearbyPlaces(toLocation.lat, toLocation.lon, "accommodation.hotel"),
    getNearbyPlaces(toLocation.lat, toLocation.lon, "catering.restaurant"),
    getNearbyPlaces(toLocation.lat, toLocation.lon, "tourism.attraction"),
    getNearbyPlaces(toLocation.lat, toLocation.lon, "healthcare.hospital"),
    getNearbyPlaces(toLocation.lat, toLocation.lon, "healthcare.pharmacy"),
    getNearbyPlaces(toLocation.lat, toLocation.lon, "service.financial.atm"),
    getNearbyPlaces(toLocation.lat, toLocation.lon, "service.vehicle.fuel"),
    getDestinationImage(to),
    getDestinationImages(to),
  ]);

  const budget = calculateBudget(routeInfo.distance);
  const travelModes = getTravelModes(routeInfo.distance);

  const trip = {
    fromLocation,
    toLocation,
    routeInfo,
    weather,
    forecast,
    hotels,
    restaurants,
    attractions,
    hospitals,
    pharmacies,
    atms,
    petrolPumps,
    budget,
    travelModes,
    destinationImage: destinationImage || "",
    destinationImages: destinationImages || [],
  };

  saveTrip({
    from,
    to,
    date: new Date().toLocaleString(),
    distance: routeInfo.distance,
    duration: routeInfo.duration,
  });

  addRecentSearch(from, to);

  return trip;
}
