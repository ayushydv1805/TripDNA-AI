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
    <section className="my-6 overflow-hidden rounded-2xl">
      <MapContainer
        center={[fromLocation.lat, fromLocation.lon]}
        zoom={6}
        style={{ height: "400px", width: "100%" }}
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
