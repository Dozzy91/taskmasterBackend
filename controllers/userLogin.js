const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/index'); // PostgreSQL connection

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // email and password validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if the user exists
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        

        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the hashed password
        const isValidPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user.rows[0].id, email: user.rows[0].email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        const user_id = user.rows[0].id;

        res.status(200).json({ message: 'Login successful', token, user_id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { loginUser };
