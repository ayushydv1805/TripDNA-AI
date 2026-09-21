function TripDashboard({
  from,
  to,
  routeInfo,
  weather,
  hotels = [],
  restaurants = [],
  attractions = [],
  budget,
}) {
  if (!routeInfo) return null;

  const distance = Number(routeInfo.distance);
  const duration = Number(routeInfo.duration);
  const temperature =
    typeof weather?.temperature === "number"
      ? Math.round(weather.temperature) + "°C"
      : "Unavailable";

  const stats = [
    ["📍", "Route", from + " → " + to],
    ["📏", "Distance", Number.isFinite(distance) ? distance.toFixed(1) + " km" : "Unavailable"],
    ["⏱", "Duration", Number.isFinite(duration) ? duration.toFixed(1) + " hrs" : "Unavailable"],
    ["🌡", "Temperature", temperature],
    ["🏨", "Hotels", hotels.length],
    ["🍴", "Restaurants", restaurants.length],
    ["🏛", "Attractions", attractions.length],
    ["💰", "Budget", "₹ " + Number(budget?.total || 0).toLocaleString("en-IN")],
  ];

  return (
    <section className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-6 my-6 shadow-xl">
      <h2 className="text-3xl font-bold mb-6">📊 Trip Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {stats.map(([icon, label, value]) => (
          <div key={label} className="bg-white/10 rounded-xl p-4">
            <h3 className="text-gray-200">{icon} {label}</h3>
            <p className="font-bold mt-2 break-words">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TripDashboard;
