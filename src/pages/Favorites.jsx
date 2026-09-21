import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getFavorites, removeFavorite } from "../services/favorites";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  function handleRemove(item) {
    removeFavorite(item);
    setFavorites(getFavorites());
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <header className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-pink-400">
            Your collection
          </p>
          <h1 className="mt-2 text-4xl font-black md:text-5xl">
            ❤️ My Favorites
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Keep the hotels, restaurants and attractions you want to revisit.
          </p>
        </header>

        {favorites.length === 0 ? (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
            <div className="text-5xl">💫</div>
            <h2 className="mt-4 text-2xl font-bold">No favorites yet</h2>
            <p className="mx-auto mt-2 max-w-lg text-slate-400">
              Save a hotel, restaurant or attraction from a trip search and it
              will appear here.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Explore a Trip
            </Link>
          </section>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {favorites.map((item) => (
              <article
                key={item.id || [item.name, item.address].join("-")}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  {item.type || "Place"}
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {item.name || "Saved place"}
                </h2>

                <p className="mt-3 leading-7 text-slate-300">
                  📍 {item.address || "Address not available"}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {Number.isFinite(Number(item.lat)) &&
                    Number.isFinite(Number(item.lon)) && (
                      <a
                        href={
                          "https://www.google.com/maps?q=" +
                          item.lat +
                          "," +
                          item.lon
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-green-600 px-4 py-2 font-semibold transition hover:bg-green-500"
                      >
                        🗺 Open Maps
                      </a>
                    )}

                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    className="rounded-lg bg-red-600 px-4 py-2 font-semibold transition hover:bg-red-500"
                  >
                    🗑 Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Favorites;
