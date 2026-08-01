import { useEffect, useState } from "react";
import { getTrips, deleteTrip } from "../services/trips";

function SavedTrips() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    setTrips(getTrips());
  }, []);

  function remove(index) {
    deleteTrip(index);
    setTrips(getTrips());
  }

  if (trips.length === 0) return null;

  return (
    <div className="bg-slate-800 rounded-xl p-6 my-6">
      <h2 className="text-2xl font-bold mb-5">
        📜 Saved Trips
      </h2>

      {trips.map((trip, index) => (
        <div
          key={index}
          className="bg-slate-900 rounded-xl p-4 mb-4"
        >
          <h3 className="font-bold text-cyan-400">
            {trip.from} → {trip.to}
          </h3>

          <p>📏 {trip.distance} km</p>

          <p>⏱ {trip.duration} hrs</p>

          <p className="text-gray-400">
            {trip.date}
          </p>

          <button
            onClick={() => remove(index)}
            className="bg-red-600 px-4 py-2 rounded-lg mt-3"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default SavedTrips;