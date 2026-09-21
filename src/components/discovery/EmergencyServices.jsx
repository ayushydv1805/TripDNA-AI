function EmergencyServices({ title, icon, places }) {
  if (!Array.isArray(places) || places.length === 0) return null;

  return (
    <section className="bg-slate-800 rounded-xl p-6 my-6">
      <h2 className="text-3xl font-bold mb-5">{icon} {title}</h2>

      <div className="grid md:grid-cols-2 gap-5">
        {places.map((place, index) => {
          const properties = place?.properties || {};
          const name = properties.name || "Unknown";
          const address = properties.formatted || "No Address";
          const lat = properties.lat;
          const lon = properties.lon;

          return (
            <article
              key={place.id || [name, address, index].join("-")}
              className="bg-slate-900 rounded-xl p-5"
            >
              <h3 className="text-xl font-bold text-cyan-400">{name}</h3>
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
                  📋 Copy
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default EmergencyServices;
