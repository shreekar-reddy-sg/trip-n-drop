const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { name, mobile, password, role, upiId } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ mobile });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this mobile number' });
    }

    // Validate UPI ID for travelers
    if (role === 'traveler' && !upiId) {
      return res.status(400).json({ message: 'UPI ID is required for travelers' });
    }

    // Create user
    const user = await User.create({
      name,
      mobile,
      password,
      role,
      upiId: role === 'traveler' ? upiId : undefined
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        upiId: user.upiId,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    // Check for user
    const user = await User.findOne({ mobile });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        upiId: user.upiId,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid mobile number or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signup, login, getMe };