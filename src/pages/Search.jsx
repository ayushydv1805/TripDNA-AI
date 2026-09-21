import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import AIChat from "../components/AIChat";
import AITripPlanner from "../components/AITripPlanner";
import AttractionsCard from "../components/AttractionsCard";
import BookingCard from "../components/BookingCard";
import BudgetCard from "../components/BudgetCard";
import DestinationGallery from "../components/DestinationGallery";
import EmergencyServices from "../components/EmergencyServices";
import ForecastCard from "../components/ForecastCard";
import HotelsCard from "../components/HotelsCard";
import MapView from "../components/MapView";
import Navbar from "../components/Navbar";
import RestaurantsCard from "../components/RestaurantsCard";
import RouteCard from "../components/RouteCard";
import SmartRecommendation from "../components/SmartRecommendation";
import TravelAdvisory from "../components/TravelAdvisory";
import TravelModes from "../components/TravelModes";
import TripDashboard from "../components/TripDashboard";
import TripDetailsCard from "../components/TripDetailsCard";
import TripSummary from "../components/TripSummary";
import WeatherCard from "../components/WeatherCard";

import { calculateBudget } from "../services/budget";
import { getCoordinates } from "../services/geocoding";
import {
  getDestinationImage,
  getDestinationImages,
} from "../services/images";
import { getNearbyPlaces } from "../services/places";
import { getRoute } from "../services/routing";
import { getTravelModes } from "../services/travelModes";
import { saveTrip } from "../services/trips";
import { getForecast, getWeather } from "../services/weather";

const RECENT_SEARCHES_KEY = "recentSearches";

function addRecentSearch(from, to) {
  try {
    const searches = JSON.parse(
      localStorage.getItem(RECENT_SEARCHES_KEY) || "[]"
    );

    const updated = [
      {
        from,
        to,
        date: new Date().toLocaleString(),
      },
      ...searches.filter(
        (item) =>
          item.from?.toLowerCase() !== from.toLowerCase() ||
          item.to?.toLowerCase() !== to.toLowerCase()
      ),
    ].slice(0, 10);

    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to update recent searches:", error);
  }
}

function Search() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from")?.trim() || "";
  const to = searchParams.get("to")?.trim() || "";

  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [atms, setAtms] = useState([]);
  const [petrolPumps, setPetrolPumps] = useState([]);
  const [budget, setBudget] = useState(null);
  const [travelModes, setTravelModes] = useState([]);
  const [destinationImage, setDestinationImage] = useState("");
  const [destinationImages, setDestinationImages] = useState([]);
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
      setFromLocation(null);
      setToLocation(null);
      setRouteInfo(null);
      setWeather(null);
      setForecast([]);
      setHotels([]);
      setRestaurants([]);
      setAttractions([]);
      setHospitals([]);
      setPharmacies([]);
      setAtms([]);
      setPetrolPumps([]);
      setBudget(null);
      setTravelModes([]);
      setDestinationImage("");
      setDestinationImages([]);

      try {
        const [start, end] = await Promise.all([
          getCoordinates(from),
          getCoordinates(to),
        ]);

        if (cancelled) return;

        if (!start || !end) {
          throw new Error("Could not find one of the locations.");
        }

        setFromLocation(start);
        setToLocation(end);

        const route = await getRoute(start, end);

        if (cancelled) return;

        if (!route) {
          throw new Error("Could not calculate a route for these locations.");
        }

        setRouteInfo(route);
        setBudget(calculateBudget(route.distance));
        setTravelModes(getTravelModes(route.distance));

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

        setWeather(weatherResult);
        setForecast(forecastResult);
        setHotels(hotelResult);
        setRestaurants(restaurantResult);
        setAttractions(attractionResult);
        setHospitals(hospitalResult);
        setPharmacies(pharmacyResult);
        setAtms(atmResult);
        setPetrolPumps(petrolResult);
        setDestinationImage(heroImage || "");
        setDestinationImages(galleryImages || []);

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
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTripData();

    return () => {
      cancelled = true;
    };
  }, [from, to]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <header className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
            Trip intelligence
          </p>

          <h1 className="text-4xl font-black md:text-5xl">
            Search Results
          </h1>

          <h2 className="mt-3 text-lg text-slate-300 md:text-xl">
            📍 {from || "—"} <span className="text-cyan-400">→</span>{" "}
            {to || "—"}
          </h2>
        </header>

        {loading && (
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6 text-center">
            <p className="text-lg font-semibold text-cyan-300">
              ✨ Building your trip dashboard...
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Finding routes, weather, places and travel options.
            </p>
          </div>
        )}

        {error && (
          <div className="my-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-5 text-red-100">
            <p className="font-semibold">⚠️ {error}</p>
          </div>
        )}

        {routeInfo && (
          <>
            <TripDashboard
              from={from}
              to={to}
              routeInfo={routeInfo}
              weather={weather}
              hotels={hotels}
              restaurants={restaurants}
              attractions={attractions}
              budget={budget}
            />

            {destinationImage && (
              <div className="my-6 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                <img
                  src={destinationImage}
                  alt={`Scenic view of ${to}`}
                  className="h-72 w-full object-cover md:h-96"
                  loading="eager"
                />
              </div>
            )}

            <DestinationGallery images={destinationImages} />

            <TripSummary
              from={from}
              to={to}
              routeInfo={routeInfo}
              weather={weather}
              hotels={hotels}
              restaurants={restaurants}
              attractions={attractions}
            />

            <TravelModes travelModes={travelModes} />
            <SmartRecommendation travelModes={travelModes} />

            <MapView
              fromLocation={fromLocation}
              toLocation={toLocation}
              route={routeInfo}
            />

            <TripDetailsCard routeInfo={routeInfo} />

            <WeatherCard weather={weather} />
            <ForecastCard forecast={forecast} />
            <HotelsCard hotels={hotels} />
            <TravelAdvisory weather={weather} destination={to} />
            <RestaurantsCard restaurants={restaurants} />
            <AttractionsCard attractions={attractions} />

            <EmergencyServices
              title="Nearby Hospitals"
              icon="🏥"
              places={hospitals}
            />

            <EmergencyServices
              title="Nearby Pharmacies"
              icon="💊"
              places={pharmacies}
            />

            <EmergencyServices
              title="Nearby ATMs"
              icon="🏧"
              places={atms}
            />

            <EmergencyServices
              title="Nearby Petrol Pumps"
              icon="⛽"
              places={petrolPumps}
            />

            <BudgetCard budget={budget} />

            <BookingCard from={from} to={to} />

            <AITripPlanner from={from} to={to} />
            <AIChat from={from} to={to} />

            {routeInfo && (
              <RouteCard
                from={from}
                to={to}
                distance={routeInfo.distance}
                duration={routeInfo.duration}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Search;
