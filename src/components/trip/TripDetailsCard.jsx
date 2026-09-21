function TripDetailsCard({ routeInfo }) {
  if (!routeInfo) return null;

  const distance = Number(routeInfo.distance);
  const duration = Number(routeInfo.duration);

  return (
    <section className="bg-slate-800 rounded-xl p-5 my-5">
      <h2 className="text-2xl font-bold mb-3">🛣️ Trip Details</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        <p>📏 Distance: {Number.isFinite(distance) ? distance.toFixed(1) : "Unavailable"} km</p>
        <p>⏱️ Estimated Time: {Number.isFinite(duration) ? duration.toFixed(1) : "Unavailable"} hours</p>
      </div>
    </section>
  );
}

export default TripDetailsCard;
