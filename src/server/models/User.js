import mongoose from 'mongoose';

// Define the schema for subjects
const SubjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    marks: { type: Number, required: true, min: 0, max: 100 } // Assuming marks are between 0 and 100
});

// Define the schema for semesters
const SemesterSchema = new mongoose.Schema({
    semester: { type: Number, required: true },
    subjects: [SubjectSchema]  // Array of subjects for each semester
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollNo: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    year: { // New field added
        type: String,
        required: true,
    },
    semesters: [SemesterSchema], // Array of semesters
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {  // Ensure username is added here
        type: String,
        required: true,
        unique: true  // Add unique constraint if necessary
    }
});

// Create the User model
const User = mongoose.model('User', UserSchema);
export default User;
