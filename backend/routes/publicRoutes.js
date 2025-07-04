// routes/publicRoutes.js
const express = require('express');
const router = express.Router();
const {  getCensusByAadhaar, generateOtp, verifyOtp } = require('../controllers/censusController');

// Public endpoints for OTP verification
router.post('/send-otp', generateOtp);
router.post('/verify-otp', verifyOtp);
router.get('/census/:aadhaarNumber', getCensusByAadhaar);


module.exports = router;





// // backend/routes/publicRoutes.js
// const express = require('express');
// const router = express.Router();
// const { 
//     getCensusByAadhaar, 
//     generateOtp, 
//     verifyOtp 
// } = require('../controllers/censusController');

// // Debug log
// router.use((req, res, next) => {
//     console.log('Public route accessed:', req.path);
//     next();
// });

// // Public census search route
// router.get('/census/:aadhaarNumber', getCensusByAadhaar);

// // Route to generate OTP
// router.post('/generate-otp', generateOtp);

// // Route to verify OTP
// router.post('/verify-otp', verifyOtp);

// module.exports = router;




// // backend/routes/publicRoutes.js
// const express = require('express');
// const router = express.Router();
// const { getCensusByAadhaar } = require('../controllers/censusController');

// // Debug log
// router.use((req, res, next) => {
//     console.log('Public route accessed:', req.path);
//     next();
// });

// // Public census search route
// router.get('/census/:aadhaarNumber', getCensusByAadhaar);




// module.exports = router;