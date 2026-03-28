-- ============================================
-- AI Code Review Tool — Database Schema
-- Run this SQL in your Neon dashboard SQL Editor
-- ============================================

-- Users table (synced from Clerk)
CREATE TABLE IF NOT EXISTS users (
  id              SERIAL PRIMARY KEY,
  clerk_id        VARCHAR(255) UNIQUE NOT NULL,
  email           VARCHAR(255),
  first_name      VARCHAR(255),
  last_name       VARCHAR(255),
  avatar_url      TEXT,
  role            VARCHAR(20) DEFAULT 'user',  -- 'user' or 'admin'
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title           VARCHAR(500),
  language        VARCHAR(50) NOT NULL,
  source_type     VARCHAR(20) NOT NULL,         -- 'paste' or 'github'
  source_url      TEXT,                          -- GitHub URL if applicable
  code_content    TEXT NOT NULL,                 -- the submitted code
  quality_score   INTEGER CHECK (quality_score BETWEEN 1 AND 10),
  summary         TEXT,                          -- AI-generated summary
  documentation   TEXT,                          -- AI-generated docs
  raw_ai_response JSONB,                         -- Full AI JSON response
  created_at      TIMESTAMP DEFAULT NOW()
);

-- Issues/bugs found in reviews
CREATE TABLE IF NOT EXISTS review_issues (
  id              SERIAL PRIMARY KEY,
  review_id       INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
  type            VARCHAR(20) NOT NULL,          -- 'bug', 'improvement', 'suggestion'
  severity        VARCHAR(10) NOT NULL,          -- 'low', 'medium', 'high'
  title           VARCHAR(500) NOT NULL,
  description     TEXT NOT NULL,
  line_number     INTEGER,
  original_code   TEXT,                          -- before
  suggested_code  TEXT,                          -- after
  created_at      TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_review_issues_review_id ON review_issues(review_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
