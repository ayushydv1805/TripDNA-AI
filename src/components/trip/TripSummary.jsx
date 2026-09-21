function TripSummary({
  from,
  to,
  routeInfo,
  weather,
  hotels = [],
  restaurants = [],
  attractions = [],
}) {
  if (!routeInfo) return null;

  return (
    <section className="bg-gradient-to-r from-cyan-700 to-blue-900 rounded-2xl p-6 my-6 shadow-lg">
      <h2 className="text-3xl font-bold mb-5">📋 Trip Summary</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <p>📍 <b>From:</b> {from}</p>
        <p>🏁 <b>To:</b> {to}</p>
        <p>📏 <b>Distance:</b> {Number(routeInfo.distance).toFixed(1)} km</p>
        <p>⏱ <b>Time:</b> {Number(routeInfo.duration).toFixed(1)} hrs</p>
        <p>🌤 <b>Weather:</b> {weather?.temperature ?? "Unavailable"}°C</p>
        <p>🏨 <b>Hotels:</b> {hotels.length}</p>
        <p>🍽 <b>Restaurants:</b> {restaurants.length}</p>
        <p>📍 <b>Attractions:</b> {attractions.length}</p>
      </div>
    </section>
  );
}

export default TripSummary;
