const jwt = require('jsonwebtoken');
const pool = require('../db/index');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // checking blacklisted tokens
        const result = await pool.query('SELECT * FROM token_blacklist WHERE token = $1', [token]);
        if (result.rows.length > 0) {
            return res.status(403).json({ message: 'Token is blacklisted' });
        }

        // verifying tokens
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add user info to the request object
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = { authMiddleware };