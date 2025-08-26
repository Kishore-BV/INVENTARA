const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  adminDashboard 
} = require('../controllers/userController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

// Apply token verification to all routes
router.use(verifyToken);

// Protected routes for all authenticated users
router.get('/profile', (req, res) => getUserById(req, res, req.user.id));
router.put('/profile', (req, res) => updateUser(req, res, req.user.id));

// Admin-only routes
router.get('/admin/dashboard', authorize('admin'), adminDashboard);
router.get('/users', authorize('admin'), getAllUsers);
router.get('/users/:id', authorize('admin'), getUserById);
router.put('/users/:id', authorize('admin'), updateUser);
router.delete('/users/:id', authorize('admin'), deleteUser);

module.exports = router;
