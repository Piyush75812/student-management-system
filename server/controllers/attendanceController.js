// ===================================================
// Attendance Controller - Mark & view attendance
// ===================================================
const AttendanceModel = require('../models/attendanceModel');
const StudentModel = require('../models/studentModel');

// @route   GET /api/attendance?date=YYYY-MM-DD
// @desc    Get attendance for all students on a given date (defaults to today)
const getAttendanceByDate = async (req, res, next) => {
    try {
        const date = req.query.date || new Date().toISOString().split('T')[0];

        // Get all students so admin can mark attendance even for students with no record yet
        const { students } = await StudentModel.getAll({ search: '', page: 1, limit: 1000 });
        const existingRecords = await AttendanceModel.getByDate(date);

        // Merge: attach existing status to each student, default to null if not marked yet
        const merged = students.map(s => {
            const record = existingRecords.find(r => r.student_id === s.id);
            return {
                student_db_id: s.id,
                student_id: s.student_id,
                full_name: s.full_name,
                course_name: s.course_name,
                status: record ? record.status : null
            };
        });

        res.status(200).json({ success: true, date, data: merged });
    } catch (error) {
        next(error);
    }
};

// @route   GET /api/attendance/student/:studentId
// @desc    Get attendance history for one student
const getAttendanceByStudent = async (req, res, next) => {
    try {
        const records = await AttendanceModel.getByStudent(req.params.studentId);
        res.status(200).json({ success: true, data: records });
    } catch (error) {
        next(error);
    }
};

// @route   POST /api/attendance
// @desc    Bulk mark attendance for a given date
// body: { date: 'YYYY-MM-DD', records: [{ student_id, status }] }
const markAttendance = async (req, res, next) => {
    try {
        const { date, records } = req.body;

        if (!date || !Array.isArray(records) || records.length === 0) {
            return res.status(400).json({ success: false, message: 'Date and attendance records are required' });
        }

        const validStatuses = ['Present', 'Absent', 'Leave'];
        for (const r of records) {
            if (!r.student_id || !validStatuses.includes(r.status)) {
                return res.status(400).json({ success: false, message: 'Invalid attendance record found' });
            }
        }

        await AttendanceModel.markBulk(date, records);
        res.status(200).json({ success: true, message: 'Attendance saved successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAttendanceByDate, getAttendanceByStudent, markAttendance };
