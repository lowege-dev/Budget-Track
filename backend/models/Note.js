const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title']
  },
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
NoteSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Note', NoteSchema);
