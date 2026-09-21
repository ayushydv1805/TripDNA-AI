import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import { deleteTrip, getTrips } from "../services/storage/trips";

function SavedTrips() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    setTrips(getTrips());
  }, []);

  function handleDelete(index) {
    deleteTrip(index);
    setTrips(getTrips());
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">Your journeys</p>
          <h1 className="mt-2 text-4xl font-black md:text-5xl">Saved Trips</h1>
          <p className="mt-3 text-slate-300">Your recent trip searches are stored locally in this browser.</p>
        </header>

        {trips.length === 0 ? (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
            <div className="text-5xl">🗺️</div>
            <h2 className="mt-4 text-2xl font-bold">No saved trips</h2>
            <p className="mt-2 text-slate-400">Search for a route to automatically save it here.</p>
          </section>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {trips.map((trip, index) => (
              <article key={[trip.from, trip.to, index].join("-")} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <p className="text-sm font-bold text-cyan-300">📍 {trip.from} → {trip.to}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-black/20 p-4">
                    <span className="text-slate-400">Distance</span>
                    <p className="mt-1 font-bold">{Number(trip.distance).toFixed(1)} km</p>
                  </div>
                  <div className="rounded-xl bg-black/20 p-4">
                    <span className="text-slate-400">Duration</span>
                    <p className="mt-1 font-bold">{Number(trip.duration).toFixed(1)} hrs</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-500">{trip.date}</p>
                <button type="button" onClick={() => handleDelete(index)} className="mt-5 rounded-lg bg-red-600 px-4 py-2 font-semibold hover:bg-red-500">
                  🗑 Delete
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default SavedTrips;
