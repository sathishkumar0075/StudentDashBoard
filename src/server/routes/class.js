import express from 'express';
import Student from '../models/Student.js';
import User from '../models/User.js';
const router = express.Router();

// Endpoint to get class data (students' CGPAs)
router.get('/:department/:branch/:year', async (req, res) => {
    try {
        const { department, branch,year } = req.params;
        const classmates = await User.find({ department, branch,year }).select('rollNo name cgpa');

        res.json(classmates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

export default router;
