const jwt = require('jsonwebtoken');
const { Admin, Officer } = require('../models');

// General protection middleware for officers and admins
const protect = async (req, res, next) => {
    try {
        console.log('Protect middleware - Headers:', req.headers); // Debug log

        if (req.headers.authorization?.startsWith('Bearer')) {
            const token = req.headers.authorization.split(' ')[1];
            console.log('Token received:', token); // Debug log

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded); // Debug log

            // Check for Officer
            const officer = await Officer.findById(decoded.id).select('-password');
            if (officer) {
                console.log('Officer found:', officer.officerId); // Debug log
                req.user = officer;
                req.role = 'officer';
                return next();
            }

            // Check for Admin
            const admin = await Admin.findById(decoded.id).select('-password');
            if (admin) {
                console.log('Admin found:', admin.email); // Debug log
                req.user = admin;
                req.role = 'admin';
                return next();
            }

            console.log('No user found for decoded ID:', decoded.id); // Debug log
            return res.status(401).json({ message: 'Not authorized' });
        } else {
            console.log('No authorization header found'); // Debug log
            res.status(401).json({ message: 'No token provided' });
        }
    } catch (error) {
        console.error('Protect middleware error:', error); // Debug log
        res.status(401).json({ message: 'Not authorized', error: error.message });
    }
};

// Admin-specific protection middleware
const adminProtect = async (req, res, next) => {
    try {
        console.log('Admin protect middleware - Headers:', req.headers); // Debug log
        console.log('Request path:', req.path); // Debug log
        console.log('Request params:', req.params); // Debug log

        if (req.headers.authorization?.startsWith('Bearer')) {
            const token = req.headers.authorization.split(' ')[1];
            console.log('Token received:', token); // Debug log

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded); // Debug log

            const admin = await Admin.findById(decoded.id).select('-password');
            if (admin) {
                console.log('Admin found:', admin.email); // Debug log
                req.user = admin;
                req.role = 'admin';
                return next();
            }

            console.log('User is not an admin'); // Debug log
            return res.status(403).json({ message: 'Access restricted to admins only' });
        } else {
            console.log('No authorization header found'); // Debug log
            res.status(401).json({ message: 'No token provided' });
        }
    } catch (error) {
        console.error('Admin protect middleware error:', error); // Debug log
        res.status(401).json({ 
            message: 'Not authorized', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Officer-specific protection middleware
const officerProtect = async (req, res, next) => {
    try {
        console.log('Officer protect middleware - Headers:', req.headers); // Debug log

        if (req.headers.authorization?.startsWith('Bearer')) {
            const token = req.headers.authorization.split(' ')[1];
            console.log('Token received:', token); // Debug log

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded); // Debug log

            const officer = await Officer.findById(decoded.id).select('-password');
            if (officer) {
                console.log('Officer found:', officer.officerId); // Debug log
                req.user = officer;
                req.role = 'officer';
                return next();
            }

            console.log('User is not an officer'); // Debug log
            return res.status(403).json({ message: 'Access restricted to officers only' });
        } else {
            console.log('No authorization header found'); // Debug log
            res.status(401).json({ message: 'No token provided' });
        }
    } catch (error) {
        console.error('Officer protect middleware error:', error); // Debug log
        res.status(401).json({ message: 'Not authorized', error: error.message });
    }
};

// Add a route logger middleware
const routeLogger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Query:', req.query);
    console.log('Params:', req.params);
    console.log('Body:', req.body);
    next();
};

module.exports = { 
    protect, 
    adminProtect, 
    officerProtect,
    routeLogger // Export the route logger
};


