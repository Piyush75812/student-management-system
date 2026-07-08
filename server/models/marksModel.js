// ===================================================
// Marks Model - Handles queries related to 'marks' table
// ===================================================
const db = require('../config/db');

const MarksModel = {
    // Get all marks, optionally filtered by student search term
    getAll: async (search = '') => {
        const searchTerm = `%${search}%`;
        const [rows] = await db.query(
            `SELECT m.*, s.student_id AS student_code, s.full_name, c.course_name
             FROM marks m
             JOIN students s ON m.student_id = s.id
             LEFT JOIN courses c ON m.course_id = c.id
             WHERE s.full_name LIKE ? OR s.student_id LIKE ?
             ORDER BY m.id DESC`,
            [searchTerm, searchTerm]
        );
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM marks WHERE id = ?', [id]);
        return rows[0];
    },

    // Get all marks for one student (used for report card view)
    getByStudent: async (studentId) => {
        const [rows] = await db.query(
            `SELECT m.*, c.course_name FROM marks m
             LEFT JOIN courses c ON m.course_id = c.id
             WHERE m.student_id = ? ORDER BY m.id DESC`,
            [studentId]
        );
        return rows;
    },

    create: async (data) => {
        const { student_id, course_id, exam_type, marks_obtained, max_marks } = data;
        const [result] = await db.query(
            `INSERT INTO marks (student_id, course_id, exam_type, marks_obtained, max_marks)
             VALUES (?, ?, ?, ?, ?)`,
            [student_id, course_id, exam_type, marks_obtained, max_marks]
        );
        return result.insertId;
    },

    update: async (id, data) => {
        const { student_id, course_id, exam_type, marks_obtained, max_marks } = data;
        await db.query(
            `UPDATE marks SET student_id=?, course_id=?, exam_type=?, marks_obtained=?, max_marks=? WHERE id=?`,
            [student_id, course_id, exam_type, marks_obtained, max_marks, id]
        );
    },

    remove: async (id) => {
        await db.query('DELETE FROM marks WHERE id = ?', [id]);
    }
};

module.exports = MarksModel;
