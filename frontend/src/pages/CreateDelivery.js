import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deliveryAPI } from '../services/api';
import LocationInput from '../components/LocationInput';
import MapView from '../components/MapView';

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

  const handleLocationSelect = (type, location) => {
    setFormData({ ...formData, [type]: location });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.pickupLocation || !formData.deliveryLocation) {
      setError('Please select both pickup and delivery locations');
      return;
    }

    setLoading(true);

    try {
      await deliveryAPI.createDelivery(formData);
      navigate('/sender/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create delivery');
    } finally {
      setLoading(false);
    }
  };

  const packageSizes = [
    { value: 'S', label: 'Small (Geared Motorbike)', price: 50 },
    { value: 'M', label: 'Medium (Scooter)', price: 100 },
    { value: 'L', label: 'Large (Car)', price: 200 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Create Delivery Request
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <LocationInput
              label="Pickup Location"
              placeholder="Enter pickup address"
              onLocationSelect={(location) => handleLocationSelect('pickupLocation', location)}
            />

            <LocationInput
              label="Delivery Location"
              placeholder="Enter delivery address"
              onLocationSelect={(location) => handleLocationSelect('deliveryLocation', location)}
            />

            {formData.pickupLocation && formData.deliveryLocation && (
              <div className="my-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Route Preview</h3>
                <MapView
                  pickup={formData.pickupLocation.coordinates}
                  delivery={formData.deliveryLocation.coordinates}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receiver's Contact Number
              </label>
              <input
                type="tel"
                value={formData.receiverContact}
                onChange={(e) => setFormData({ ...formData, receiverContact: e.target.value })}
                placeholder="Enter 10-digit mobile number"
                pattern="[0-9]{10}"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Package Size
              </label>
              <div className="space-y-3">
                {packageSizes.map((size) => (
                  <label
                    key={size.value}
                    className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.packageSize === size.value
                        ? 'border-primary bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="packageSize"
                        value={size.value}
                        checked={formData.packageSize === size.value}
                        onChange={(e) => setFormData({ ...formData, packageSize: e.target.value })}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{size.label}</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-green-600">₹{size.price}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/sender/dashboard')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Creating...' : 'Create Delivery'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDelivery;
