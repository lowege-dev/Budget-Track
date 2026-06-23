const express = require('express');
const router = express.Router();
const { getNotes, addNote, deleteNote, updateNote } = require('../controllers/noteController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getNotes).post(protect, addNote);
router.route('/:id').delete(protect, deleteNote).put(protect, updateNote);

module.exports = router;
