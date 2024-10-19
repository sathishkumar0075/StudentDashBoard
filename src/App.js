import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login.js';
import SignUp from './components/SignUp.js';
import Dashboard from './components/Dashboard.js';
import Profile from './components/Profile.js';
import User from './components/User.js';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path='/user' element={<User/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
