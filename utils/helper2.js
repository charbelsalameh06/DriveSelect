const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const hashPassword = (plainPassword) => bcrypt.hashSync(plainPassword, 10);
const comparePassword = (plainPassword, hashedPassword) => bcrypt.compareSync(plainPassword, hashedPassword);

const signToken = (user) => jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN || '2h' });

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { hashPassword, comparePassword, signToken, verifyToken };