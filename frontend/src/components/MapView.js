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
