const {AppError, asyncHandler} = require('../utils/helper3');
const verifyToken = require('../utils/helper2');

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) throw new AppError('Authentication required.', 401);
    try {
        req.user = verifyToken(token);
    } catch {
        throw new AppError('Invalid or expired token.', 401);
    }
    next();
};
module.exports = authenticate;
