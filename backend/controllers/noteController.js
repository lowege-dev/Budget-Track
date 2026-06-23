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
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, error: 'No note found' });
    if (note.user.toString() !== req.user.id) return res.status(401).json({ success: false, error: 'Not authorized' });
    
    await note.deleteOne();
    return res.status(200).json({ success: true, data: {} });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, error: 'No note found' });
    if (note.user.toString() !== req.user.id) return res.status(401).json({ success: false, error: 'Not authorized' });
    
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json({ success: true, data: updatedNote });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};
