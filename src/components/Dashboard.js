import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Bar, Line } from 'react-chartjs-2'; // Import both Bar and Line
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import '../styles/Dashboard.css';

// Register the required scales and components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const location = useLocation();
    const [studentData, setStudentData] = useState(null);
    const [classData, setClassData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    // Function to get the query parameters from the URL
    const getQueryParams = () => {
        const params = new URLSearchParams(location.search);
        return {
            email: params.get('email'), // Assuming the URL has the format ?email=studentEmail
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            const { email } = getQueryParams();

            if (!email) {
                setError('Email is missing from the URL.');
                setLoading(false);
                return;
            }
            setEmail(email);

            try {
                // Fetch student data by email
                const studentResponse = await fetch(`http://localhost:5000/api/students/email/${email}`);
                if (!studentResponse.ok) throw new Error('Failed to fetch student data.');
                const student = await studentResponse.json();
                setStudentData(student);

                // Fetch class data based on department and branch
                const { department, branch, year } = student; // Assuming these fields are present in the student data

                const classResponse = await fetch(`http://localhost:5000/api/class/${department}/${branch}/${year}`);
                if (!classResponse.ok) throw new Error('Failed to fetch class data.');
                const classData = await classResponse.json();
                setClassData(classData);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [location.search]);

    const renderGpaOverview = () => {
        if (!studentData || !studentData.semesters) {
            return <p>Loading academic performance...</p>;
        }

        return (
            <div className="gpa-overview">
                <h3>Academic Performance Overview</h3>
                <p><strong>Name:</strong> {studentData.name}</p>
                <p><strong>Roll No:</strong> {studentData.rollNo}</p>
                <p><strong>Overall CGPA:</strong> {studentData.cgpa}</p>
                <h4>GPA per Semester</h4>
                <ul>
                    {studentData.semesters.map((semester) => (
                        <li key={semester.semester}>Semester {semester.semester}: GPA {semester.gpa}</li>
                    ))}
                </ul>
            </div>
        );
    };

    const renderPerformanceChart = () => {
        if (!studentData || !studentData.semesters || !studentData.semesters[0].subjects) {
            return <p>Loading performance chart...</p>;
        }

        const labels = studentData.semesters[0].subjects.map((subject) => subject.name);
        const datasets = studentData.semesters.map((sem, index) => ({
            label: `Semester ${sem.semester}`,
            backgroundColor: `rgba(75, 192, 192, ${0.3 + index * 0.2})`,
            borderColor: `rgba(75, 192, 192, 1)`,
            borderWidth: 1,
            data: sem.subjects.map((subject) => subject.marks),
        }));

        const chartData = {
            labels: labels,
            datasets: datasets,
        };

        return (
            <div className="performance-chart">
                <h3>Performance Across Subjects</h3>
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
                                type: 'category',
                                title: {
                                    display: true,
                                    text: 'Subjects'
                                }
                            },
                            y: {
                                type: 'linear',
                                title: {
                                    display: true,
                                    text: 'Marks'
                                },
                                beginAtZero: true,
                                max: 100,
                            },
                        },
                    }}
                />
            </div>
        );
    };

    const renderCgpaComparisonChart = () => {
        if (!classData || classData.length === 0) return <p>No classmates data available.</p>;
    
        const labels = classData.map(student => student.name);
        const cgpaData = classData.map(student => {
            // Ensure that semesters exists and has subjects before calculating CGPA
            if (!student.semesters || student.semesters.length === 0) return 0;
    
            const totalMarks = student.semesters.reduce((sum, semester) => {
                if (!semester.subjects || semester.subjects.length === 0) return sum; // Guard against undefined subjects
                const semesterTotal = semester.subjects.reduce((semSum, subject) => {
                    return semSum + (subject.marks || 0); // Ensure marks are valid numbers
                }, 0);
                return sum + semesterTotal;
            }, 0);
    
            const totalSubjects = student.semesters.reduce((count, semester) => {
                return count + (semester.subjects ? semester.subjects.length : 0);
            }, 0);
            
            // Calculate CGPA as totalMarks / totalSubjects (assuming 10-point grading scale)
            return totalSubjects > 0 ? (totalMarks / totalSubjects).toFixed(2) : 0;
        });
    
        const chartData = {
            labels: labels,
            datasets: [{
                label: 'CGPA Comparison',
                data: cgpaData,
                fill: false,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                tension: 0.1 // Smooth lines
            }],
        };
    
        return (
            <div className="cgpa-comparison-chart">
                <h3>CGPA Comparison with Classmates</h3>
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
                                    text: 'Classmates'
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'CGPA'
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
    const renderCgpaTable = () => (
        <div className="cgpa-table">
            <h3>CGPA Comparison with Classmates</h3>
            <table>
                <thead>
                    <tr>
                        <th>Roll No</th>
                        <th>Name</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {classData.map((student) => (
                        <tr key={student.rollNo}>
                            <td>{student.rollNo}</td>
                            <td>{student.name}</td>
                           
                        </tr>
                    ))}
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
        <div className="dashboard-container">
            <h2>Student Dashboard</h2>
            <a href={`http://localhost:3000/profile?email=${email}`}>Personal Page</a>
            <br/>
            <a href={`http://localhost:3000/user?email=${email}`}>Profile</a>

            {renderPerformanceChart()}
            {renderCgpaComparisonChart()}
            {renderCgpaTable()}
             {/* Render CGPA comparison chart */}
        </div>
    );
};

export default Dashboard;
