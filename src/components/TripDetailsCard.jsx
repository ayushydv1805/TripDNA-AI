function TripDetailsCard({ routeInfo }) {
  if (!routeInfo) return null;

  return (
    <div className="bg-slate-800 rounded-xl p-5 my-5">
      <h2 className="text-2xl font-bold mb-3">
        🛣️ Trip Details
      </h2>

      <p>📏 Distance: {routeInfo.distance} km</p>

      <p>⏱️ Estimated Time: {routeInfo.duration} hours</p>
    </div>
  );
}

export default TripDetailsCard;