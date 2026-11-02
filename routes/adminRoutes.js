const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const {createVehicle, updateVehicle} = require('../controllers/vehicleController');

router.use(auth, admin);
router.post('/vehicles', createVehicle);
router.put('/vehicles/:id', updateVehicle);

module.exports = router;