const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const getUserProfile = require('../controllers/userController');

router.get('/profile', auth, getUserProfile);

module.exports = router;