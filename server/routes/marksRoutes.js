const express = require('express');
const router = express.Router();
const {
    getMarks,
    getMarksByStudent,
    createMarks,
    updateMarks,
    deleteMarks
} = require('../controllers/marksController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getMarks)
    .post(protect, createMarks);

router.get('/student/:studentId', protect, getMarksByStudent);

router.route('/:id')
    .put(protect, updateMarks)
    .delete(protect, deleteMarks);

module.exports = router;
