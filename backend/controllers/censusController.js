// controllers/censusController.js
const Census = require('../models/censusModel');
//  Otp generator using email

const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create census entry
const createCensus = async (req, res) => {
    try {
        // Log the incoming request data and officer info
        console.log('Request user:', req.user);
        console.log('Form data:', req.body);

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Officer authentication required' });
        }

        // Check if officer is active
        if (!req.user.isActive) {
            return res.status(403).json({ message: 'Access denied. Your account is inactive.' });
        }

        // Create census data with officer reference
        const censusData = {
            ...req.body,
            submittedBy: req.user._id,    // Reference to the officer who submitted
            officerId: req.user.officerId  // Store the officer's ID for reference
        };

        const census = await Census.create(censusData);
        
        res.status(201).json({
            success: true,
            data: census,
            message: 'Census data submitted successfully'
        });

    } catch (error) {
        console.error('Census creation error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to submit census data'
        });
    }
};

// Get all census entries for an officer
const getOfficerCensus = async (req, res) => {
    try {
        if (!req.user.isActive) {
            return res.status(403).json({ message: 'Access denied. Your account is inactive.' });
        }

        const census = await Census.find({ submittedBy: req.user._id })
            .sort({ createdAt: -1 }); // Sort by newest first

        res.json({
            success: true,
            count: census.length,
            data: census
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving census entries'
        });
    }
};

// Get single census entry
const getCensusById = async (req, res) => {
    try {
        if (!req.user.isActive) {
            return res.status(403).json({ message: 'Access denied. Your account is inactive.' });
        }

        const census = await Census.findById(req.params.id);

        if (!census) {
            return res.status(404).json({
                success: false,
                message: 'Census entry not found'
            });
        }

        // Check if the census entry belongs to the requesting officer
        if (census.submittedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this census entry'
            });
        }

        res.json({
            success: true,
            data: census
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error retrieving census entry'
        });
    }
};

// Update census entry
const updateCensus = async (req, res) => {
    try {
        if (!req.user.isActive) {
            return res.status(403).json({ message: 'Access denied. Your account is inactive.' });
        }

        const census = await Census.findById(req.params.id);

        if (!census) {
            return res.status(404).json({
                success: false,
                message: 'Census entry not found'
            });
        }

        // Check if the census entry belongs to the requesting officer
        if (census.submittedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this census entry'
            });
        }

        const updatedCensus = await Census.findByIdAndUpdate(
            req.params.id,
            { ...req.body, lastUpdatedBy: req.user._id },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: updatedCensus,
            message: 'Census entry updated successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error updating census entry'
        });
    }
};

// Delete census entry
const deleteCensus = async (req, res) => {
    try {
        if (!req.user.isActive) {
            return res.status(403).json({ message: 'Access denied. Your account is inactive.' });
        }

        const census = await Census.findById(req.params.id);

        if (!census) {
            return res.status(404).json({
                success: false,
                message: 'Census entry not found'
            });
        }

        // Check if the census entry belongs to the requesting officer
        if (census.submittedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this census entry'
            });
        }

        await Census.deleteOne({ _id: req.params.id });

        res.json({
            success: true,
            message: 'Census entry deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting census entry'
        });
    }
};

// Public controller - no authentication needed
const getCensusByAadhaar = async (req, res) => {
    try {
        const { aadhaarNumber } = req.params;
        console.log('Searching for Aadhaar:', aadhaarNumber);

        // Validate Aadhaar number
        if (!/^\d{12}$/.test(aadhaarNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Aadhaar number format. Must be 12 digits.'
            });
        }

        const census = await Census.findOne({ aadhaarNumber })
            .select('-submittedBy -lastUpdatedBy -officerId -__v')
            .lean();

        if (!census) {
            return res.status(404).json({
                success: false,
                message: 'No census record found for this Aadhaar number'
            });
        }

        res.json({
            success: true,
            data: census
        });
    } catch (error) {
        console.error('Error in getCensusByAadhaar:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving census data'
        });
    }
};

// Admin

// Get all census entries (Admin access)
const getAllCensusData = async (req, res) => {
    try {
        // Verify if the user is an admin
        if (req.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access restricted to admins only'
            });
        }

        const censusData = await Census.find()
            .populate('submittedBy', 'name officerId')
            .populate('lastUpdatedBy', 'name officerId')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: censusData.length,
            data: censusData
        });
    } catch (error) {
        console.error('Error fetching census data:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching census data',
            error: error.message
        });
    }
};

// Delete census entry (Admin)
const adminDeleteCensus = async (req, res) => {
    try {
        console.log('Attempting to delete census:', req.params.id); // Add logging
        
        // Verify if the user is an admin
        if (req.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access restricted to admins only'
            });
        }

        const census = await Census.findById(req.params.id);

        if (!census) {
            return res.status(404).json({
                success: false,
                message: 'Census entry not found'
            });
        }

        await Census.deleteOne({ _id: req.params.id });

        res.json({
            success: true,
            message: 'Census entry deleted successfully'
        });
    } catch (error) {
        console.error('Error in adminDeleteCensus:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting census entry'
        });
    }
};

const adminUpdateCensus = async (req, res) => {
    try {
        console.log('Admin update request received:', {
            id: req.params.id,
            body: req.body
        });

        // Verify if the user is an admin
        if (req.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access restricted to admins only'
            });
        }

        const census = await Census.findById(req.params.id);

        if (!census) {
            return res.status(404).json({
                success: false,
                message: 'Census entry not found'
            });
        }

        // Update the census data
        const updatedCensus = await Census.findByIdAndUpdate(
            req.params.id,
            { 
                ...req.body,
                lastUpdatedBy: req.user._id 
            },
            { 
                new: true, 
                runValidators: true 
            }
        ).populate('submittedBy', 'name officerId')
         .populate('lastUpdatedBy', 'name officerId');

        res.json({
            success: true,
            message: 'Census entry updated successfully',
            data: updatedCensus
        });
    } catch (error) {
        console.error('Error in adminUpdateCensus:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating census entry'
        });
    }
};




let otpStore = {}; // Temporary storage for OTPs

// Function to generate and send OTP
const generateOtp = async (req, res) => {
  const { aadhaarNumber, email } = req.body;

  // Generate a random OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  otpStore[aadhaarNumber] = { otp, email };

  // Set up Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Census Information',
    text: `Your OTP is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error sending OTP' });
  }
};

// Function to verify OTP
const verifyOtp = (req, res) => {
  const { aadhaarNumber, otp } = req.body;

  if (otpStore[aadhaarNumber] && otpStore[aadhaarNumber].otp === otp) {
    delete otpStore[aadhaarNumber]; // Remove OTP after verification
    res.json({ success: true, message: 'OTP verified' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
};



module.exports = {

    createCensus,
    getOfficerCensus,
    getCensusById,
    updateCensus,
    deleteCensus,
    getCensusByAadhaar,
    getAllCensusData,
    adminDeleteCensus,
    adminUpdateCensus,
    // 

    generateOtp,
    verifyOtp,
};