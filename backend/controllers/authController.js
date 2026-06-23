const User = require('../models/User');

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('967279769061-gd9j9e1hn55bs7e0ibkkjl55cc5rkfc5.apps.googleusercontent.com');

// @desc    Login/Register via Google
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '967279769061-gd9j9e1hn55bs7e0ibkkjl55cc5rkfc5.apps.googleusercontent.com',
    });
    
    const payload = ticket.getPayload();
    const { email, name } = payload;
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create user with a random password since they use Google
      user = await User.create({ 
        name, 
        email, 
        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
      });
    }
    
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(400).json({ success: false, error: 'Google login failed' });
  }
};
