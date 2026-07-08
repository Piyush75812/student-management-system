// ===================================================
// Teacher Model - Handles queries related to 'teachers' table
// ===================================================
const db = require('../config/db');

const TeacherModel = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM teachers ORDER BY id DESC');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM teachers WHERE id = ?', [id]);
        return rows[0];
    },

    findByTeacherId: async (teacherId) => {
        const [rows] = await db.query('SELECT * FROM teachers WHERE teacher_id = ?', [teacherId]);
        return rows[0];
    },

    create: async (data) => {
        const { teacher_id, name, department, email, phone } = data;
        const [result] = await db.query(
            'INSERT INTO teachers (teacher_id, name, department, email, phone) VALUES (?, ?, ?, ?, ?)',
            [teacher_id, name, department, email, phone]
        );
        return result.insertId;
    },

    update: async (id, data) => {
        const { teacher_id, name, department, email, phone } = data;
        await db.query(
            'UPDATE teachers SET teacher_id=?, name=?, department=?, email=?, phone=? WHERE id=?',
            [teacher_id, name, department, email, phone, id]
        );
    },

    remove: async (id) => {
        await db.query('DELETE FROM teachers WHERE id = ?', [id]);
    },

    countAll: async () => {
        const [rows] = await db.query('SELECT COUNT(*) as total FROM teachers');
        return rows[0].total;
    }
};

module.exports = TeacherModel;
