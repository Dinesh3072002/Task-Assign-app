const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        const [rows] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (rows.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role || "Employee"]
        );

        res.status(201).json({ message: "User created successfully" });

    } catch (err) {
        console.error("SIGNUP ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};