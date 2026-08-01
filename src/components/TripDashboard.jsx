function TripDashboard({
  from,
  to,
  routeInfo,
  weather,
  hotels,
  restaurants,
  attractions,
  budget,
}) {
  if (!routeInfo || !weather) return null;

  return (
    <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-6 my-6 shadow-xl">

      <h2 className="text-3xl font-bold mb-6">
        📊 Trip Dashboard
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

        <div className="bg-white/10 rounded-xl p-4">
          <h3 className="text-gray-200">📍 Route</h3>
          <p className="font-bold mt-2">
            {from} → {to}
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <h3>📏 Distance</h3>
          <p className="font-bold mt-2">
            {routeInfo.distance} km
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <h3>⏱ Duration</h3>
          <p className="font-bold mt-2">
            {routeInfo.duration} hrs
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <h3>🌡 Temperature</h3>
          <p className="font-bold mt-2">
            {weather.temperature}°C
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <h3>🏨 Hotels</h3>
          <p className="font-bold mt-2">
            {hotels.length}
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <h3>🍴 Restaurants</h3>
          <p className="font-bold mt-2">
            {restaurants.length}
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <h3>🏛 Attractions</h3>
          <p className="font-bold mt-2">
            {attractions.length}
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <h3>💰 Budget</h3>
          <p className="font-bold mt-2">
            ₹ {budget?.total || 0}
          </p>
        </div>

      </div>

    </div>
  );
}

export default TripDashboard;