const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add an account name'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['Cash', 'Bank', 'Credit Card', 'E-Wallet'],
    required: [true, 'Please select an account type'],
  },
  balance: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Account', AccountSchema);
