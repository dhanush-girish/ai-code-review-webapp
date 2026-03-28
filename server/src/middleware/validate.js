const { body, validationResult } = require('express-validator');

// Validation rules for code review submission
const validateReviewInput = [
  body('sourceType')
    .isIn(['paste', 'github'])
    .withMessage('sourceType must be "paste" or "github"'),
  body('language')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Language must be a string up to 50 characters'),
  body('code')
    .if(body('sourceType').equals('paste'))
    .notEmpty()
    .withMessage('Code is required when pasting')
    .isString()
    .isLength({ max: 50000 })
    .withMessage('Code must be under 50,000 characters'),
  body('githubUrl')
    .if(body('sourceType').equals('github'))
    .notEmpty()
    .withMessage('GitHub URL is required')
    .isURL()
    .withMessage('Must be a valid URL'),
];

// Middleware to check for validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  next();
};

module.exports = { validateReviewInput, handleValidationErrors };
