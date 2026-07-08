// ===================================================
// Attendance Model - Handles queries related to 'attendance' table
// ===================================================
const db = require('../config/db');

const AttendanceModel = {
    // Get attendance records for a specific date (joined with student info)
    getByDate: async (date) => {
        const [rows] = await db.query(
            `SELECT a.id, a.student_id, a.attendance_date, a.status,
                    s.student_id AS student_code, s.full_name, c.course_name
             FROM attendance a
             JOIN students s ON a.student_id = s.id
             LEFT JOIN courses c ON s.course_id = c.id
             WHERE a.attendance_date = ?
             ORDER BY s.full_name ASC`,
            [date]
        );
        return rows;
    },

    // Get attendance history for one student
    getByStudent: async (studentId) => {
        const [rows] = await db.query(
            `SELECT * FROM attendance WHERE student_id = ? ORDER BY attendance_date DESC`,
            [studentId]
        );
        return rows;
    },

    // Insert or update attendance for a student on a given date (upsert)
    markOne: async (studentId, date, status) => {
        await db.query(
            `INSERT INTO attendance (student_id, attendance_date, status)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE status = VALUES(status)`,
            [studentId, date, status]
        );
    },

    // Bulk mark attendance for multiple students on the same date
    markBulk: async (date, records) => {
        // records = [{ student_id, status }, ...]
        const queries = records.map(r =>
            db.query(
                `INSERT INTO attendance (student_id, attendance_date, status)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE status = VALUES(status)`,
                [r.student_id, date, r.status]
            )
        );
        await Promise.all(queries);
    },

    remove: async (id) => {
        await db.query('DELETE FROM attendance WHERE id = ?', [id]);
    }
};

module.exports = AttendanceModel;
