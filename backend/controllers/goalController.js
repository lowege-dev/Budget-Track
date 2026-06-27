const Goal = require('../models/Goal');

exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: goals });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.addGoal = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const goal = await Goal.create(req.body);
    return res.status(201).json({ success: true, data: goal });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const updatedGoal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedGoal) {
      const exists = await Goal.exists({ _id: req.params.id });
      if (!exists) return res.status(404).json({ success: false, error: 'No goal found' });
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }
    return res.status(200).json({ success: true, data: updatedGoal });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const deletedGoal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedGoal) {
      const exists = await Goal.exists({ _id: req.params.id });
      if (!exists) return res.status(404).json({ success: false, error: 'No goal found' });
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }
    return res.status(200).json({ success: true, data: {} });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};
