class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

const sendSuccessResponse = (res, data = {}, status = 200) => {
  res.status(status).json({
    status: 'success',
    data
  });
};

const asyncHandler = (fn) => {
  return async (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  }};

const rentalDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = { AppError, sendSuccessResponse, asyncHandler, rentalDays, isValidEmail }; 