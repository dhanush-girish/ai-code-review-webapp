const express = require('express');
const router = express.Router();
const { requireAuthentication, attachUser } = require('../middleware/auth');
const { validateReviewInput, handleValidationErrors } = require('../middleware/validate');
const reviewController = require('../controllers/reviewController');

// All review routes require authentication
router.use(requireAuthentication, attachUser);

// POST /api/reviews — submit a new code review
router.post(
  '/',
  validateReviewInput,
  handleValidationErrors,
  reviewController.createReview
);

// GET /api/reviews — get current user's reviews
router.get('/', reviewController.getUserReviews);

// GET /api/reviews/:id — get a specific review
router.get('/:id', reviewController.getReviewById);

module.exports = router;
