import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../app/useAuth";
import { getFavorites } from "../services/storage/favorites";
import { getTrips } from "../services/storage/trips";

function Profile() {
  const favorites = getFavorites();
  const trips = getTrips();
  const { user, cloudStatus, logout } = useAuth();
  const [feedback, setFeedback] = useState("");

  async function handleLogout() {
    setFeedback("");
    try {
      await logout();
      setFeedback("You have been signed out. Your on-device trip history is still saved.");
    } catch (error) {
      console.error("TripDNA sign-out failed:", error);
      setFeedback("We could not sign you out. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-4xl">👤</div>
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">{user ? "TripDNA account" : "Local profile"}</p>
              <h1 className="mt-2 break-words text-3xl font-black md:text-4xl">{user ? "Welcome, " + (user.displayName || "traveler") : "Traveler Dashboard"}</h1>
              {user ? <p className="mt-2 break-all text-slate-300">{user.email}</p> : <p className="mt-2 text-slate-300">Your TripDNA activity is saved on this device. Sign in to enable cloud backup.</p>}
              {user && <p className="mt-2 text-sm text-slate-400">{cloudStatus === "synced" ? "☁️ Account backup connected. Trips, recent searches and favorites sync to your account." : cloudStatus === "syncing" ? "☁️ Syncing your saved travel data…" : "💾 Your local data is safe. Cloud backup may need Firebase configuration or network access."}</p>}
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
            <Link to="/offline" className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-emerald-300/30">
              <p className="text-3xl">📦</p>
              <h2 className="mt-3 text-xl font-bold">Offline Packs</h2>
              <p className="mt-1 text-slate-400">Open saved trip snapshots without live data</p>
            </Link>
            <Link to="/backup" className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-violet-300/30">
              <p className="text-3xl">🗄️</p>
              <h2 className="mt-3 text-xl font-bold">Backup & Restore</h2>
              <p className="mt-1 text-slate-400">Download a file or move data to another device</p>
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {user ? (
              <button type="button" onClick={handleLogout} className="rounded-xl border border-white/15 px-5 py-3 font-bold transition hover:border-cyan-300/40 hover:text-cyan-300">Sign out</button>
            ) : (
              <Link to="/login" className="rounded-xl bg-cyan-300 px-5 py-3 font-extrabold text-slate-950 transition hover:bg-cyan-200">Sign in / Create account</Link>
            )}
            <Link to="/" className="rounded-xl border border-white/15 px-5 py-3 font-semibold transition hover:bg-white/5">Plan another trip</Link>
          </div>
          {feedback && <p role="status" className="mt-4 text-sm text-cyan-200">{feedback}</p>}
        </section>
      </main>
    </div>
  );
}

export default Profile;
