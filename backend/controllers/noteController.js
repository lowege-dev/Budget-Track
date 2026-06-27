const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: notes });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.addNote = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const note = await Note.create(req.body);
    return res.status(201).json({ success: true, data: note });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedNote) {
      const exists = await Note.exists({ _id: req.params.id });
      if (!exists) return res.status(404).json({ success: false, error: 'No note found' });
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }
    return res.status(200).json({ success: true, data: {} });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedNote) {
      const exists = await Note.exists({ _id: req.params.id });
      if (!exists) return res.status(404).json({ success: false, error: 'No note found' });
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }
    return res.status(200).json({ success: true, data: updatedNote });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};
