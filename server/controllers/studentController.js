// ===================================================
// Student Controller - CRUD operations for students
// ===================================================
const StudentModel = require('../models/studentModel');

// Simple validation helper
const validateStudent = (data) => {
    const errors = [];
    const { student_id, full_name, email, phone, gender, dob, semester } = data;

    if (!student_id || !student_id.trim()) errors.push('Student ID is required');
    if (!full_name || !full_name.trim()) errors.push('Full name is required');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('A valid email is required');
    if (!phone || !/^\d{10}$/.test(phone)) errors.push('Phone number must be exactly 10 digits');
    if (!gender) errors.push('Gender is required');
    if (!dob) errors.push('Date of birth is required');
    if (!semester) errors.push('Semester is required');

    return errors;
};

// @route   GET /api/students?search=&page=&limit=
const getStudents = async (req, res, next) => {
    try {
        const { search = '', page = 1, limit = 10 } = req.query;
        const { students, total } = await StudentModel.getAll({ search, page, limit });

        res.status(200).json({
            success: true,
            data: students,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// @route   GET /api/students/:id
const getStudent = async (req, res, next) => {
    try {
        const student = await StudentModel.getById(req.params.id);
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
        res.status(200).json({ success: true, data: student });
    } catch (error) {
        next(error);
    }
};

// @route   POST /api/students
const createStudent = async (req, res, next) => {
    try {
        const errors = validateStudent(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: errors.join(', ') });
        }

        // Prevent duplicate Student ID
        const existing = await StudentModel.findByStudentId(req.body.student_id);
        if (existing) {
            return res.status(400).json({ success: false, message: 'Student ID already exists' });
        }

        const id = await StudentModel.create(req.body);
        res.status(201).json({ success: true, message: 'Student added successfully', id });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Duplicate entry: email or student ID already exists' });
        }
        next(error);
    }
};

// @route   PUT /api/students/:id
const updateStudent = async (req, res, next) => {
    try {
        const errors = validateStudent(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: errors.join(', ') });
        }

        const student = await StudentModel.getById(req.params.id);
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        // If student_id changed, ensure new one is not duplicate
        if (req.body.student_id !== student.student_id) {
            const existing = await StudentModel.findByStudentId(req.body.student_id);
            if (existing) {
                return res.status(400).json({ success: false, message: 'Student ID already exists' });
            }
        }

        await StudentModel.update(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Student updated successfully' });
    } catch (error) {
        next(error);
    }
};

// @route   DELETE /api/students/:id
const deleteStudent = async (req, res, next) => {
    try {
        const student = await StudentModel.getById(req.params.id);
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        await StudentModel.remove(req.params.id);
        res.status(200).json({ success: true, message: 'Student deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getStudents, getStudent, createStudent, updateStudent, deleteStudent };
