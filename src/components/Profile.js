import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2'; // Import Line for CGPA line chart
import { Bar } from 'react-chartjs-2'; // Import Bar for GPA bar chart
import { Chart, registerables } from 'chart.js'; // Import Chart.js and registerables
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css'; // Ensure your CSS file path is correct

// Register Chart.js components
Chart.register(...registerables);

const Profile = () => {
    const location = useLocation();
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Function to get the query parameters from the URL
    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        return {
            email: params.get('email'), // Assuming the URL has the format ?email=userEmail
        };
    };

    useEffect(() => {
        const { email } = getQueryParams();
        if (!email) {
            setError('Email is missing from the URL.');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/students/email/${email}`);
                if (!response.ok) throw new Error('Failed to fetch student data.');
                const student = await response.json();
                setStudentData(student);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [location.search]);

    const calculateCGPA = () => {
        if (!studentData || !studentData.semesters) return 0;

        const totalCredits = studentData.semesters.reduce((sum, sem) => sum + sem.subjects.length, 0);
        const totalPoints = studentData.semesters.reduce((sum, sem) => {
            const semesterPoints = sem.subjects.reduce((semSum, subject) => semSum + (subject.marks || 0), 0);
            return sum + semesterPoints;
        }, 0);

        return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    };

    const renderCGPAChart = () => {
        if (!studentData || !studentData.semesters || studentData.semesters.length === 0) {
            return <p>No CGPA data available.</p>; // Return a message if there is no data
        }
    
        // Calculate CGPA for each semester
        const cgpaData = studentData.semesters.map((sem) => {
            if (!sem.subjects || sem.subjects.length === 0) return 0; // Default to 0 if no subjects
    
            const totalMarks = sem.subjects.reduce((sum, subject) => {
                return sum + (subject.marks || 0); // Default to 0 if marks are undefined
            }, 0);
            const totalSubjects = sem.subjects.length; // Get the total number of subjects
            return totalSubjects > 0 ? (totalMarks / totalSubjects).toFixed(2) : 0; // Calculate GPA for the semester
        });
    
        const chartData = {
            labels: studentData.semesters.map((sem) => `Semester ${sem.semester}`), // Labels for x-axis
            datasets: [{
                label: 'CGPA Over Semesters',
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                fill: false, // Line chart does not fill under the line
                data: cgpaData,
            }],
        };
    
        return (
            <div className="cgpa-chart">
                <h3>CGPA Over Semesters</h3>
                <Line
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true,
                            },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Semesters',
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'CGPA',
                                },
                                beginAtZero: true,
                                max: 10, // Adjust based on your grading scale
                            },
                        },
                    }}
                />
            </div>
        );
    };
    
    
    const renderGPAChart = () => {
        if (!studentData || !studentData.semesters) return null;

        const labels = studentData.semesters.map((sem) => `Semester ${sem.semester}`);
        const data = studentData.semesters.map((sem) => {
            const totalMarks = sem.subjects.reduce((sum, subject) => sum + (subject.marks || 0), 0);
            return totalMarks / (sem.subjects.length || 1); // GPA calculation
        });

        const chartData = {
            labels: labels,
            datasets: [{
                label: 'GPA per Semester',
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                data: data,
            }],
        };

        return (
            <div className="gpa-chart">
                <h3>GPA per Semester</h3>
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true,
                            },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Semesters',
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'GPA',
                                },
                                beginAtZero: true,
                                max: 10, // Adjust based on your grading scale
                            },
                        },
                    }}
                />
            </div>
        );
    };

    const renderGradeTable = () => (
        <div className="grade-table">
            <h3>Semester Wise Marks</h3>
            <table>
                <thead>
                    <tr>
                        <th>Semester</th>
                        <th>Subject</th>
                        <th>Marks</th>
                    </tr>
                </thead>
                <tbody>
                    {studentData && studentData.semesters.map((semester) =>
                        semester.subjects.map((subject) => (
                            <tr key={`${semester.semester}-${subject.name}`}>
                                <td>Semester {semester.semester}</td>
                                <td>{subject.name}</td>
                                <td>{subject.marks}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="profile-container">
            <h2>Student Profile</h2>
            <h3>CGPA: {calculateCGPA()}</h3>
            {renderCGPAChart()} 
            {renderGPAChart()} // Display GPA chart as bar chart
            {renderGradeTable()} // Display table with semester-wise marks
        </div>
    );
};

export default Profile;
