import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rollNo: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    grades: [
        {
            semester: Number,
            subject: String,
            grade: String
        }
    ],
    cgpa: {
        type: Number
    },
    gpa: [
        {
            semester: Number,
            value: Number
        }
    ]
});

// Export the Student model
const Student = mongoose.model('Student', StudentSchema);
export default Student;  // Ensure you're using the default export
