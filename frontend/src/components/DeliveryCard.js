import React from 'react';

const DeliveryCard = ({ delivery, onAction, actionLabel, showOTP }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      'in-transit': 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getVehicleIcon = (vehicleType) => {
    const icons = {
      'geared motorbike': '🏍️',
      'scooter': '🛵',
      'car': '🚗',
    };
    return icons[vehicleType] || '🚗';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Package Size: {delivery.packageSize}
          </h3>
          <p className="text-sm text-gray-600">
            {getVehicleIcon(delivery.vehicleType)} {delivery.vehicleType}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
          {delivery.status.toUpperCase()}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-sm font-medium text-gray-700">Pickup:</p>
          <p className="text-sm text-gray-600">{delivery.pickupLocation.address}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-700">Delivery:</p>
          <p className="text-sm text-gray-600">{delivery.deliveryLocation.address}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-700">Receiver Contact:</p>
          <p className="text-sm text-gray-600">{delivery.receiverContact}</p>
        </div>

        {delivery.sender && (
          <div>
            <p className="text-sm font-medium text-gray-700">Sender:</p>
            <p className="text-sm text-gray-600">{delivery.sender.name} - {delivery.sender.mobile}</p>
          </div>
        )}

        {delivery.traveler && (
          <div>
            <p className="text-sm font-medium text-gray-700">Traveler:</p>
            <p className="text-sm text-gray-600">{delivery.traveler.name} - {delivery.traveler.mobile}</p>
          </div>
        )}

        <div className="pt-2 border-t">
          <p className="text-sm font-medium text-gray-700">Payment Amount:</p>
          <p className="text-lg font-bold text-green-600">₹{delivery.payment.amount}</p>
          <p className="text-xs text-gray-500">Status: {delivery.payment.status}</p>
        </div>
      </div>

      {showOTP && delivery.otp && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
          <p className="text-sm font-medium text-yellow-800">Delivery OTP:</p>
          <p className="text-2xl font-bold text-yellow-900">{delivery.otp}</p>
          <p className="text-xs text-yellow-600 mt-1">Share this OTP with the receiver</p>
        </div>
      )}

      {onAction && actionLabel && (
        <button
          onClick={() => onAction(delivery)}
          className="w-full bg-primary text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default DeliveryCard;