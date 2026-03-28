const express = require('express');
const router = express.Router();
const { requireAuthentication, attachUser } = require('../middleware/auth');
const githubController = require('../controllers/githubController');

router.use(requireAuthentication, attachUser);

// GET /api/github/repo?url=... — fetch repo contents
router.get('/repo', githubController.fetchRepoContents);

module.exports = router;
