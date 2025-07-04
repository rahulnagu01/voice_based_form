const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Officer } = require('../models');

// Login officer
const loginOfficer = async (req, res) => {
    try {
        const { email, password } = req.body;
         // Debug log
         console.log('Login attempt for:', email);
        const officer = await Officer.findOne({ email });

        if (!officer) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if officer is inactive
        if (!officer.isActive) {
            return res.status(403).json({ message: 'Access denied. Your account is inactive.' });
        }

        // Check password
        const isPasswordMatch = await bcrypt.compare(password, officer.password);
        if (isPasswordMatch) {
              // Generate token
              const token = generateToken(officer._id);
            
              // Debug log
              console.log('Generated token:', token);
            res.json({
                _id: officer._id,
                name: officer.name,
                email: officer.email,
                officerId: officer.officerId,
                token: generateToken(officer._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
// Update officer status (set isActive to false)
const updateOfficerStatus = async (req, res) => {
    try {
        const { officerId } = req.params; // Get officerId from the request params
        const { isActive } = req.body; // Get isActive value from the request body

        // Find officer by ID and update status
        const officer = await Officer.findOneAndUpdate(
            { officerId },
            { isActive },
            { new: true } // Return the updated officer
        );

        if (!officer) {
            return res.status(404).json({ message: 'Officer not found' });
        }

        res.json({ message: 'Officer status updated successfully', officer });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update officer status', error: error.message });
    }
};

module.exports = {
    loginOfficer,
    updateOfficerStatus,
};



