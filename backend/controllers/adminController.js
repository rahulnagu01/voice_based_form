const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Admin, Officer } = require('../models');

// Admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (admin && (await bcrypt.compare(password, admin.password))) {
            res.json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                token: generateToken(admin._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid admin credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Auto-generate Officer ID
const generateOfficerId = async () => {
    const lastOfficer = await Officer.findOne().sort({ createdAt: -1 });
    if (!lastOfficer) {
        return 'OFF1001'; // Starting ID if no officers exist
    }
    const lastId = parseInt(lastOfficer.officerId.replace('OFF', ''), 10);
    return `OFF${lastId + 1}`;
};

// Create officer
const createOfficer = async (req, res) => {
    try {
        const { name, email, password, area, pincode } = req.body;

        // Check if officer exists
        const officerExists = await Officer.findOne({ email });
        if (officerExists) {
            return res.status(400).json({ message: 'Officer with this email already exists' });
        }

        // Generate unique Officer ID
        const officerId = await generateOfficerId();

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create officer
        const officer = await Officer.create({
            name,
            email,
            password: hashedPassword,
            officerId,
            area,
            pincode,
            isActive: true // Add default active status
        });

        res.status(201).json({
            _id: officer._id,
            name: officer.name,
            email: officer.email,
            officerId: officer.officerId,
            area: officer.area,
            pincode: officer.pincode,
            isActive: officer.isActive
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all officers
const getAllOfficers = async (req, res) => {
    try {
        const officers = await Officer.find({}).select('-password');
        res.json(officers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update officer status (modified to use officerId)
const updateOfficerStatus = async (req, res) => {
    try {
        const { officerId } = req.params;
        console.log('Attempting to update officer status:', officerId);

        const officer = await Officer.findOne({ officerId });
        
        if (!officer) {
            console.log('Officer not found:', officerId);
            return res.status(404).json({ 
                message: `Officer with ID ${officerId} not found` 
            });
        }

        // Toggle the isActive status
        officer.isActive = !officer.isActive;
        await officer.save();

        console.log(`Officer ${officerId} status updated to: ${officer.isActive}`);

        res.json({
            success: true,
            message: `Officer ${officer.isActive ? 'activated' : 'deactivated'} successfully`,
            officer: {
                _id: officer._id,
                name: officer.name,
                email: officer.email,
                officerId: officer.officerId,
                area: officer.area,
                pincode: officer.pincode,
                isActive: officer.isActive
            }
        });
    } catch (error) {
        console.error('Error updating officer status:', error);
        res.status(500).json({ 
            message: 'Error updating officer status',
            error: error.message 
        });
    }
};


// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = {
    loginAdmin,
    createOfficer,
    getAllOfficers,
    updateOfficerStatus
};