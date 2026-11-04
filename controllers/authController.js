const path = require('path');
const { readJsonFile, writeJsonFile } = require('../utils/helpers');
const { hashPassword, comparePassword, signToken } = require('../utils/helper2');
const { AppError, isValidEmail } = require('../utils/helper3');

const USERS_FILE = path.join(__dirname, '../data', 'users.json');

async function register(req, res) {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) throw new AppError('name, email and password are required.', 400);
  if (!isValidEmail(email)) throw new AppError('Invalid email.', 400);
  if (password.length < 6) throw new AppError('Password must be at least 6 characters.', 400);

  const users = await readJsonFile(USERS_FILE);
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
    throw new AppError('Email already registered.', 409);

  const newUser = {
    user_id: users.length ? Math.max(...users.map((u) => u.user_id)) + 1 : 1,
    name,
    email,
    password_hash: hashPassword(password),
    role: 'user',
    created_at: new Date().toISOString()
  };
  users.push(newUser);
  await writeJsonFile(USERS_FILE, users);

  const { password_hash, ...profile } = newUser;
  res.status(201).json(profile);
}

async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) throw new AppError('email and password are required.', 400);

  const users = await readJsonFile(USERS_FILE);
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !comparePassword(password, user.password_hash))
    throw new AppError('Invalid email or password.', 401);

  const token = signToken({ id: user.user_id, role: user.role });
  res.json({ token });
}

module.exports = { register, login };
