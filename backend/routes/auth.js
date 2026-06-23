const express = require('express');
const { register, login, getMe, googleLogin, updateSheet } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.put('/sheet', protect, updateSheet);

module.exports = router;
