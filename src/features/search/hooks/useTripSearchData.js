import { useEffect, useState } from "react";
import { calculateBudget } from "../../../services/budget";
import { getCoordinates } from "../../../services/geocoding";
import {
  getDestinationImage,
  getDestinationImages,
} from "../../../services/images";
import { getNearbyPlaces } from "../../../services/places";
import { getRoute } from "../../../services/routing";
import { getTravelModes } from "../../../services/travelModes";
import { saveTrip } from "../../../services/trips";
import { getForecast, getWeather } from "../../../services/weather";
import { addRecentSearch } from "../utils/recentSearches";

export function useTripSearchData(from, to) {
  const [data, setData] = useState({
    fromLocation: null,
    toLocation: null,
    routeInfo: null,
    weather: null,
    forecast: [],
    hotels: [],
    restaurants: [],
    attractions: [],
    hospitals: [],
    pharmacies: [],
    atms: [],
    petrolPumps: [],
    budget: null,
    travelModes: [],
    destinationImage: "",
    destinationImages: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadTripData() {
      if (!from || !to) {
        setError("Please provide both a starting point and a destination.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setData({
        fromLocation: null,
        toLocation: null,
        routeInfo: null,
        weather: null,
        forecast: [],
        hotels: [],
        restaurants: [],
        attractions: [],
        hospitals: [],
        pharmacies: [],
        atms: [],
        petrolPumps: [],
        budget: null,
        travelModes: [],
        destinationImage: "",
        destinationImages: [],
      });

      try {
        const [start, end] = await Promise.all([
          getCoordinates(from),
          getCoordinates(to),
        ]);

        if (cancelled) return;
        if (!start || !end) {
          throw new Error("Could not find one of the locations.");
        }

        const route = await getRoute(start, end);

        if (cancelled) return;
        if (!route) {
          throw new Error("Could not calculate a route for these locations.");
        }

        const budgetData = calculateBudget(route.distance);
        const modes = getTravelModes(route.distance);

        setData((previous) => ({
          ...previous,
          fromLocation: start,
          toLocation: end,
          routeInfo: route,
          budget: budgetData,
          travelModes: modes,
        }));

        const [
          weatherResult,
          forecastResult,
          hotelResult,
          restaurantResult,
          attractionResult,
          hospitalResult,
          pharmacyResult,
          atmResult,
          petrolResult,
          heroImage,
          galleryImages,
        ] = await Promise.all([
          getWeather(end.lat, end.lon),
          getForecast(end.lat, end.lon),
          getNearbyPlaces(end.lat, end.lon, "accommodation.hotel"),
          getNearbyPlaces(end.lat, end.lon, "catering.restaurant"),
          getNearbyPlaces(end.lat, end.lon, "tourism.attraction"),
          getNearbyPlaces(end.lat, end.lon, "healthcare.hospital"),
          getNearbyPlaces(end.lat, end.lon, "healthcare.pharmacy"),
          getNearbyPlaces(end.lat, end.lon, "service.financial.atm"),
          getNearbyPlaces(end.lat, end.lon, "service.vehicle.fuel"),
          getDestinationImage(to),
          getDestinationImages(to),
        ]);

        if (cancelled) return;

        setData((previous) => ({
          ...previous,
          weather: weatherResult,
          forecast: forecastResult,
          hotels: hotelResult,
          restaurants: restaurantResult,
          attractions: attractionResult,
          hospitals: hospitalResult,
          pharmacies: pharmacyResult,
          atms: atmResult,
          petrolPumps: petrolResult,
          destinationImage: heroImage || "",
          destinationImages: galleryImages || [],
        }));

        saveTrip({
          from,
          to,
          date: new Date().toLocaleString(),
          distance: route.distance,
          duration: route.duration,
        });

        addRecentSearch(from, to);
      } catch (err) {
        if (!cancelled) {
          console.error("Trip loading error:", err);
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load trip data. Please try again."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTripData();

    return () => {
      cancelled = true;
    };
  }, [from, to]);

  return { ...data, loading, error };
}
