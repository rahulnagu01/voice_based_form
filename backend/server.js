// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    next();
});

// Public routes (no authentication)
app.use('/api/public', require('./routes/publicRoutes'));


// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/officers', require('./routes/officerRoutes'));
app.use('/api/census', require('./routes/censusRoutes'));



// speech

// app.use('/api', require('./routes/speechRoutes'));


// Route not found handler
// backend/server.js
// Route not found handler
app.use((req, res) => {
    console.log({
        message: 'Route not found',
        method: req.method,
        originalUrl: req.originalUrl,
        baseUrl: req.baseUrl,
        path: req.path,
        params: req.params
    });
    
    res.status(404).json({ 
        success: false, 
        message: `Route not found`,
        details: {
            method: req.method,
            path: req.originalUrl
        }
    });
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});