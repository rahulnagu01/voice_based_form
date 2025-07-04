const mongoose = require('mongoose');

// Define the officer schema
const officerSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name']
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Please add a password']
        },
        officerId: {
            type: String,
            required: true,
            unique: true,
            default: function () {
                return `OFF${Math.floor(Math.random() * 9000) + 1000}`; // Generate ID in format OFF1001, OFF1002, etc.
            }
        },
        area: {
            type: String,
            required: [true, 'Please add an area']
        },
        pincode: {
            type: String,
            required: [true, 'Please add a pincode'],
            validate: {
                validator: function (value) {
                    return /^[0-9]{6}$/.test(value); // Ensure it is a 6-digit number
                },
                message: 'Pincode must be a valid 6-digit number'
            }
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Officer', officerSchema);
