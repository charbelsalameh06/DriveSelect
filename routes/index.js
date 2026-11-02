const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/bookings', require('./bookingRoutes'));
router.use('/admin', require('./adminRoutes'));
router.use('/vehicles', require('./vehicleRoutes'));
router.use('/users', require('./userRoutes'));

module.exports = router;