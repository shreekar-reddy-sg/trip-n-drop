import React, { useState, useEffect, useRef } from 'react';


const LocationInput = ({ label, onLocationSelect, placeholder }) => {
const [address, setAddress] = useState('');
const autoCompleteRef = useRef(null);
const inputRef = useRef(null);


useEffect(() => {
if (!window.google) return;


autoCompleteRef.current = new window.google.maps.places.Autocomplete(
inputRef.current,
{ types: ['geocode'] }
);


autoCompleteRef.current.addListener('place_changed', () => {
const place = autoCompleteRef.current.getPlace();


if (!place.geometry) return;


const selectedLocation = {
address: place.formatted_address,
coordinates: {
lat: place.geometry.location.lat(),
lng: place.geometry.location.lng(),
},
};


setAddress(place.formatted_address);
onLocationSelect(selectedLocation);
});
}, []);


return (
<div className="relative">
<label className="block text-sm font-medium text-gray-700 mb-2">
{label}
</label>
<input
ref={inputRef}
type="text"
value={address}
onChange={(e) => setAddress(e.target.value)}
placeholder={placeholder || 'Search location'}
className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
/>
</div>
);
};


export default LocationInput;
