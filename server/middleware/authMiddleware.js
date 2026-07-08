// ===================================================
// Auth Middleware - Verifies JWT token on protected routes
// ===================================================
const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // attach decoded user info to request
            next();
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
        }
    } else {
        return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };
