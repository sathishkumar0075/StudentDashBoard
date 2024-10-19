import React, { useState } from 'react';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const { email, password } = formData;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple validation
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                // Handle successful login (e.g., save token, redirect)
                alert('Login successful!'); 
                navigate(`/dashboard?email=${email}`);
                console.log('Token:', data.token); // Use this token for authenticated requests
            } else {
                const errorData = await response.json();
                alert(`Login failed: ${errorData.msg}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Login failed. Please try again later.');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={handleChange} 
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={handleChange} 
                />
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
    );
};

export default Login;
