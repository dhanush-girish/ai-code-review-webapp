const axios = require('axios');

// Fetch repo contents from GitHub API
const fetchRepoContents = async (req, res, next) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'GitHub URL is required' });
    }

    // Parse GitHub URL: https://github.com/owner/repo
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      return res.status(400).json({ error: 'Invalid GitHub URL format' });
    }

    const [, owner, repo] = match;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/`;

    const response = await axios.get(apiUrl, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    res.json(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Repository not found or is private' });
    }
    next(error);
  }
};

module.exports = { fetchRepoContents };
