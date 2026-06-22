const express = require('express');
const router = express.Router();
const { getAccounts, addAccount, deleteAccount } = require('../controllers/accountController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getAccounts).post(protect, addAccount);
router.route('/:id').delete(protect, deleteAccount);

module.exports = router;
