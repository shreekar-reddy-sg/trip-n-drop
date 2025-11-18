import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const toLatLng = (loc) => {
if (!loc) return null;
// Accepts {lat, lng} or {coordinates:{lat,lng}} or {latLng:[lat,lng]}
if (Array.isArray(loc.latLng)) return { lat: Number(loc.latLng), lng: Number(loc.latLng) };​
if (loc.coordinates && typeof loc.coordinates.lat === 'number') return { lat: loc.coordinates.lat, lng: loc.coordinates.lng };
if (typeof loc.lat === 'number' && typeof loc.lng === 'number') return { lat: loc.lat, lng: loc.lng };
return null;
};

export default function MapView({ pickup, delivery, height = 360, zoom = 13 }) {
const mapRef = useRef(null);
const map = useRef(null);
const directionsService = useRef(null);
const directionsRenderer = useRef(null);

useEffect(() => {
const loader = new Loader({
apiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
version: 'weekly',
libraries: ['places']
});
const a = toLngLat(pickup);
const b = toLngLat(delivery);

// Clear route layer if exists
if (map.current.getLayer(routeId)) {
  map.current.removeLayer(routeId);
  map.current.removeSource(routeId);
}

const markers = [];
if (a) markers.push(new mapboxgl.Marker({ color: '#0ea5e9' }).setLngLat(a).addTo(map.current));
if (b) markers.push(new mapboxgl.Marker({ color: '#f59e0b' }).setLngLat(b).addTo(map.current));

const fit = () => {
  if (a && b) {
    const bounds = new mapboxgl.LngLatBounds(a, a);
    bounds.extend(b);
    map.current.fitBounds(bounds, { padding: 60 });
  } else if (a || b) {
    map.current.setCenter(a || b);
    map.current.setZoom(14);
  }
};

async function drawRoute() {
  if (!(a && b)) return fit();
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${a[0]},${a[1]};${b[0]},${b[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
  const res = await fetch(url);
  const json = await res.json();
  const line = json?.routes?.?.geometry;
  if (!line) return fit();

  map.current.addSource(routeId, { type: 'geojson', data: { type: 'Feature', geometry: line } });
  map.current.addLayer({
    id: routeId,
    type: 'line',
    source: routeId,
    paint: { 'line-color': '#0ea5e9', 'line-width': 5 }
  });
  const coords = line.coordinates;
  const bounds = coords.reduce((b, c) => b.extend(c), new mapboxgl.LngLatBounds(coords, coords));
  map.current.fitBounds(bounds, { padding: 60 });
}

drawRoute();

return () => {
  markers.forEach(m => m.remove());
};
}, [pickup, delivery, zoom]);

return <div ref={ref} style={{ width: '100%', height }} />;
}  
