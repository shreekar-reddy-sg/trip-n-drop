import React, { useState, useEffect } from 'react';
import { deliveryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DeliveryCard from '../components/DeliveryCard';
import LocationInput from '../components/LocationInput';

const TravelerDashboard = () => {
  const { user } = useAuth();
  const [myJobs, setMyJobs] = useState([]);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [showCheckOrders, setShowCheckOrders] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpInput, setOtpInput] = useState({});

  const [journeyData, setJourneyData] = useState({
    startLocation: null, // { address, coordinates: { lat, lng } }
    endLocation: null,   // same shape
    vehicleType: 'geared motorbike',
  });

  useEffect(() => {
    fetchMyJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMyJobs = async () => {
    try {
      const response = await deliveryAPI.getMyJobs();
      // guard: if response.data is not an array, default to []
      setMyJobs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setMyJobs([]);
    }
  };

  const handleCheckOrders = async () => {
    // Basic validation
    if (
      !journeyData.startLocation ||
      !journeyData.startLocation.coordinates ||
      !journeyData.endLocation ||
      !journeyData.endLocation.coordinates
    ) {
      alert('Please select both start and end locations');
      return;
    }

    setLoading(true);
    try {
      /* Backend contract:
         We send the full location objects (address + coordinates) so the server
         can match orders by proximity, bounding box, etc. If your backend expects
         only lat/lng, change the payload accordingly:
         journeyStart: journeyData.startLocation.coordinates
      */
      const payload = {
        journeyStart: journeyData.startLocation,
        journeyEnd: journeyData.endLocation,
        vehicleType: journeyData.vehicleType,
      };

      const response = await deliveryAPI.checkOrders(payload);
      setAvailableOrders(Array.isArray(response.data) ? response.data : []);
      setShowCheckOrders(true);
    } catch (error) {
      console.error('Error checking orders:', error);
      alert(
        error?.response?.data?.message ||
          'Failed to check orders. Please try again or check your connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (delivery) => {
    if (!delivery || !delivery._id) return;
    try {
      const response = await deliveryAPI.acceptDelivery(delivery._id);
      alert(`Order accepted! OTP: ${response.data?.otp ?? 'N/A'}`);
      // remove order from available list
      setAvailableOrders((prev) => prev.filter((d) => d._id !== delivery._id));
      // refresh my jobs
      fetchMyJobs();
    } catch (error) {
      console.error('Error accepting order:', error);
      alert(
        error?.response?.data?.message ||
          'Failed to accept order. Please try again.'
      );
    }
  };

  const handleStartDelivery = async (delivery) => {
    if (!delivery || !delivery._id) return;
    try {
      await deliveryAPI.startDelivery(delivery._id);
      alert('Delivery started!');
      fetchMyJobs();
    } catch (error) {
      console.error('Error starting delivery:', error);
      alert('Failed to start delivery. Please try again.');
    }
  };

  const handleCompleteDelivery = async (delivery) => {
    if (!delivery || !delivery._id) return;
    const otp = (otpInput && otpInput[delivery._id]) || '';
    if (!otp) {
      alert('Please enter OTP');
      return;
    }

    try {
      await deliveryAPI.completeDelivery(delivery._id, otp);
      alert('Delivery completed successfully! Payment marked as complete.');
      setOtpInput((prev) => ({ ...prev, [delivery._id]: '' }));
      fetchMyJobs();
    } catch (error) {
      console.error('Error completing delivery:', error);
      alert(error?.response?.data?.message || 'Invalid OTP or server error.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Traveler Dashboard</h1>
          <p className="text-gray-600">UPI ID: {user?.upiId ?? 'Not provided'}</p>
        </div>

        {/* Journey Setup */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Set Your Journey</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <LocationInput
              label="Journey Start Location"
              placeholder="Where are you starting from?"
              onLocationSelect={(location) =>
                setJourneyData((prev) => ({ ...prev, startLocation: location }))
              }
            />

            <LocationInput
              label="Journey End Location"
              placeholder="Where are you going?"
              onLocationSelect={(location) =>
                setJourneyData((prev) => ({ ...prev, endLocation: location }))
              }
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Type
            </label>
            <select
              value={journeyData.vehicleType}
              onChange={(e) =>
                setJourneyData((prev) => ({ ...prev, vehicleType: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="geared motorbike">🏍️ Geared Motorbike (Small packages)</option>
              <option value="scooter">🛵 Scooter (Medium packages)</option>
              <option value="car">🚗 Car (Large packages)</option>
            </select>
          </div>

          <button
            onClick={handleCheckOrders}
            disabled={loading}
            className="w-full bg-secondary text-white py-3 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Checking...' : '🔍 Check for Available Orders'}
          </button>
        </div>

        {/* Available Orders */}
        {showCheckOrders && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Available Orders ({availableOrders.length})
            </h2>

            {availableOrders.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No orders found on your route. Try a different route or check back later.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableOrders.map((order) => (
                  <DeliveryCard
                    key={order._id}
                    delivery={order}
                    onAction={handleAcceptOrder}
                    actionLabel="Accept Order"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Active Jobs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            My Deliveries ({myJobs.length})
          </h2>

          {myJobs.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No active deliveries. Check for orders to get started!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myJobs.map((job) => (
                <div key={job._id}>
                  <DeliveryCard
                    delivery={job}
                    showOTP={job.status === 'accepted' || job.status === 'in-transit'}
                  />

                  {job.status === 'accepted' && (
                    <button
                      onClick={() => handleStartDelivery(job)}
                      className="w-full mt-3 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                    >
                      Start Delivery
                    </button>
                  )}

                  {job.status === 'in-transit' && (
                    <div className="mt-3">
                      <input
                        type="text"
                        placeholder="Enter OTP from receiver"
                        value={otpInput[job._id] || ''}
                        onChange={(e) =>
                          setOtpInput((prev) => ({ ...prev, [job._id]: e.target.value }))
                        }
                        maxLength="6"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                      />
                      <button
                        onClick={() => handleCompleteDelivery(job)}
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                      >
                        Complete Delivery
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelerDashboard;
