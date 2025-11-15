const Journey = require('../models/Journey');

// @desc    Create journey
// @route   POST /api/journeys
// @access  Private (Traveler only)
const createJourney = async (req, res) => {
  try {
    const { startLocation, endLocation, vehicleType } = req.body;

    const journey = await Journey.create({
      traveler: req.user._id,
      startLocation,
      endLocation,
      vehicleType
    });

    res.status(201).json(journey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get traveler's journeys
// @route   GET /api/journeys/my-journeys
// @access  Private (Traveler only)
const getMyJourneys = async (req, res) => {
  try {
    const journeys = await Journey.find({ traveler: req.user._id })
      .sort('-createdAt');
    res.json(journeys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update journey status
// @route   PUT /api/journeys/:id
// @access  Private (Traveler only)
const updateJourneyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const journey = await Journey.findById(req.params.id);

    if (!journey) {
      return res.status(404).json({ message: 'Journey not found' });
    }

    if (journey.traveler.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    journey.status = status;
    await journey.save();

    res.json(journey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJourney,
  getMyJourneys,
  updateJourneyStatus
};