const path = require('path');
const { readJsonFile } = require('../utils/helpers');

const USERS_FILE = path.join(__dirname, '../data', 'users.json');

async function getUserProfile(req, res) {
  const users = await readJsonFile(USERS_FILE);
  const user = users.find((u) => u.user_id === req.user.id);

  if (!user) return res.status(404).json({ error: 'User not found' });

  const { password_hash, ...profile } = user;
  res.json(profile);
}

module.exports = { getUserProfile };