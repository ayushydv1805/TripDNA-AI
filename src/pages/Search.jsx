import { useSearchParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import MapView from "../components/trip/MapView";
import SearchResults from "../features/search/components/SearchResults";
import { useTripSearchData } from "../features/search/hooks/useTripSearchData";

function Search() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from")?.trim() || "";
  const to = searchParams.get("to")?.trim() || "";

  const trip = useTripSearchData(from, to);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <header className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
            Trip intelligence
          </p>
          <h1 className="text-4xl font-black md:text-5xl">Search Results</h1>
          <h2 className="mt-3 text-lg text-slate-300 md:text-xl">
            📍 {from || "—"} <span className="text-cyan-400">→</span> {to || "—"}
          </h2>
        </header>

        {trip.loading && (
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6 text-center">
            <p className="text-lg font-semibold text-cyan-300">
              ✨ Building your trip dashboard...
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Finding routes, weather, places and travel options.
            </p>
          </div>
        )}

        {trip.error && (
          <div className="my-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-5 text-red-100">
            <p className="font-semibold">⚠️ {trip.error}</p>
          </div>
        )}

        <SearchResults from={from} to={to} trip={trip} />

        {trip.routeInfo && (
          <MapView
            fromLocation={trip.fromLocation}
            toLocation={trip.toLocation}
            route={trip.routeInfo}
          />
        )}
      </main>
    </div>
  );
}

export default Search;
