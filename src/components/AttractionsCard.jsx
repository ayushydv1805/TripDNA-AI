import { saveFavorite } from "../services/favorites";

function AttractionsCard({ attractions }) {
  if (!Array.isArray(attractions) || attractions.length === 0) return null;

  return (
    <div className="bg-slate-800 rounded-xl p-6 my-6">
      <h2 className="text-3xl font-bold mb-5">📍 Tourist Attractions</h2>

      <div className="grid md:grid-cols-2 gap-5">
        {attractions.map((place, index) => {
          const properties = place?.properties || {};
          const name = properties.name || "Unnamed Place";
          const address = properties.formatted || "Address not available";
          const lat = properties.lat;
          const lon = properties.lon;
          const mapsUrl =
            "https://www.google.com/maps?q=" + lat + "," + lon;

          return (
            <div
              key={place.id || [name, address, index].join("-")}
              className="bg-slate-900 rounded-xl p-5 shadow-lg"
            >
              <h3 className="text-xl font-bold text-pink-400">📍 {name}</h3>
              <p className="text-gray-300 mt-3">📍 {address}</p>

              <div className="flex flex-wrap gap-3 mt-5">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg"
                >
                  🗺 Open Maps
                </a>

                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(address)}
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg"
                >
                  📋 Copy Address
                </button>

                <button
                  type="button"
                  onClick={() =>
                    saveFavorite({
                      type: "Attraction",
                      name,
                      address,
                      lat,
                      lon,
                      id: place.id,
                    })
                  }
                  className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg"
                >
                  ❤️ Favorite
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AttractionsCard;
