




// routes/censusRoutes.js
const express = require('express');
const router = express.Router();
const { 
    createCensus, 
    getOfficerCensus, 
    getCensusById, 
    updateCensus, 
    deleteCensus,

} = require('../controllers/censusController');

const { adminProtect,officerProtect } = require('../middleware/authMiddleware');



// Apply officer protection to all routes
router.use(officerProtect);

router.route('/')
    .post(createCensus)
    .get(getOfficerCensus);

router.route('/:id')
    .get(getCensusById)
    .put(updateCensus)
    .delete(deleteCensus);


module.exports = router;



// // routes/censusRoutes.js
// const express = require('express');
// const router = express.Router();
// const {
//     createCensus,
//     getAllCensus,
//     getCensus,
//     updateCensus,
//     deleteCensus
// } = require('../controllers/censusController');
// const { protect } = require('../middleware/authMiddleware');

// router.post('/', protect, createCensus);
// router.get('/', protect, getAllCensus);
// router.get('/:id', protect, getCensus);
// router.put('/:id', protect, updateCensus);
// router.delete('/:id', protect, deleteCensus);

// module.exports = router;