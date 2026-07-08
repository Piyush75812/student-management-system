// ===================================================
// Database Configuration - MySQL Connection Pool
// ===================================================
const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool (better than single connection for handling multiple requests)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'student_management',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Use promise wrapper for async/await support
const db = pool.promise();

// Test the connection on startup
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error connecting to MySQL database:', err.message);
        return;
    }
    console.log('✅ Connected to MySQL database successfully');
    connection.release();
});

module.exports = db;
