// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { 
    loginAdmin, 
    createOfficer, 
    getAllOfficers, 
    updateOfficerStatus,
} = require('../controllers/adminController');

const { getAllCensusData,
        adminDeleteCensus,
        adminUpdateCensus  
 } = require('../controllers/censusController');

const { adminProtect } = require('../middleware/authMiddleware');

// Public route
router.post('/login', loginAdmin);

// Protected routes
router.post('/create-officer', adminProtect, createOfficer);
router.get('/officers', adminProtect, getAllOfficers);
router.patch('/officers/:officerId/status', adminProtect, updateOfficerStatus); // Make sure this line exists
//census 
router.get('/census-data', adminProtect, getAllCensusData)
router.delete('/census/:id', adminProtect, adminDeleteCensus);
router.put('/census/:id', adminProtect, adminUpdateCensus);  
module.exports = router;