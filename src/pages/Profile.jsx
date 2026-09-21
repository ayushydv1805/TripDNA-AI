import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { getFavorites } from "../services/storage/favorites";
import { getTrips } from "../services/storage/trips";

function Profile() {
  const favorites = getFavorites();
  const trips = getTrips();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-4xl">👤</div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">Local profile</p>
              <h1 className="mt-2 text-3xl font-black md:text-4xl">Traveler Dashboard</h1>
              <p className="mt-2 text-slate-300">Your TripDNA activity is stored locally in this browser.</p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <Link to="/saved" className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-cyan-300/30">
              <p className="text-3xl">🗺️</p>
              <h2 className="mt-3 text-xl font-bold">Saved Trips</h2>
              <p className="mt-1 text-slate-400">{trips.length} saved route{trips.length === 1 ? "" : "s"}</p>
            </Link>
            <Link to="/favorites" className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-pink-300/30">
              <p className="text-3xl">❤️</p>
              <h2 className="mt-3 text-xl font-bold">Favorites</h2>
              <p className="mt-1 text-slate-400">{favorites.length} saved place{favorites.length === 1 ? "" : "s"}</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;
