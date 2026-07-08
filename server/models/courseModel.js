// ===================================================
// Course Model - Handles queries related to 'courses' table
// ===================================================
const db = require('../config/db');

const CourseModel = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM courses ORDER BY id DESC');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM courses WHERE id = ?', [id]);
        return rows[0];
    },

    findByCourseCode: async (courseCode) => {
        const [rows] = await db.query('SELECT * FROM courses WHERE course_code = ?', [courseCode]);
        return rows[0];
    },

    create: async (data) => {
        const { course_code, course_name, duration, semester } = data;
        const [result] = await db.query(
            'INSERT INTO courses (course_code, course_name, duration, semester) VALUES (?, ?, ?, ?)',
            [course_code, course_name, duration, semester]
        );
        return result.insertId;
    },

    update: async (id, data) => {
        const { course_code, course_name, duration, semester } = data;
        await db.query(
            'UPDATE courses SET course_code=?, course_name=?, duration=?, semester=? WHERE id=?',
            [course_code, course_name, duration, semester, id]
        );
    },

    remove: async (id) => {
        await db.query('DELETE FROM courses WHERE id = ?', [id]);
    },

    countAll: async () => {
        const [rows] = await db.query('SELECT COUNT(*) as total FROM courses');
        return rows[0].total;
    }
};

module.exports = CourseModel;
