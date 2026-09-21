import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapView({ fromLocation, toLocation, route }) {
  if (!fromLocation || !toLocation) return null;

  return (
    <section className="relative z-0 my-8 overflow-hidden rounded-2xl border border-white/10 shadow-xl">
      <div className="border-b border-white/10 bg-slate-900/80 px-5 py-4">
        <h2 className="text-xl font-bold text-white">🗺️ Route Map</h2>
        <p className="mt-1 text-sm text-slate-400">
          View the route between your starting point and destination.
        </p>
      </div>

      <MapContainer
        center={[fromLocation.lat, fromLocation.lon]}
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: "400px", width: "100%", position: "relative" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[fromLocation.lat, fromLocation.lon]}>
          <Popup>{fromLocation.name}</Popup>
        </Marker>

        <Marker position={[toLocation.lat, toLocation.lon]}>
          <Popup>{toLocation.name}</Popup>
        </Marker>

        {route?.coordinates && (
          <Polyline
            positions={route.coordinates.map((coordinate) => [
              coordinate[1],
              coordinate[0],
            ])}
            pathOptions={{ color: "#06b6d4", weight: 6 }}
          />
        )}
      </MapContainer>
    </section>
  );
}

export default MapView;
