import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteTrip, getTrips } from "../../services/trips";

function SavedTrips() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    setTrips(getTrips());
  }, []);

  function handleDelete(index) {
    deleteTrip(index);
    setTrips(getTrips());
  }

  if (trips.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold">📜 Saved Trips</h2>
          <Link to="/saved" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">
            View all →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {trips.slice(0, 4).map((trip, index) => (
            <article key={[trip.from, trip.to, index].join("-")} className="rounded-xl bg-slate-900/70 p-4">
              <h3 className="font-bold text-cyan-300">{trip.from} → {trip.to}</h3>
              <p className="mt-2 text-sm text-slate-400">{Number(trip.distance).toFixed(1)} km · {Number(trip.duration).toFixed(1)} hrs</p>
              <button type="button" onClick={() => handleDelete(index)} className="mt-3 text-sm text-red-300 hover:text-red-200">
                Delete
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SavedTrips;
