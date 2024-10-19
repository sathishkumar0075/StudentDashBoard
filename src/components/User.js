import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/User.css'; // Ensure your CSS file path is correct

const User = () => {
    const location = useLocation();
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch student data. Please try again later.'); // More user-friendly error message
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location.search]);

    if (loading) {
        return <p>Loading student profile...</p>; // More informative loading message
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="student-profile-container summa">
            <h2>Student Profile</h2>
            {studentData ? (
                <div className="student-info">
                    <p><strong>Name:</strong> {studentData.name}</p>
                    <p><strong>Roll No:</strong> {studentData.rollNo}</p>
                    <p><strong>Department:</strong> {studentData.department}</p>
                    <p><strong>Branch:</strong> {studentData.branch}</p>
                    <p><strong>Email:</strong> {studentData.email}</p>
                    <p><strong>Year:</strong> {studentData.year}</p> {/* Include year if available */}
                </div>
            ) : (
                <p>No student data available.</p>
            )}
        </div>
    );
};

export default User;
