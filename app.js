const express = require('express');

const adminRoutes = require('./routes/adminRoutes');

const userRoutes = require('./routes/userRoutes');

const authRoutes = require('./routes/authRoutes');

const bookingRoutes = require('./routes/bookingRoutes');

const indexRoutes = require('./routes/indexRoutes');

const vehicleRoutes = require('./routes/vehicleRoutes');

const errorHandler = require('./middleware/errorHandler');

const notFound = require('./middleware/notFound');

const app = express();

app.use(express.json());

app.use('/api/admin', adminRoutes);

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/', indexRoutes);

app.use(notFound);
app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});
 

module.exports = app;