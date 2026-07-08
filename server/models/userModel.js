// ===================================================
// User Model - Handles queries related to 'users' table
// ===================================================
const db = require('../config/db');

const UserModel = {
    // Find a user by email (used during login)
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    // Create a new admin user (used for initial setup/seeding)
    create: async (name, email, hashedPassword, role = 'admin') => {
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );
        return result.insertId;
    }
};

module.exports = UserModel;
