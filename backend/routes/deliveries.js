const express = require('express');
const router = express.Router();
const {
  createDelivery,
  getMyDeliveries,
  checkAvailableOrders,
  acceptDelivery,
  startDelivery,
  completeDelivery,
  getMyJobs
} = require('../controllers/deliveryController');
const { protect, authorize } = require('../middleware/auth');

// Sender routes
router.post('/', protect, authorize('sender'), createDelivery);
router.get('/my-deliveries', protect, authorize('sender'), getMyDeliveries);

// Traveler routes
router.post('/check-orders', protect, authorize('traveler'), checkAvailableOrders);
router.put('/:id/accept', protect, authorize('traveler'), acceptDelivery);
router.put('/:id/start', protect, authorize('traveler'), startDelivery);
router.put('/:id/complete', protect, authorize('traveler'), completeDelivery);
router.get('/my-jobs', protect, authorize('traveler'), getMyJobs);

module.exports = router;