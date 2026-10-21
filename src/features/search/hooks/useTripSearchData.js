import { useEffect, useState } from "react";
import { loadTripData } from "../services/loadTripData";
import { getCachedTrip } from "../../../services/storage/tripCache";

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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchTrip() {
      if (!from || !to) {
        setTrip(EMPTY_TRIP);
        setLoading(false);
        setRefreshing(false);
        setError("Please provide both a starting point and a destination.");
        setNotice("");
        return;
      }

      const cachedTrip = getCachedTrip(from, to);
      if (cachedTrip) {
        setTrip(cachedTrip);
        setLoading(false);
        setRefreshing(true);
        setNotice("Loaded your saved trip snapshot. Checking for updated travel information…");
      } else {
        setTrip(EMPTY_TRIP);
        setLoading(true);
        setRefreshing(false);
        setNotice("");
      }
      setError("");

      try {
        const result = await loadTripData(from, to);
        if (!cancelled) {
          setTrip(result);
          setError("");
          setNotice("");
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Trip search error:", err);
          if (cachedTrip) {
            setNotice("Showing your saved results because live data could not be refreshed. Your history remains available on this device.");
          } else {
            setError(err instanceof Error ? err.message : "Failed to load trip data. Please try again.");
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    }

    void fetchTrip();
    return () => { cancelled = true; };
  }, [from, to]);

  return { ...trip, loading, refreshing, error, notice };
}
