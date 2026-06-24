const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    trim: true,
    required: [true, 'Please add some text']
  },
  amount: {
    type: Number,
    required: [true, 'Please add a positive or negative number']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  tags: {
    type: [String],
    default: []
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    default: 'expense'
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

TransactionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Transaction', TransactionSchema);
