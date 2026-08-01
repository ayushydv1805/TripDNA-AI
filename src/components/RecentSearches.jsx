import { useEffect, useState } from "react";

function RecentSearches() {
  const [searches, setSearches] = useState([]);

  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem("recentSearches")) || [];

    setSearches(data);
  }, []);

  if (searches.length === 0) return null;

  return (
    <div className="bg-slate-800 rounded-xl p-6 my-6">
      <h2 className="text-2xl font-bold mb-5">
        🕒 Recent Searches
      </h2>

      {searches.map((trip, index) => (
        <div
          key={index}
          className="border-b border-slate-600 py-3"
        >
          <p className="font-bold">
            📍 {trip.from} → {trip.to}
          </p>

          <p className="text-gray-400 text-sm">
            {trip.date}
          </p>
        </div>
      ))}
    </div>
  );
}

export default RecentSearches;