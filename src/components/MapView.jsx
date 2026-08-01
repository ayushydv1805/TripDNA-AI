import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";


  
function MapView({ fromLocation, toLocation, route }) {
  if (!fromLocation || !toLocation) return null;

  return (
    <MapContainer
      center={[fromLocation.lat, fromLocation.lon]}
      zoom={6}
      style={{ height: "400px", width: "100%", borderRadius: "16px" }}
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
    positions={route.coordinates.map((coord) => [
      coord[1],
      coord[0],
    ])}
    pathOptions={{
      color: "#06b6d4",
      weight: 6,
    }}
  />
)}
      
    </MapContainer>
  );
}

export default MapView;