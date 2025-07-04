// backend/models/index.js
const Officer = require('./officerModel');
const Admin = require('./adminModel');
const Census = require('./censusModel');

module.exports = {
    Officer,
    Admin,
    Census
};