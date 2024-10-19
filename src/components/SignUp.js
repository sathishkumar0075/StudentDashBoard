import React, { useState } from 'react';
import '../styles/Signup.css';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        rollNo: '',
        department: '',
        branch: '',
        email: '',
        password: '',
        username: '',
        year: '', // Added year to state
        semesters: [],
    });

    const { name, rollNo, department, branch, email, password, username, year, semesters } = formData;
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSemesterChange = (e) => {
        const selectedSemester = parseInt(e.target.value);
        
        // Check if semester already exists
        if (selectedSemester) {
            const semesterExists = semesters.some((sem) => sem.semester === selectedSemester);
            if (!semesterExists) {
                const newSemester = {
                    semester: selectedSemester,
                    subjects: [
                        { name: 'Subject 1', marks: '' },
                        { name: 'Subject 2', marks: '' },
                    ],
                };

                setFormData((prevState) => ({
                    ...prevState,
                    semesters: [...prevState.semesters, newSemester],
                }));
            }
        }
    };

    const handleSubjectChange = (semesterIndex, subjectIndex, field, value) => {
        setFormData((prevState) => {
            const updatedSemesters = prevState.semesters.map((semester, sIndex) => {
                if (sIndex === semesterIndex) {
                    const updatedSubjects = semester.subjects.map((subject, subIndex) => {
                        if (subIndex === subjectIndex) {
                            return { ...subject, [field]: value };
                        }
                        return subject;
                    });
                    return { ...semester, subjects: updatedSubjects };
                }
                return semester;
            });

            return { ...prevState, semesters: updatedSemesters };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input
        if (!name || !rollNo || !department || !branch || !email || !password || !username || !year) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    rollNo,
                    department,
                    branch,
                    email,
                    password,
                    username,
                    year,  // Include year in the request
                    semesters,
                }),
            });

            if (response.ok) {
                alert('Registration successful!');
                navigate(`/dashboard?email=${email}`);
            } else {
                const errorData = await response.json();
                alert(`Registration failed: ${errorData.msg}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Registration failed. Please try again later.');
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="rollNo"
                    placeholder="Roll Number"
                    value={rollNo}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={department}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="branch"
                    placeholder="Branch"
                    value={branch}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="year"  // Added year input
                    placeholder="Year"
                    value={year}
                    onChange={handleChange}
                    required
                />

                <div className="semester-dropdown">
                    <label htmlFor="semester">Select Semester:</label>
                    <select id="semester" onChange={handleSemesterChange}>
                        <option value="">--Select Semester--</option>
                        {[...Array(8).keys()].map((i) => (
                            <option key={i + 1} value={i + 1}>
                                Semester {i + 1}
                            </option>
                        ))}
                    </select>
                </div>

                {semesters.map((semester, semesterIndex) => (
                    <div key={semester.semester} className="semester-section">
                        <h3>Semester {semester.semester}</h3>
                        {semester.subjects.map((subject, subjectIndex) => (
                            <div key={subjectIndex} className="subject-section">
                                <input
                                    type="text"
                                    value={subject.name}
                                    onChange={(e) =>
                                        handleSubjectChange(semesterIndex, subjectIndex, 'name', e.target.value)
                                    }
                                />
                                <input
                                    type="number"
                                    placeholder={`Marks for ${subject.name}`}
                                    value={subject.marks}
                                    onChange={(e) =>
                                        handleSubjectChange(semesterIndex, subjectIndex, 'marks', e.target.value)
                                    }
                                />
                            </div>
                        ))}
                    </div>
                ))}

                <button type="submit">Sign Up</button>
            </form>
            <p>Already have an account? <a href="/login">Login</a></p>
        </div>
    );
};

export default SignUp;
