// src/components/MapView.js
import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// IMPORTANT: Only import routing-machine if you actually use L.Routing.* controls elsewhere.
// Comment it out if not used to prevent build/runtime issues.
// import "leaflet-routing-machine";

// Fix default marker icons so they load correctly in bundlers
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: markerShadow,
});

// Utility to normalize any supported input to [lat, lng]
const toLatLngTuple = (loc) => {
  if (!loc) return null;
  // {lat, lng}
  if (typeof loc.lat === "number" && typeof loc.lng === "number") {
    const a = Number(loc.lat);
    const b = Number(loc.lng);
    return Number.isFinite(a) && Number.isFinite(b) ? [a, b] : null;
  }
  // {coordinates: {lat, lng}}
  if (
    loc.coordinates &&
    typeof loc.coordinates.lat === "number" &&
    typeof loc.coordinates.lng === "number"
  ) {
    const a = Number(loc.coordinates.lat);
    const b = Number(loc.coordinates.lng);
    return Number.isFinite(a) && Number.isFinite(b) ? [a, b] : null;
  }
  // [lat, lng]
  if (Array.isArray(loc) && loc.length === 2) {
    const a = Number(loc[0]);
    const b = Number(loc[1]);
    return Number.isFinite(a) && Number.isFinite(b) ? [a, b] : null;
  }
  return null;
};

const Fit = ({ points }) => {
  const map = useMap();
  React.useEffect(() => {
    if (!map || !Array.isArray(points)) return;
    const valid = points.filter(
      (p) =>
        Array.isArray(p) &&
        p.length === 2 &&
        Number.isFinite(p[0]) &&
        Number.isFinite(p[1])
    );
    if (valid.length === 0) return;
    if (valid.length === 1) {
      map.setView(valid[0], 14);
    } else {
      const bounds = L.latLngBounds(valid);
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [map, points]);
  return null;
};

const MapView = ({ pickup, delivery, center, height = 360, zoom = 13 }) => {
  const fallbackCenter = Array.isArray(center) && center.length === 2 ? center : [12.9716, 77.5946]; // Bengaluru
  const pA = toLatLngTuple(pickup);
  const pB = toLatLngTuple(delivery);

  const positions = [];
  if (pA) positions.push(pA);
  if (pB) positions.push(pB);
  const hasBoth = positions.length === 2;

  return (
    <div style={{ width: "100%", height }}>
      <MapContainer center={fallbackCenter} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // optional attribution to be explicit
          attribution="&copy; OpenStreetMap contributors"
        />
        {pA && (
          <Marker position={pA}>
            <Popup>Pickup Location</Popup>
          </Marker>
        )}
        {pB && (
          <Marker position={pB}>
            <Popup>Delivery Location</Popup>
          </Marker>
        )}
        {hasBoth && (
          <Polyline
            positions={positions}
            pathOptions={{ color: "#0ea5e9", weight: 4 }}
          />
        )}
        <Fit points={positions} />
      </MapContainer>
    </div>
  );
};

export default MapView;
