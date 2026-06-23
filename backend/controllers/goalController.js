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
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ success: false, error: 'No goal found' });
    if (goal.user.toString() !== req.user.id) return res.status(401).json({ success: false, error: 'Not authorized' });
    
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json({ success: true, data: updatedGoal });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ success: false, error: 'No goal found' });
    if (goal.user.toString() !== req.user.id) return res.status(401).json({ success: false, error: 'Not authorized' });
    
    await goal.deleteOne();
    return res.status(200).json({ success: true, data: {} });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};
