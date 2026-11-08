const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth'); // your authenticate middleware
const admin = require('../middleware/admin'); // your isAdminAsync middleware
const { 
  getAllCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/categoryController');

// Public route: Anyone can view vehicle categories
router.get('/', getAllCategories);

// Admin-only routes: Only admins can manage categories
router.post('/', [auth, admin], createCategory);
router.patch('/:id', [auth, admin], updateCategory);
router.delete('/:id', [auth, admin], deleteCategory);

module.exports = router;