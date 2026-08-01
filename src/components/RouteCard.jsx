function RouteCard({ from, to, distance, duration }) {
const mapsUrl = `https://www.google.com/maps/dir/${encodeURIComponent(
  from
)}/${encodeURIComponent(to)}`;
  const fuelPrice = 100;
  const mileage = 15;

  const fuelCost = distance
    ? Math.round((distance / mileage) * fuelPrice)
    : 0;

  const toll = distance
    ? Math.round(distance * 1.2)
    : 0;

  return (
    <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-lg mt-6">

      <h2 className="text-2xl font-bold text-cyan-400 mb-5">
        🚗 Journey Details
      </h2>
      <a
  href={mapsUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="block mt-6 bg-blue-600 hover:bg-blue-700 text-center py-3 rounded-xl font-bold"
>
  🧭 Open in Google Maps
</a>

      <div className="grid md:grid-cols-2 gap-5">

        <div className="bg-black/20 p-4 rounded-xl">
          <h3>📍 From</h3>
          <p>{from}</p>
        </div>

        <div className="bg-black/20 p-4 rounded-xl">
          <h3>📍 To</h3>
          <p>{to}</p>
        </div>

        <div className="bg-black/20 p-4 rounded-xl">
          <h3>📏 Distance</h3>
          <p>{distance ? `${distance.toFixed(1)} km` : "Loading..."}</p>
        </div>

        <div className="bg-black/20 p-4 rounded-xl">
          <h3>⏱ Duration</h3>
        <p>
  {typeof duration === "number"
    ? `${duration.toFixed(1)} hrs`
    : "Loading..."}
</p>
        </div>

        <div className="bg-black/20 p-4 rounded-xl">
          <h3>⛽ Fuel Cost</h3>
          <p>₹ {fuelCost}</p>
        </div>

        <div className="bg-black/20 p-4 rounded-xl">
          <h3>🛣 Toll Estimate</h3>
          <p>₹ {toll}</p>
        </div>

      </div>

    </div>
  );
}

export default RouteCard;