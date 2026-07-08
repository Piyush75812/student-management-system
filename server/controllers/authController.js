// ===================================================
// Auth Controller - Login logic for Admin
// ===================================================
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
require('dotenv').config();

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
};

// @route   POST /api/auth/login
// @desc    Authenticate admin and return JWT token
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        next(error);
    }
};

// @route   GET /api/auth/me
// @desc    Get currently logged-in admin's profile
const getProfile = async (req, res, next) => {
    try {
        res.status(200).json({ success: true, user: req.user });
    } catch (error) {
        next(error);
    }
};

module.exports = { login, getProfile };
