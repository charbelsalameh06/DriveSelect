const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { processPayment, getPaymentByBooking } = require('../controllers/paymentController');

router.post('/', auth, processPayment);
router.get('/booking/:booking_id', auth, getPaymentByBooking);

module.exports = router;