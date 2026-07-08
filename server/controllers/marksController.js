// ===================================================
// Marks Controller - CRUD operations for student marks
// ===================================================
const MarksModel = require('../models/marksModel');

const validateMarks = (data) => {
    const errors = [];
    const { student_id, exam_type, marks_obtained, max_marks } = data;

    if (!student_id) errors.push('Student is required');
    if (!exam_type || !exam_type.trim()) errors.push('Exam type is required');
    if (marks_obtained === undefined || marks_obtained === '' || isNaN(marks_obtained)) errors.push('Marks obtained must be a number');
    if (max_marks === undefined || max_marks === '' || isNaN(max_marks)) errors.push('Max marks must be a number');
    if (Number(marks_obtained) > Number(max_marks)) errors.push('Marks obtained cannot exceed max marks');
    if (Number(marks_obtained) < 0) errors.push('Marks obtained cannot be negative');

    return errors;
};

// @route   GET /api/marks?search=
const getMarks = async (req, res, next) => {
    try {
        const { search = '' } = req.query;
        const marks = await MarksModel.getAll(search);
        res.status(200).json({ success: true, data: marks });
    } catch (error) {
        next(error);
    }
};

// @route   GET /api/marks/student/:studentId
const getMarksByStudent = async (req, res, next) => {
    try {
        const marks = await MarksModel.getByStudent(req.params.studentId);
        res.status(200).json({ success: true, data: marks });
    } catch (error) {
        next(error);
    }
};

// @route   POST /api/marks
const createMarks = async (req, res, next) => {
    try {
        const errors = validateMarks(req.body);
        if (errors.length > 0) return res.status(400).json({ success: false, message: errors.join(', ') });

        const id = await MarksModel.create(req.body);
        res.status(201).json({ success: true, message: 'Marks added successfully', id });
    } catch (error) {
        next(error);
    }
};

// @route   PUT /api/marks/:id
const updateMarks = async (req, res, next) => {
    try {
        const errors = validateMarks(req.body);
        if (errors.length > 0) return res.status(400).json({ success: false, message: errors.join(', ') });

        const record = await MarksModel.getById(req.params.id);
        if (!record) return res.status(404).json({ success: false, message: 'Marks record not found' });

        await MarksModel.update(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Marks updated successfully' });
    } catch (error) {
        next(error);
    }
};

// @route   DELETE /api/marks/:id
const deleteMarks = async (req, res, next) => {
    try {
        const record = await MarksModel.getById(req.params.id);
        if (!record) return res.status(404).json({ success: false, message: 'Marks record not found' });

        await MarksModel.remove(req.params.id);
        res.status(200).json({ success: true, message: 'Marks deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getMarks, getMarksByStudent, createMarks, updateMarks, deleteMarks };
