const { requireAuth, getAuth } = require('@clerk/express');

// Middleware: require authentication
const requireAuthentication = requireAuth();

// Middleware: extract user info and attach to req
const attachUser = (req, res, next) => {
  const auth = getAuth(req);
  if (!auth || !auth.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.clerkUserId = auth.userId;
  next();
};

// Middleware: require admin role (check DB)
const requireAdmin = async (req, res, next) => {
  try {
    const { getDb } = require('../db/pool');
    const sql = getDb();
    const rows = await sql`SELECT role FROM users WHERE clerk_id = ${req.clerkUserId}`;
    if (!rows.length || rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { requireAuthentication, attachUser, requireAdmin };
