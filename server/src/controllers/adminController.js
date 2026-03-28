const { getDb } = require('../db/pool');

// GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const sql = getDb();

    const [userCount] = await sql`SELECT COUNT(*) as count FROM users`;
    const [reviewCount] = await sql`SELECT COUNT(*) as count FROM reviews`;
    const [avgScore] = await sql`SELECT ROUND(AVG(quality_score), 1) as avg FROM reviews WHERE quality_score IS NOT NULL`;
    const [bugCount] = await sql`SELECT COUNT(*) as count FROM review_issues WHERE type = 'bug'`;

    res.json({
      totalUsers: parseInt(userCount.count),
      totalReviews: parseInt(reviewCount.count),
      avgQualityScore: avgScore.avg ? parseFloat(avgScore.avg) : null,
      totalBugs: parseInt(bugCount.count),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT u.*, COUNT(r.id) as review_count, ROUND(AVG(r.quality_score), 1) as avg_score
      FROM users u
      LEFT JOIN reviews r ON u.id = r.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `;
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/reviews
const getAllReviews = async (req, res, next) => {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT r.id, r.title, r.language, r.source_type, r.quality_score, r.created_at,
             u.email, u.first_name, u.last_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
      LIMIT 100
    `;
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getAllUsers, getAllReviews };
