const express = require('express');
const router = express.Router();
const {
  createJourney,
  getMyJourneys,
  updateJourneyStatus
} = require('../controllers/journeyController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('traveler'), createJourney);
router.get('/my-journeys', protect, authorize('traveler'), getMyJourneys);
router.put('/:id', protect, authorize('traveler'), updateJourneyStatus);

module.exports = router;