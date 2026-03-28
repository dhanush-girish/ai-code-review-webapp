const { getDb } = require('../db/pool');
const aiService = require('../services/aiService');
const githubService = require('../services/githubService');

// POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    const sql = getDb();
    const { sourceType, language, code, githubUrl, title } = req.body;

    // Ensure user exists in DB (upsert from Clerk)
    await sql`
      INSERT INTO users (clerk_id) VALUES (${req.clerkUserId})
      ON CONFLICT (clerk_id) DO NOTHING
    `;
    const userRows = await sql`SELECT id FROM users WHERE clerk_id = ${req.clerkUserId}`;
    const userId = userRows[0].id;

    // Get code content
    let codeContent = code;
    if (sourceType === 'github') {
      codeContent = await githubService.fetchRepoCode(githubUrl);
    }

    // Analyze with AI using Groq
    const aiResult = await aiService.analyzeCode(codeContent, language || 'javascript');

    // Save review to DB
    const reviewRows = await sql`
      INSERT INTO reviews (user_id, title, language, source_type, source_url, code_content, quality_score, summary, documentation, raw_ai_response)
      VALUES (${userId}, ${title || 'Code Review'}, ${language || 'javascript'}, ${sourceType}, ${githubUrl || null}, ${codeContent}, ${aiResult.qualityScore}, ${aiResult.summary}, ${aiResult.documentation}, ${JSON.stringify(aiResult)})
      RETURNING id
    `;
    const reviewId = reviewRows[0].id;

    // Save issues
    if (aiResult.issues && aiResult.issues.length > 0) {
      for (const issue of aiResult.issues) {
        await sql`
          INSERT INTO review_issues (review_id, type, severity, title, description, line_number, original_code, suggested_code)
          VALUES (${reviewId}, ${issue.type}, ${issue.severity}, ${issue.title}, ${issue.description}, ${issue.lineNumber || null}, ${issue.originalCode || null}, ${issue.suggestedCode || null})
        `;
      }
    }

    res.status(201).json({ id: reviewId, ...aiResult });
  } catch (error) {
    next(error);
  }
};

// GET /api/reviews
const getUserReviews = async (req, res, next) => {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT r.id, r.title, r.language, r.source_type, r.quality_score, r.created_at,
             (SELECT COUNT(*) FROM review_issues WHERE review_id = r.id AND type = 'bug') as bug_count
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE u.clerk_id = ${req.clerkUserId}
      ORDER BY r.created_at DESC
    `;
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// GET /api/reviews/:id
const getReviewById = async (req, res, next) => {
  try {
    const sql = getDb();
    const { id } = req.params;

    const reviewRows = await sql`
      SELECT r.* FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = ${id} AND u.clerk_id = ${req.clerkUserId}
    `;

    if (!reviewRows.length) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const issues = await sql`
      SELECT * FROM review_issues WHERE review_id = ${id} ORDER BY severity DESC
    `;

    res.json({ ...reviewRows[0], issues });
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview, getUserReviews, getReviewById };
