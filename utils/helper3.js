class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = { AppError, isValidEmail }; 