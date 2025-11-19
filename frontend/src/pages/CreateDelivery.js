// src/pages/CreateDelivery.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deliveryAPI } from '../services/api';
import MapView from '../components/MapView';
// If you already have a LocationInput, keep using it; otherwise this file shows a simple fallback.
import LocationInput from '../components/LocationInput';

const normalizePlace = (place) => {
  if (!place) return null;
  // Accepts Google Places result, custom object, or saved shape
  const lat =
    typeof place?.geometry?.location?.lat === 'function'
      ? place.geometry.location.lat()
      : place?.geometry?.location?.lat ?? place?.coordinates?.lat ?? place?.lat;
  const lng =
    typeof place?.geometry?.location?.lng === 'function'
      ? place.geometry.location.lng()
      : place?.geometry?.location?.lng ?? place?.coordinates?.lng ?? place?.lng;

  if (lat == null || lng == null) return null;

  return {
    address: place.formatted_address || place.description || place.address || '',
    coordinates: {
      lat: Number(lat),
      lng: Number(lng),
    },
  };
};

const CreateDelivery = () => {
  const [formData, setFormData] = useState({
    pickupLocation: null,
    deliveryLocation: null,
    receiverContact: '',
    packageSize: 'S',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // This is the function you asked about — paste it here:
  const handleLocationSelect = (type, place) => {
    if (!place) return;
    const loc = normalizePlace(place);
    if (!loc) {
      setError('Could not read location coordinates. Please pick from autocomplete suggestions.');
      return;
    }
    setFormData((prev) => ({ ...prev, [type]: loc }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.pickupLocation || !formData.deliveryLocation) {
      setError('Please select both pickup and delivery locations');
      return;
    }

    // Validate coordinates are numbers
    const { pickupLocation, deliveryLocation } = formData;
    const ok =
      typeof pickupLocation.coordinates?.lat === 'number' &&
      typeof pickupLocation.coordinates?.lng === 'number' &&
      typeof deliveryLocation.coordinates?.lat === 'number' &&
      typeof deliveryLocation.coordinates?.lng === 'number';

    if (!ok) {
      setError('Invalid coordinates for pickup or delivery. Please reselect.');
      return;
    }

    // Optional: validate receiver mobile (10 digits)
    const phoneOk = /^[0-9]{10}$/.test(formData.receiverContact);
    if (!phoneOk) {
      setError('Enter a valid 10-digit receiver mobile number');
      return;
    }

    setLoading(true);
    try {
      // Send exactly what backend expects
      await deliveryAPI.createDelivery({
        pickupLocation: formData.pickupLocation,
        deliveryLocation: formData.deliveryLocation,
        receiverContact: formData.receiverContact,
        packageSize: formData.packageSize,
      });
      navigate('/sender/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create delivery');
    } finally {
      setLoading(false);
    }
  };

  const packageSizes = [
    { value: 'S', label: 'Small (Geared Motorbike)' },
    { value: 'M', label: 'Medium (Scooter)' },
    { value: 'L', label: 'Large (Car)' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Create Delivery</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Pickup */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Pickup location</label>
          {/* Your LocationInput should call onSelect(typeResult) with a Google Place result or custom object */}
          <LocationInput
            placeholder="Search pickup address"
            onSelect={(place) => handleLocationSelect('pickupLocation', place)}
          />
          {formData.pickupLocation?.address && (
            <p className="text-xs opacity-80">Selected: {formData.pickupLocation.address}</p>
