const express = require('express');
const router = express.Router();
const {
    getTeachers,
    getTeacher,
    createTeacher,
    updateTeacher,
    deleteTeacher
} = require('../controllers/teacherController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getTeachers)
    .post(protect, createTeacher);

router.route('/:id')
    .get(protect, getTeacher)
    .put(protect, updateTeacher)
    .delete(protect, deleteTeacher);

module.exports = router;
