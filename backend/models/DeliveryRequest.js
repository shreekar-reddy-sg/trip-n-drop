const mongoose = require('mongoose');

const deliveryRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  traveler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  pickupLocation: {
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  deliveryLocation: {
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  receiverContact: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  packageSize: {
    type: String,
    enum: ['S', 'M', 'L'],
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['geared motorbike', 'scooter', 'car']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in-transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  otp: {
    type: String,
    default: null
  },
  payment: {
    amount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  deliveredAt: {
    type: Date,
    default: null
  }
});

// Set vehicle type based on package size
deliveryRequestSchema.pre('save', function(next) {
  if (this.isNew) {
    const sizeToVehicle = {
      'S': 'geared motorbike',
      'M': 'scooter',
      'L': 'car'
    };
    this.vehicleType = sizeToVehicle[this.packageSize];
    
    // Set payment amount based on package size
    const sizeToAmount = {
      'S': 50,
      'M': 100,
      'L': 200
    };
    this.payment.amount = sizeToAmount[this.packageSize];
  }
  next();
});

module.exports = mongoose.model('DeliveryRequest', deliveryRequestSchema);