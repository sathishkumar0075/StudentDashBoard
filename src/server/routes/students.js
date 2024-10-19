import express from 'express';
import Student from '../models/Student.js';
import User from '../models/User.js'; // Adjust based on your actual model path
const router = express.Router();

// Endpoint to get student data by email
router.get('/email/:email', async (req, res) => {
    try {
        const studentEmail = req.params.email;
        // Ensure we are querying the email field in the Student collection
        console.log("Email : ",studentEmail);
        const student = await User.findOne({ email: studentEmail });

        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});




// Endpoint to get student data by ID
router.get('/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

export default router;
