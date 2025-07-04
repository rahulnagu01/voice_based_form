// backend/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/adminModel');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Check if admin exists
        const adminExists = await Admin.findOne({ email: 'admin@example.com' });

        if (adminExists) {
            console.log('Admin already exists');
            process.exit(1);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Create admin
        const admin = await Admin.create({
            name: 'Admin',
            email: 'admin@example.com',
            password: hashedPassword,
            isAdmin: true
        });

        if (admin) {
            console.log('Admin created:', admin);
        }

    } catch (error) {
        console.error('Error:', error);
    }
    process.exit();
};

createAdmin();