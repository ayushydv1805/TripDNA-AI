import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapAutoFit({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const bounds = points.map(([lat, lon]) => [lat, lon]);

    map.fitBounds(bounds, {
      padding: [44, 44],
      maxZoom: 12,
      animate: true,
      duration: 0.8,
    });
  }, [map, points]);

  return null;
}

function MapView({ fromLocation, toLocation, route }) {
  if (!fromLocation || !toLocation) return null;

  const routeCoordinates = Array.isArray(route?.coordinates)
    ? route.coordinates
    : [];

  const routePoints = routeCoordinates.map(([lon, lat]) => [lat, lon]);

  const mapPoints = [
    [Number(fromLocation.lat), Number(fromLocation.lon)],
    [Number(toLocation.lat), Number(toLocation.lon)],
    ...routePoints,
  ].filter(([lat, lon]) => Number.isFinite(lat) && Number.isFinite(lon));

  return (
    <section className="my-8 lg:sticky lg:top-24 lg:z-20">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              Live route
            </p>
            <h2 className="mt-1 text-lg font-bold text-white md:text-xl">
              {fromLocation.name || "Starting point"}{" "}
              <span className="text-cyan-400">→</span>{" "}
              {toLocation.name || "Destination"}
            </h2>
          </div>

          <div className="hidden rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300 sm:block">
            Path visible
          </div>
        </div>

        <div className="h-[62vh] min-h-[430px] w-full lg:h-[calc(100vh-170px)] lg:min-h-[520px]">
          <MapContainer
            center={[fromLocation.lat, fromLocation.lon]}
            zoom={6}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapAutoFit points={mapPoints} />

            <Marker position={[fromLocation.lat, fromLocation.lon]}>
              <Popup>{fromLocation.name || "Starting point"}</Popup>
            </Marker>

            <Marker position={[toLocation.lat, toLocation.lon]}>
              <Popup>{toLocation.name || "Destination"}</Popup>
            </Marker>

            {routePoints.length > 1 && (
              <Polyline
                positions={routePoints}
                pathOptions={{
                  color: "#06b6d4",
                  weight: 7,
                  opacity: 0.9,
                  lineCap: "round",
                  lineJoin: "round",
                }}
              />
            )}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}

export default MapView;
