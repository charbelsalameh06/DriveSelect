const path = require('path');
const { readJsonFile, writeJsonFile, readJsonBody } = require('../utils/helpers');

const BOOKINGS_FILE = path.join(__dirname, '../data', 'bookings.json');
const VEHICLES_FILE = path.join(__dirname, '../data', 'vehicles.json');
const BOOKING_FIELDS = ['status']; 

async function createBooking(req, res) {
  const body = await readJsonBody(req);
  if (!body) return res.status(400).json({ error: 'Invalid JSON body' });

  const { vehicle_id, start_date, end_date } = body;
  const userId = req.user.id; 

  const vehicles = await readJsonFile(VEHICLES_FILE);
  const vehicle = vehicles.find((v) => v.vehicle_id === Number(vehicle_id));
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

  const start = new Date(start_date);
  const end = new Date(end_date);
  const rental_days = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
  const total_price = rental_days * vehicle.daily_rate;

  const bookings = await readJsonFile(BOOKINGS_FILE);
  const newId = bookings.length > 0 ? Math.max(...bookings.map(b => b.booking_id)) + 1 : 1;

  const newBooking = {
    booking_id: newId,
    user_id: userId,
    vehicle_id: Number(vehicle_id),
    start_date,
    end_date,
    daily_rate_at_booking: vehicle.daily_rate,
    rental_days,
    total_price,
    status: 'pending',
    created_at: new Date().toISOString()
  };

  bookings.push(newBooking);
  await writeJsonFile(BOOKINGS_FILE, bookings);
  res.status(201).json(newBooking);
};

async function getMyBookings(req, res) {
  const userId = req.user.id;
  const bookings = await readJsonFile(BOOKINGS_FILE);
  const userBookings = bookings.filter((b) => b.user_id === userId);
  res.json(userBookings);
};

async function cancelBooking(req, res) {
  const id = Number(req.params.id);
  const bookings = await readJsonFile(BOOKINGS_FILE);
  const booking = bookings.find((b) => b.booking_id === id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

 
  if (booking.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized to cancel this booking' });
  }

  booking.status = 'cancelled';
  booking.cancelled_at = new Date().toISOString();

  await writeJsonFile(BOOKINGS_FILE, bookings);
  res.json({ message: 'Booking cancelled successfully', booking });
};

module.exports = { createBooking, getMyBookings, cancelBooking };