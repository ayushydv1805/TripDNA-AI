import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

function TripDetails() {
  const { state } = useLocation();
  const trip = state?.trip;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white">
      <Navbar />

      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12">
        <section className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
          <div className="text-5xl">🧭</div>
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
            Trip Details
          </p>

          {trip ? (
            <>
              <h1 className="mt-3 text-3xl font-black">
                {trip.from} → {trip.to}
              </h1>
              <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-4 text-left">
                <div className="rounded-xl bg-black/20 p-4">
                  <p className="text-sm text-slate-400">Distance</p>
                  <p className="mt-1 font-bold">{trip.distance} km</p>
                </div>
                <div className="rounded-xl bg-black/20 p-4">
                  <p className="text-sm text-slate-400">Duration</p>
                  <p className="mt-1 font-bold">{trip.duration} hrs</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="mt-3 text-3xl font-black">No trip selected</h1>
              <p className="mx-auto mt-3 max-w-lg text-slate-400">
                Trip details are available after selecting a trip from a future saved-trip detail flow.
              </p>
            </>
          )}

          <Link
            to="/"
            className="mt-8 inline-flex rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            🏠 Back Home
          </Link>
        </section>
      </main>
    </div>
  );
}

export default TripDetails;
