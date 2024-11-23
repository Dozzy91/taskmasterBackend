// jwtwebtoken: This is for generating and verifying tokens for the user
// bycrpt: This is for hasnign and comapring hashed passwords

const bcrypt = require('bcrypt');
const pool = require('../db/index'); // PostgreSQL connection

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        const existingUser2 = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        )

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        } else if (existingUser2.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists'})
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser };