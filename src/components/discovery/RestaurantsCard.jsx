import { saveFavorite } from "../../services/storage/favorites";

function RestaurantsCard({ restaurants }) {
  if (!Array.isArray(restaurants) || restaurants.length === 0) return null;

  return (
    <section className="bg-slate-800 rounded-xl p-6 my-6">
      <h2 className="text-3xl font-bold mb-5">🍽 Nearby Restaurants</h2>

      <div className="grid md:grid-cols-2 gap-5">
        {restaurants.map((restaurant, index) => {
          const properties = restaurant?.properties || {};
          const name = properties.name || "Unnamed Restaurant";
          const address = properties.formatted || "Address not available";
          const lat = properties.lat;
          const lon = properties.lon;

          return (
            <article key={restaurant.id || [name, address, index].join("-")} className="bg-slate-900 rounded-xl p-5 shadow-lg">
              <h3 className="text-xl font-bold text-orange-400">🍽 {name}</h3>
              <p className="text-gray-300 mt-3">📍 {address}</p>

              <div className="flex flex-wrap gap-3 mt-5">
                <a
                  href={"https://www.google.com/maps?q=" + lat + "," + lon}
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
                  onClick={() => saveFavorite({ type: "Restaurant", name, address, lat, lon, id: restaurant.id })}
                  className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg"
                >
                  ❤️ Favorite
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default RestaurantsCard;
