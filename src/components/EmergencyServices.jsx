function EmergencyServices({
  title,
  icon,
  places
}) {
  if (!places || places.length === 0) return null;

  return (
    <div className="bg-slate-800 rounded-xl p-6 my-6">
      <h2 className="text-3xl font-bold mb-5">
        {icon} {title}
      </h2>

      <div className="grid md:grid-cols-2 gap-5">
        {places.map((place, index) => {
          const name =
            place.properties.name || "Unknown";

          const address =
            place.properties.formatted || "No Address";

          const lat = place.properties.lat;
          const lon = place.properties.lon;

          return (
            <div
              key={index}
              className="bg-slate-900 rounded-xl p-5"
            >
              <h3 className="text-xl font-bold text-cyan-400">
                {name}
              </h3>

              <p className="text-gray-300 mt-3">
                📍 {address}
              </p>

              <div className="flex gap-3 mt-5">

                <a
                  href={`https://www.google.com/maps?q=${lat},${lon}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-600 px-4 py-2 rounded-lg"
                >
                  🗺 Open Maps
                </a>

                <button
                  onClick={() =>
                    navigator.clipboard.writeText(address)
                  }
                  className="bg-blue-600 px-4 py-2 rounded-lg"
                >
                  📋 Copy
                </button>

              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EmergencyServices;