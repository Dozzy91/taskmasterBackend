const pool = require('../db/index');

const logoutUser = async (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from header

    if (!token) {
        return res.status(400).json({ message: 'Token not provided' });
    }

    try {
        // Add the token to the blacklist
        await pool.query('INSERT INTO token_blacklist (token) VALUES ($1)', [token]);
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { logoutUser };
