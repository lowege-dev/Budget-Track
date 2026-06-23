const Transaction = require('../models/Transaction');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

// Helper to push to Google Sheets
const pushToGoogleSheet = async (transaction) => {
  try {
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) return;
    
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet('1DMQVxMCTh29CfRfVQC4-mPD-gUKB5th7gN5j2SCrnxE', serviceAccountAuth);
    await doc.loadInfo(); 
    const sheet = doc.sheetsByIndex[0]; 
    
    await sheet.addRow({
      Date: new Date(transaction.createdAt || Date.now()).toLocaleDateString(),
      Type: transaction.amount > 0 ? 'Income' : 'Expense',
      Category: transaction.category || 'N/A',
      Amount: Math.abs(transaction.amount),
      Notes: transaction.text || ''
    });
  } catch (err) {
    console.error("Failed to push to Google Sheets:", err);
  }
};

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Public
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}

// @desc    Add transaction
// @route   POST /api/transactions
// @access  Public
exports.addTransaction = async (req, res) => {
  try {
    const { text, amount, category } = req.body;
    req.body.user = req.user.id;

    const transaction = await Transaction.create(req.body);
    
    // Background task: push to Google Sheets (we don't await so it doesn't slow down the user)
    pushToGoogleSheet(transaction);

    return res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);

      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
}

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Public
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'No transaction found'
      });
    }

    // Make sure user owns transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this transaction'
      });
    }

    await transaction.deleteOne();

    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}
