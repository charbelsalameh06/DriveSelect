const AppError = require('../utils/helper3');

const isAdminAsync = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new AppError('Access denied. Admins only.', 403));
  }
  next();
};

module.exports =  isAdminAsync;