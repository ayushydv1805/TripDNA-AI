import { useSearchParams } from "react-router-dom";
import RouteCard from "../components/RouteCard";
import MapView from "../components/MapView";
import { useEffect, useState } from "react";
import { getCoordinates } from "../services/geocoding";
import { getRoute } from "../services/routing";
import { getWeather, getForecast } from "../services/weather";
import { getNearbyPlaces } from "../services/places";
import { calculateBudget } from "../services/budget";
import { getTravelModes } from "../services/travelModes";
import WeatherCard from "../components/WeatherCard";
import ForecastCard from "../components/ForecastCard";
import BudgetCard from "../components/BudgetCard";
import HotelsCard from "../components/HotelsCard";
import RestaurantsCard from "../components/RestaurantsCard";
import AttractionsCard from "../components/AttractionsCard";
import TravelModes from "../components/TravelModes";
import TripDetailsCard from "../components/TripDetailsCard";
import TripSummary from "../components/TripSummary";
import AITripPlanner from "../components/AITripPlanner";
import { saveTrip } from "../services/trips";
import Navbar from "../components/Navbar";
import TripDashboard from "../components/TripDashboard";
import {
  getDestinationImage,
  getDestinationImages,
} from "../services/images";
import AIChat from "../components/AIChat";
import TravelAdvisory from "../components/TravelAdvisory";
import EmergencyServices from "../components/EmergencyServices";
import DestinationGallery from "../components/DestinationGallery";
import SmartRecommendation from "../components/SmartRecommendation";
import BookingCard from "../components/BookingCard";
function Search() {
  const [searchParams] = useSearchParams();

  const from = searchParams.get("from");
  const to = searchParams.get("to");
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
  async function loadCoordinates() {
    setError("");
    try {
      setLoading(true);

      const start = await getCoordinates(from);
      const end = await getCoordinates(to);

      if (!start || !end) return;

      setFromLocation(start);
      setToLocation(end);

      const route = await getRoute(start, end);
      setRouteInfo(route);
      console.log("ROUTE =", route);
console.log("COORDINATES =", route.coordinates);
console.log(route);
      const budgetData = calculateBudget(route.distance);
      setBudget(budgetData);

      const weatherData = await getWeather(end.lat, end.lon);
      setWeather(weatherData);
const forecastData = await getForecast(end.lat, end.lon);
setForecast(forecastData);
      const modes = getTravelModes(route.distance);
      setTravelModes(modes);

      const hotelData = await getNearbyPlaces(
        end.lat,
        end.lon,
        "accommodation.hotel"
      );

      const restaurantData = await getNearbyPlaces(
        end.lat,
        end.lon,
        "catering.restaurant"
      );

      setHotels(hotelData);
      setRestaurants(restaurantData);

      const attractionData = await getNearbyPlaces(
        end.lat,
        end.lon,
        "tourism.attraction"
      );

      setAttractions(attractionData);
      const hospitalData = await getNearbyPlaces(
  end.lat,
  end.lon,
  "healthcare.hospital"
);

const pharmacyData = await getNearbyPlaces(
  end.lat,
  end.lon,
  "healthcare.pharmacy"
);

const atmData = await getNearbyPlaces(
  end.lat,
  end.lon,
  "service.financial.atm"
);

const petrolData = await getNearbyPlaces(
  end.lat,
  end.lon,
  "service.vehicle.fuel"
);

setHospitals(hospitalData);
setPharmacies(pharmacyData);
setAtms(atmData);
setPetrolPumps(petrolData);
      const image = await getDestinationImage(to);
setDestinationImage(image);
const images = await getDestinationImages(to);
setDestinationImages(images);
      saveTrip({
  from,
  to,
  date: new Date().toLocaleString(),
  distance: route.distance,
  duration: route.duration,
});
      const recentSearches =
  JSON.parse(localStorage.getItem("recentSearches")) || [];

recentSearches.unshift({
  from,
  to,
  date: new Date().toLocaleString(),
});

localStorage.setItem(
  "recentSearches",
  JSON.stringify(recentSearches.slice(0, 10))
);
    }
    catch (err) {
  console.error(err);
  setError("❌ Failed to load trip data. Please try again.");
}
 finally {
      setLoading(false);
    }
  }

  if (from && to) {
    loadCoordinates();
  }

}, [from, to]);
  return (
    <div className="min-h-screen bg-slate-900 text-white">
  <Navbar />

  
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <h1 className="text-5xl font-bold mb-6">
        Search Results
      </h1>

      <h2 className="text-2xl">
        📍 {from} → {to}
      </h2>
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
  <div className="my-6">
    <img
      src={destinationImage}
      alt={to}
      className="w-full h-96 object-cover rounded-2xl shadow-lg"
    />
  </div>
)}
<DestinationGallery
  images={destinationImages}
/>
      <p className="mt-5 text-gray-300">
        Route recommendations will appear here...
      </p>
      <TripSummary
  from={from}
  to={to}
  routeInfo={routeInfo}
  weather={weather}
  hotels={hotels}
  restaurants={restaurants}
  attractions={attractions}
/>
    <MapView
  fromLocation={fromLocation}
  toLocation={toLocation}
  route={routeInfo}
/>
{error && (
  <div className="bg-red-600 text-white p-4 rounded-xl my-5">
    {error}
  </div>
)}
<TripDetailsCard routeInfo={routeInfo} />

  <WeatherCard weather={weather} />
<ForecastCard forecast={forecast} />
<HotelsCard hotels={hotels} />
<TravelAdvisory
  weather={weather}
  destination={to}
/>
<RestaurantsCard restaurants={restaurants} />
<SmartRecommendation
   travelModes={travelModes}
/>
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

<TravelModes travelModes={travelModes} />
<BookingCard
  from={from}
  to={to}
/>
<AITripPlanner
  from={from}
  to={to}
/>
{routeInfo && (
  <RouteCard
    from={from}
    to={to}
    distance={routeInfo.distance}
    duration={routeInfo.duration}
  />
)}
<AIChat
  from={from}
  to={to}
/>
    </div>
      </div>
  );
}

export default Search;