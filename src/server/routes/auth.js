import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    const { name, rollNo, department, branch, email, password, year, semesters,username } = req.body; // Added year

    try {
        // Validate that all required fields are provided
        if (!name || !rollNo || !department || !branch || !email || !password || !year||!username) {
            return res.status(400).json({ msg: 'All fields are required' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new User({
            name,
            rollNo,
            department,
            branch,
            email,
            password: hashedPassword,
            year,
            username, // Include year in the request
            semesters
        });

        // Save the new user to the database
        await newUser.save();
        
        // Create and sign the JWT token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ msg: 'User registered successfully', token });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Login route remains unchanged
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Test route
router.get('/', (req, res) => {
    return res.json({ message: "API is running" });
});

export default router;
