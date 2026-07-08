// ===================================================
// Course Controller - CRUD operations for courses
// ===================================================
const CourseModel = require('../models/courseModel');

const validateCourse = (data) => {
    const errors = [];
    const { course_code, course_name, duration, semester } = data;

    if (!course_code || !course_code.trim()) errors.push('Course code is required');
    if (!course_name || !course_name.trim()) errors.push('Course name is required');
    if (!duration || !duration.trim()) errors.push('Duration is required');
    if (!semester) errors.push('Semester is required');

    return errors;
};

// @route   GET /api/courses
const getCourses = async (req, res, next) => {
    try {
        const courses = await CourseModel.getAll();
        res.status(200).json({ success: true, data: courses });
    } catch (error) {
        next(error);
    }
};

// @route   GET /api/courses/:id
const getCourse = async (req, res, next) => {
    try {
        const course = await CourseModel.getById(req.params.id);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
        res.status(200).json({ success: true, data: course });
    } catch (error) {
        next(error);
    }
};

// @route   POST /api/courses
const createCourse = async (req, res, next) => {
    try {
        const errors = validateCourse(req.body);
        if (errors.length > 0) return res.status(400).json({ success: false, message: errors.join(', ') });

        const existing = await CourseModel.findByCourseCode(req.body.course_code);
        if (existing) return res.status(400).json({ success: false, message: 'Course code already exists' });

        const id = await CourseModel.create(req.body);
        res.status(201).json({ success: true, message: 'Course added successfully', id });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Duplicate course code' });
        }
        next(error);
    }
};

// @route   PUT /api/courses/:id
const updateCourse = async (req, res, next) => {
    try {
        const errors = validateCourse(req.body);
        if (errors.length > 0) return res.status(400).json({ success: false, message: errors.join(', ') });

        const course = await CourseModel.getById(req.params.id);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

        if (req.body.course_code !== course.course_code) {
            const existing = await CourseModel.findByCourseCode(req.body.course_code);
            if (existing) return res.status(400).json({ success: false, message: 'Course code already exists' });
        }

        await CourseModel.update(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Course updated successfully' });
    } catch (error) {
        next(error);
    }
};

// @route   DELETE /api/courses/:id
const deleteCourse = async (req, res, next) => {
    try {
        const course = await CourseModel.getById(req.params.id);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

        await CourseModel.remove(req.params.id);
        res.status(200).json({ success: true, message: 'Course deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getCourses, getCourse, createCourse, updateCourse, deleteCourse };
