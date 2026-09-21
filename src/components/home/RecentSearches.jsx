import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecentSearches } from "../../features/search/utils/recentSearches";

function RecentSearches() {
  const [searches, setSearches] = useState([]);

  useEffect(() => {
    setSearches(getRecentSearches());
  }, []);

  if (searches.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold">🕒 Recent Searches</h2>
          <span className="text-sm text-slate-400">{searches.length} saved</span>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {searches.slice(0, 6).map((trip, index) => (
            <Link
              key={[trip.from, trip.to, index].join("-")}
              to={"/search?from=" + encodeURIComponent(trip.from) + "&to=" + encodeURIComponent(trip.to)}
              className="rounded-xl border border-white/10 bg-slate-900/60 p-4 transition hover:border-cyan-400/30"
            >
              <p className="font-semibold">📍 {trip.from} → {trip.to}</p>
              <p className="mt-1 text-sm text-slate-500">{trip.date}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RecentSearches;
