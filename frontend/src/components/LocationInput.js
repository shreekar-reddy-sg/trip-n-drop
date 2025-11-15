import React, { useState } from 'react';

const LocationInput = ({ label, onLocationSelect, placeholder }) => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simulate location search (In production, use Google Places API or Nominatim)
  const searchLocations = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    
    // Mock data - Replace with actual API call
    // For production: Use Google Places Autocomplete or Nominatim API
    const mockLocations = [
      { address: `${query} Street, Bangalore`, lat: 12.9716, lng: 77.5946 },
      { address: `${query} Road, Bangalore`, lat: 12.9352, lng: 77.6245 },
      { address: `${query} Circle, Bangalore`, lat: 12.9698, lng: 77.7499 },
    ];

    setTimeout(() => {
      setSuggestions(mockLocations);
      setLoading(false);
    }, 300);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    searchLocations(value);
  };

  const selectLocation = (location) => {
    setAddress(location.address);
    setSuggestions([]);
    onLocationSelect({
      address: location.address,
      coordinates: { lat: location.lat, lng: location.lng }
    });
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={address}
        onChange={handleInputChange}
        placeholder={placeholder || "Enter location"}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      
      {loading && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg p-2">
          <p className="text-sm text-gray-500">Searching...</p>
        </div>
      )}
      
      {suggestions.length > 0 && !loading && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => selectLocation(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
            >
              <p className="text-sm">{suggestion.address}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationInput;