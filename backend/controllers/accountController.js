const Account = require('../models/Account');

// @desc    Get all accounts
// @route   GET /api/accounts
// @access  Public
exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: accounts });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Add account
// @route   POST /api/accounts
// @access  Public
exports.addAccount = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const account = await Account.create(req.body);
    return res.status(201).json({ success: true, data: account });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete account
// @route   DELETE /api/accounts/:id
// @access  Public
exports.deleteAccount = async (req, res) => {
  try {
    const deletedAccount = await Account.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedAccount) {
      const exists = await Account.exists({ _id: req.params.id });
      if (!exists) return res.status(404).json({ success: false, error: 'No account found' });
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }
    return res.status(200).json({ success: true, data: {} });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};
