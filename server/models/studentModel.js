// ===================================================
// Student Model - Handles queries related to 'students' table
// ===================================================
const db = require('../config/db');

const StudentModel = {
    // Get all students with pagination + optional search, joined with course name
    getAll: async ({ search = '', page = 1, limit = 10 }) => {
        const offset = (page - 1) * limit;
        const searchTerm = `%${search}%`;

        const [rows] = await db.query(
            `SELECT s.*, c.course_name 
             FROM students s
             LEFT JOIN courses c ON s.course_id = c.id
             WHERE s.full_name LIKE ? OR s.student_id LIKE ? OR c.course_name LIKE ?
             ORDER BY s.id DESC
             LIMIT ? OFFSET ?`,
            [searchTerm, searchTerm, searchTerm, Number(limit), Number(offset)]
        );

        const [countRows] = await db.query(
            `SELECT COUNT(*) as total 
             FROM students s
             LEFT JOIN courses c ON s.course_id = c.id
             WHERE s.full_name LIKE ? OR s.student_id LIKE ? OR c.course_name LIKE ?`,
            [searchTerm, searchTerm, searchTerm]
        );

        return { students: rows, total: countRows[0].total };
    },

    getById: async (id) => {
        const [rows] = await db.query(
            `SELECT s.*, c.course_name FROM students s LEFT JOIN courses c ON s.course_id = c.id WHERE s.id = ?`,
            [id]
        );
        return rows[0];
    },

    findByStudentId: async (studentId) => {
        const [rows] = await db.query('SELECT * FROM students WHERE student_id = ?', [studentId]);
        return rows[0];
    },

    create: async (data) => {
        const { student_id, full_name, email, phone, gender, dob, course_id, semester, address } = data;
        const [result] = await db.query(
            `INSERT INTO students (student_id, full_name, email, phone, gender, dob, course_id, semester, address)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [student_id, full_name, email, phone, gender, dob, course_id, semester, address]
        );
        return result.insertId;
    },

    update: async (id, data) => {
        const { student_id, full_name, email, phone, gender, dob, course_id, semester, address } = data;
        await db.query(
            `UPDATE students SET student_id=?, full_name=?, email=?, phone=?, gender=?, dob=?, course_id=?, semester=?, address=? WHERE id=?`,
            [student_id, full_name, email, phone, gender, dob, course_id, semester, address, id]
        );
    },

    remove: async (id) => {
        await db.query('DELETE FROM students WHERE id = ?', [id]);
    },

    countAll: async () => {
        const [rows] = await db.query('SELECT COUNT(*) as total FROM students');
        return rows[0].total;
    },

    getRecent: async (limit = 5) => {
        const [rows] = await db.query(
            `SELECT s.*, c.course_name FROM students s LEFT JOIN courses c ON s.course_id = c.id ORDER BY s.created_at DESC LIMIT ?`,
            [Number(limit)]
        );
        return rows;
    }
};

module.exports = StudentModel;
