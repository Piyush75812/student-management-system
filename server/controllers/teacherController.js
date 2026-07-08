// ===================================================
// Teacher Controller - CRUD operations for teachers
// ===================================================
const TeacherModel = require('../models/teacherModel');

const validateTeacher = (data) => {
    const errors = [];
    const { teacher_id, name, department, email, phone } = data;

    if (!teacher_id || !teacher_id.trim()) errors.push('Teacher ID is required');
    if (!name || !name.trim()) errors.push('Name is required');
    if (!department || !department.trim()) errors.push('Department is required');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('A valid email is required');
    if (!phone || !/^\d{10}$/.test(phone)) errors.push('Phone number must be exactly 10 digits');

    return errors;
};

// @route   GET /api/teachers
const getTeachers = async (req, res, next) => {
    try {
        const teachers = await TeacherModel.getAll();
        res.status(200).json({ success: true, data: teachers });
    } catch (error) {
        next(error);
    }
};

// @route   GET /api/teachers/:id
const getTeacher = async (req, res, next) => {
    try {
        const teacher = await TeacherModel.getById(req.params.id);
        if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });
        res.status(200).json({ success: true, data: teacher });
    } catch (error) {
        next(error);
    }
};

// @route   POST /api/teachers
const createTeacher = async (req, res, next) => {
    try {
        const errors = validateTeacher(req.body);
        if (errors.length > 0) return res.status(400).json({ success: false, message: errors.join(', ') });

        const existing = await TeacherModel.findByTeacherId(req.body.teacher_id);
        if (existing) return res.status(400).json({ success: false, message: 'Teacher ID already exists' });

        const id = await TeacherModel.create(req.body);
        res.status(201).json({ success: true, message: 'Teacher added successfully', id });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Duplicate entry: email or teacher ID already exists' });
        }
        next(error);
    }
};

// @route   PUT /api/teachers/:id
const updateTeacher = async (req, res, next) => {
    try {
        const errors = validateTeacher(req.body);
        if (errors.length > 0) return res.status(400).json({ success: false, message: errors.join(', ') });

        const teacher = await TeacherModel.getById(req.params.id);
        if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });

        if (req.body.teacher_id !== teacher.teacher_id) {
            const existing = await TeacherModel.findByTeacherId(req.body.teacher_id);
            if (existing) return res.status(400).json({ success: false, message: 'Teacher ID already exists' });
        }

        await TeacherModel.update(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Teacher updated successfully' });
    } catch (error) {
        next(error);
    }
};

// @route   DELETE /api/teachers/:id
const deleteTeacher = async (req, res, next) => {
    try {
        const teacher = await TeacherModel.getById(req.params.id);
        if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });

        await TeacherModel.remove(req.params.id);
        res.status(200).json({ success: true, message: 'Teacher deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getTeachers, getTeacher, createTeacher, updateTeacher, deleteTeacher };
