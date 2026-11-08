const path = require('path');
const { readJsonFile, writeJsonFile, readJsonBody } = require('../utils/helpers');

const PAYMENTS_FILE = path.join(__dirname, '../data', 'payments.json');
const BOOKINGS_FILE = path.join(__dirname, '../data', 'bookings.json');

async function processPayment(req, res) {
  const body = await readJsonBody(req);
  if (!body) return res.status(400).json({ error: 'Invalid JSON body' });

  const { booking_id, amount, payment_method, transaction_id } = body;
  const userId = req.user.id;

  const bookings = await readJsonFile(BOOKINGS_FILE);
  const booking = bookings.find((b) => b.booking_id === Number(booking_id));
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  if (booking.user_id !== userId) {
    return res.status(403).json({ error: 'Unauthorized to pay for this booking' });
  }

  const payments = await readJsonFile(PAYMENTS_FILE);
  const newId = payments.length > 0 ? Math.max(...payments.map(p => p.payment_id)) + 1 : 1;

  const newPayment = {
    payment_id: newId,
    booking_id: Number(booking_id),
    amount: Number(amount),
    payment_method: payment_method || 'credit_card',
    payment_status: 'completed',
    transaction_id: transaction_id || `TXN-${Date.now()}`,
    created_at: new Date().toISOString()
  };

  payments.push(newPayment);
  await writeJsonFile(PAYMENTS_FILE, payments);

  // Update the booking status to reflect the payment
  booking.status = 'paid';
  await writeJsonFile(BOOKINGS_FILE, bookings);

  res.status(201).json(newPayment);
};

async function getPaymentByBooking(req, res) {
  const bookingId = Number(req.params.booking_id);
  const userId = req.user.id;

  const bookings = await readJsonFile(BOOKINGS_FILE);
  const booking = bookings.find((b) => b.booking_id === bookingId);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  if (booking.user_id !== userId) {
    return res.status(403).json({ error: 'Unauthorized to view this payment' });
  }

  const payments = await readJsonFile(PAYMENTS_FILE);
  const payment = payments.find((p) => p.booking_id === bookingId);
  
  if (!payment) return res.status(404).json({ error: 'Payment not found for this booking' });

  res.json(payment);
};

module.exports = { processPayment, getPaymentByBooking };