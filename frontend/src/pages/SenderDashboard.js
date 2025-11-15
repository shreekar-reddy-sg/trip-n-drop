import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deliveryAPI } from '../services/api';
import DeliveryCard from '../components/DeliveryCard';

const SenderDashboard = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await deliveryAPI.getMyDeliveries();
      setDeliveries(response.data);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['pending', 'accepted', 'in-transit'].includes(delivery.status);
    if (filter === 'completed') return delivery.status === 'delivered';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">My Deliveries</h1>
            <button
              onClick={() => navigate('/sender/create-delivery')}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Create New Delivery
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'all' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              All ({deliveries.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'active' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Active ({deliveries.filter(d => ['pending', 'accepted', 'in-transit'].includes(d.status)).length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'completed' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Completed ({deliveries.filter(d => d.status === 'delivered').length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading deliveries...</p>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 mb-4">No deliveries found</p>
            <button
              onClick={() => navigate('/sender/create-delivery')}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Create Your First Delivery
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeliveries.map((delivery) => (
              <DeliveryCard key={delivery._id} delivery={delivery} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SenderDashboard;