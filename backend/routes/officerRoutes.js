// backend/routes/officerRoutes.js
const express = require('express');
const router = express.Router();
const { loginOfficer } = require('../controllers/officerController');

router.post('/login', loginOfficer);

const { updateOfficerStatus } = require('../controllers/officerController');
const { verifyAdmin } = require('../middleware/authMiddleware');


module.exports = router;