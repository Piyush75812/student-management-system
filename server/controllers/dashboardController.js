// ===================================================
// Dashboard Controller - Summary stats for dashboard cards
// ===================================================
const StudentModel = require('../models/studentModel');
const TeacherModel = require('../models/teacherModel');
const CourseModel = require('../models/courseModel');

// @route   GET /api/dashboard/summary
const getSummary = async (req, res, next) => {
    try {
        const totalStudents = await StudentModel.countAll();
        const totalTeachers = await TeacherModel.countAll();
        const totalCourses = await CourseModel.countAll();
        const recentStudents = await StudentModel.getRecent(5);

        res.status(200).json({
            success: true,
            data: {
                totalStudents,
                totalTeachers,
                totalCourses,
                recentStudents
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getSummary };
