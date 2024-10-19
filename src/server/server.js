import express from "express"

import connectDB from "./config/db.js";
//const connectDB = require('./config/db');
import cors from 'cors';
//const cors = require('cors');

import dotenv from 'dotenv';

// Initialize dotenv to read .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import classRoutes from './routes/class.js';
// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/class', classRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
