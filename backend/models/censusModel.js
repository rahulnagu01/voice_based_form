// models/CensusModel.js
const mongoose = require('mongoose');

// Define generateFormId function first
const generateFormId = async function() {
    try {
        const count = await mongoose.model('Census').countDocuments();
        const year = new Date().getFullYear();
        return `FORM${year}-${(count + 1).toString().padStart(4, '0')}`;
    } catch (error) {
        // Fallback for first document
        return `FORM${new Date().getFullYear()}-0001`;
    }
};

const censusSchema = mongoose.Schema({
    formId: {
        type: String,
        unique: true,
    },
    aadhaarNumber: {
        type: String,
        required: true,
        unique: true
    },
    personalDetails: {
        fullName: { type: String, required: true },
        gender: { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
        maritalStatus: String,
        nationality: String
    },
    contactInformation: {
        phoneNumber: String,
        email: String,
        permanentAddress: String,
        temporaryAddress: String
    },
    employmentEducation: {
        employmentStatus: String,
        occupation: String,
        highestQualification: String
    },
    demographicDetails: {
        state: String,
        districtCity: String,
        pincode: String
    },
    familyDetails: {
        headOfFamily: String,
        familyMembers: Number,
        dependentMembers: Number
    },
    additionalInfo: {
        disabilities: String,
        annualIncome: Number
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Officer',
        required: true
    },
    officerId: {
        type: String,
        required: true
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Officer'
    }
}, {
    timestamps: true
});

// Add pre-save middleware to generate formId
censusSchema.pre('save', async function(next) {
    try {
        if (this.isNew && !this.formId) {
            this.formId = await generateFormId();
        }
        next();
    } catch (error) {
        next(error);
    }
});
module.exports = mongoose.models.Census || mongoose.model('Census', censusSchema);
