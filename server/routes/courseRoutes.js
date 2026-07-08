const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getCourses)
    .post(protect, createCourse);

router.route('/:id')
    .get(protect, getCourse)
    .put(protect, updateCourse)
    .delete(protect, deleteCourse);

module.exports = router;
