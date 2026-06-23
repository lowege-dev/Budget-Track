const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login, getMe, googleLogin, updateSheet } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 authentication requests per window
  message: { success: false, error: 'Too many authentication attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.put('/sheet', protect, updateSheet);

module.exports = router;
