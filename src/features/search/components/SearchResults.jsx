import AIChat from "../../../components/ai/AIChat";
import AITripPlanner from "../../../components/ai/AITripPlanner";
import AttractionsCard from "../../../components/discovery/AttractionsCard";
import DestinationGallery from "../../../components/discovery/DestinationGallery";
import EmergencyServices from "../../../components/discovery/EmergencyServices";
import ForecastCard from "../../../components/discovery/ForecastCard";
import HotelsCard from "../../../components/discovery/HotelsCard";
import RestaurantsCard from "../../../components/discovery/RestaurantsCard";
import WeatherCard from "../../../components/discovery/WeatherCard";
import BookingCard from "../../../components/trip/BookingCard";
import BudgetCard from "../../../components/trip/BudgetCard";
import RouteCard from "../../../components/trip/RouteCard";
import SmartRecommendation from "../../../components/trip/SmartRecommendation";
import TravelAdvisory from "../../../components/trip/TravelAdvisory";
import TravelModes from "../../../components/trip/TravelModes";
import TripDashboard from "../../../components/trip/TripDashboard";
import TripDetailsCard from "../../../components/trip/TripDetailsCard";
import TripSummary from "../../../components/trip/TripSummary";

function SearchResults({ from, to, trip }) {
  if (!trip.routeInfo) return null;

  return (
    <>
      <TripDashboard
        from={from}
        to={to}
        routeInfo={trip.routeInfo}
        weather={trip.weather}
        hotels={trip.hotels}
        restaurants={trip.restaurants}
        attractions={trip.attractions}
        budget={trip.budget}
      />

      {trip.destinationImage && (
        <div className="my-6 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
          <img
            src={trip.destinationImage}
            alt={"Scenic view of " + to}
            className="h-72 w-full object-cover md:h-96"
            loading="eager"
          />
        </div>
      )}

      <DestinationGallery images={trip.destinationImages} />

      <TripSummary
        from={from}
        to={to}
        routeInfo={trip.routeInfo}
        weather={trip.weather}
        hotels={trip.hotels}
        restaurants={trip.restaurants}
        attractions={trip.attractions}
      />

      <TravelModes travelModes={trip.travelModes} />
      <SmartRecommendation travelModes={trip.travelModes} />

      <TripDetailsCard routeInfo={trip.routeInfo} />
      <WeatherCard weather={trip.weather} />
      <ForecastCard forecast={trip.forecast} />
      <HotelsCard hotels={trip.hotels} />
      <TravelAdvisory weather={trip.weather} destination={to} />
      <RestaurantsCard restaurants={trip.restaurants} />
      <AttractionsCard attractions={trip.attractions} />

      <EmergencyServices title="Nearby Hospitals" icon="🏥" places={trip.hospitals} />
      <EmergencyServices title="Nearby Pharmacies" icon="💊" places={trip.pharmacies} />
      <EmergencyServices title="Nearby ATMs" icon="🏧" places={trip.atms} />
      <EmergencyServices title="Nearby Petrol Pumps" icon="⛽" places={trip.petrolPumps} />

      <BudgetCard budget={trip.budget} />
      <BookingCard from={from} to={to} />

      <AITripPlanner from={from} to={to} />
      <AIChat from={from} to={to} />

      <RouteCard
        from={from}
        to={to}
        distance={trip.routeInfo.distance}
        duration={trip.routeInfo.duration}
      />

    </>
  );
}

export default SearchResults;
