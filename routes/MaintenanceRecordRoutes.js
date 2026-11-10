const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { createMaintenanceRecord, getVehicleMaintenanceRecords, updateMaintenanceStatus } = require('../controllers/MaintenanceRecordController');

router.post('/', auth, createMaintenanceRecord);
router.get('/vehicle/:vehicle_id', auth, getVehicleMaintenanceRecords);
router.patch('/:id/status', auth, updateMaintenanceStatus);

module.exports = router;