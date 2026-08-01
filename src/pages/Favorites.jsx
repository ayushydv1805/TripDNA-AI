import { getFavorites, removeFavorite } from "../services/favorites";

function Favorites() {
  const favorites = getFavorites();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <h1 className="text-4xl font-bold mb-8">
        ❤️ My Favorites
      </h1>

      {favorites.length === 0 ? (
        <p>No favorite places saved.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {favorites.map((item, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-xl p-5"
            >
              <h2 className="text-2xl font-bold text-cyan-400">
                {item.type} : {item.name}
              </h2>

              <p className="mt-3">
                📍 {item.address}
              </p>

              <div className="flex gap-3 mt-5">

                <a
                  href={`https://www.google.com/maps?q=${item.lat},${item.lon}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-600 px-4 py-2 rounded-lg"
                >
                  🗺 Open Maps
                </a>

                <button
                  onClick={() => {
                    removeFavorite(item.name);
                    window.location.reload();
                  }}
                  className="bg-red-600 px-4 py-2 rounded-lg"
                >
                  🗑 Remove
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;