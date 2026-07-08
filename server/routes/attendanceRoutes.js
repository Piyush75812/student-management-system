const express = require('express');
const router = express.Router();
const {
    getAttendanceByDate,
    getAttendanceByStudent,
    markAttendance
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAttendanceByDate);
router.post('/', protect, markAttendance);
router.get('/student/:studentId', protect, getAttendanceByStudent);

module.exports = router;
