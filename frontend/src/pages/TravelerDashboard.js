// src/components/MapView.js
import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// Optional: you can remove routing-machine if not using it directly
import "leaflet-routing-machine";

// Fix default marker icons for React Leaflet in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Utility to normalize any supported input to [lat, lng]
const toLatLngTuple = (loc) => {
  if (!loc) return null;
  if (typeof loc.lat === "number" && typeof loc.lng === "number") {
    return [Number(loc.lat), Number(loc.lng)];
  }
  if (loc.coordinates && typeof loc.coordinates.lat === "number" && typeof loc.coordinates.lng === "number") {
    return [Number(loc.coordinates.lat), Number(loc.coordinates.lng)];
  }
  if (Array.isArray(loc) && loc.length === 2) {
    return [Number(loc[0]), Number(loc[1])];
  }
  return null;
};

const Fit = ({ points }) => {
  const map = useMap();
  React.useEffect(() => {
    if (!map || points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 14);
    } else {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [map, points]);
  return null;
};

const MapView = ({ pickup, delivery, center, height = 360, zoom = 13 }) => {
  const fallbackCenter = center || [12.9716, 77.5946]; // Bengaluru
  const pA = toLatLngTuple(pickup);
  const pB = toLatLngTuple(delivery);
  const positions = [];
  if (pA) positions.push(pA);
  if (pB) positions.push(pB);
  const hasBoth = positions.length === 2;

  return (
    <MapContainer center={fallbackCenter} zoom={zoom} style={{ height, width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
      {hasBoth && <Polyline positions={positions} color="#0ea5e9" weight={4} />}
      <Fit points={positions} />
    </MapContainer>
  );
};

export default MapView;
