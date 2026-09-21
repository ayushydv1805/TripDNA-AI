function RouteCard({ from, to, distance, duration }) {
  const mapsUrl =
    "https://www.google.com/maps/dir/" +
    encodeURIComponent(from) +
    "/" +
    encodeURIComponent(to);

  const numericDistance = Number(distance);
  const numericDuration = Number(duration);

  const fuelCost = Number.isFinite(numericDistance)
    ? Math.round((numericDistance / 15) * 100)
    : 0;

  const toll = Number.isFinite(numericDistance)
    ? Math.round(numericDistance * 1.2)
    : 0;

  return (
    <section className="bg-white/10 rounded-2xl p-6 backdrop-blur-lg mt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-cyan-300">
            Route planning
          </p>
          <h2 className="text-2xl font-bold text-cyan-400">🚗 Journey Details</h2>
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-blue-600 hover:bg-blue-500 text-center py-3 px-5 font-bold"
        >
          🧭 Open in Google Maps
        </a>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mt-6">
        {[
          ["📍", "From", from],
          ["📍", "To", to],
          ["📏", "Distance", Number.isFinite(numericDistance) ? numericDistance.toFixed(1) + " km" : "Unavailable"],
          ["⏱", "Duration", Number.isFinite(numericDuration) ? numericDuration.toFixed(1) + " hrs" : "Unavailable"],
          ["⛽", "Fuel Cost", "₹ " + fuelCost.toLocaleString("en-IN")],
          ["🛣", "Toll Estimate", "₹ " + toll.toLocaleString("en-IN")],
        ].map(([icon, label, value]) => (
          <div key={label} className="bg-black/20 p-4 rounded-xl">
            <h3>{icon} {label}</h3>
            <p className="mt-1 font-semibold break-words">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RouteCard;
