const express = require('express');
const router = express.Router();
const { requireAuthentication, attachUser, requireAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// All admin routes require auth + admin role
router.use(requireAuthentication, attachUser, requireAdmin);

// GET /api/admin/stats — platform-wide statistics
router.get('/stats', adminController.getStats);

// GET /api/admin/users — all users
router.get('/users', adminController.getAllUsers);

// GET /api/admin/reviews — all reviews across all users
router.get('/reviews', adminController.getAllReviews);

module.exports = router;
