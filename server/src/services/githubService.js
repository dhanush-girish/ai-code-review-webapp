const axios = require('axios');

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Parse a GitHub URL into owner and repo.
 * Supports: https://github.com/owner/repo
 */
function parseGitHubUrl(url) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error('Invalid GitHub URL');
  return { owner: match[1], repo: match[2].replace('.git', '') };
}

/**
 * Fetch all code files from a GitHub repo (public, no auth needed).
 * Limits to common code files and reasonable sizes.
 */
async function fetchRepoCode(url) {
  const { owner, repo } = parseGitHubUrl(url);

  // Get repo tree recursively
  const treeUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/main?recursive=1`;
  let treeResponse;

  try {
    treeResponse = await axios.get(treeUrl);
  } catch {
    // Try 'master' branch if 'main' fails
    const fallbackUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/master?recursive=1`;
    treeResponse = await axios.get(fallbackUrl);
  }

  const codeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.go', '.rb', '.php', '.c', '.cpp', '.h', '.rs'];
  const codeFiles = treeResponse.data.tree
    .filter((item) => item.type === 'blob' && codeExtensions.some((ext) => item.path.endsWith(ext)))
    .filter((item) => item.size < 50000) // Skip huge files
    .slice(0, 20); // Limit to 20 files

  // Fetch file contents
  let combinedCode = '';
  for (const file of codeFiles) {
    try {
      const contentUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${file.path}`;
      const resp = await axios.get(contentUrl, {
        headers: { Accept: 'application/vnd.github.v3.raw' },
      });
      combinedCode += `\n// ===== FILE: ${file.path} =====\n${resp.data}\n`;
    } catch {
      // Skip files that can't be fetched
    }
  }

  if (!combinedCode.trim()) {
    throw new Error('No code files found in the repository');
  }

  // Truncate if too long for LLM context
  const MAX_CHARS = 30000;
  if (combinedCode.length > MAX_CHARS) {
    combinedCode = combinedCode.substring(0, MAX_CHARS) + '\n// ... [truncated for analysis]';
  }

  return combinedCode;
}

module.exports = { fetchRepoCode, parseGitHubUrl };
