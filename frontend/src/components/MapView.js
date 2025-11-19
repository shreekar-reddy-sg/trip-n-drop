import React, { useEffect, useRef } from 'react';


const MapView = ({ pickup, delivery }) => {
const mapRef = useRef(null);
const mapInstance = useRef(null);
const directionsService = useRef(null);
const directionsRenderer = useRef(null);


useEffect(() => {
if (!window.google) return;


mapInstance.current = new window.google.maps.Map(mapRef.current, {
center: { lat: 12.9716, lng: 77.5946 },
zoom: 12,
});


directionsService.current = new window.google.maps.DirectionsService();
directionsRenderer.current = new window.google.maps.DirectionsRenderer();
directionsRenderer.current.setMap(mapInstance.current);
}, []);


useEffect(() => {
if (pickup && delivery && window.google && directionsService.current) {
const origin = new window.google.maps.LatLng(pickup.lat, pickup.lng);
const destination = new window.google.maps.LatLng(delivery.lat, delivery.lng);


directionsService.current.route(
{
origin,
destination,
travelMode: window.google.maps.TravelMode.DRIVING,
},
(result, status) => {
if (status === 'OK') {
directionsRenderer.current.setDirections(result);
} else {
console.error('Directions request failed:', status);
}
}
);
}
}, [pickup, delivery]);


return (
<div
ref={mapRef}
style={{ height: '400px', width: '100%' }}
className="rounded-lg shadow-lg"
/>
);
};


export default MapView;
