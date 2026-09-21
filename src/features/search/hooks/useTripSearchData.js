import { useEffect, useState } from "react";
import { loadTripData } from "../services/loadTripData";

const EMPTY_TRIP = {
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
};

export function useTripSearchData(from, to) {
  const [trip, setTrip] = useState(EMPTY_TRIP);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchTrip() {
      if (!from || !to) {
        setTrip(EMPTY_TRIP);
        setError("Please provide both a starting point and a destination.");
        return;
      }

      setLoading(true);
      setError("");
      setTrip(EMPTY_TRIP);

      try {
        const result = await loadTripData(from, to);
        if (!cancelled) setTrip(result);
      } catch (err) {
        if (!cancelled) {
          console.error("Trip search error:", err);
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

    fetchTrip();

    return () => {
      cancelled = true;
    };
  }, [from, to]);

  return {
    ...trip,
    loading,
    error,
  };
}
