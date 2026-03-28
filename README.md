# 🔍 CodeReview AI

AI-powered code review tool that finds bugs, suggests fixes, rates code quality, and auto-generates documentation.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite, Tailwind CSS v4, shadcn/ui |
| Auth | Clerk (Google Login) |
| Backend | Node.js + Express |
| Database | PostgreSQL (Neon) |
| AI | Google Gemini API |

## Project Structure

```
├── client/                 # React frontend
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Route pages
│       ├── lib/            # Utilities & API client
│       └── hooks/          # Custom React hooks
├── server/                 # Express backend
│   └── src/
│       ├── routes/         # API route definitions
│       ├── controllers/    # Route handlers
│       ├── middleware/      # Auth, validation, error handling
│       ├── services/       # Gemini AI, GitHub, DB services
│       └── db/             # Database config & schema
```

## Quick Start

### 1. Clone & Install

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 2. Configure Environment Variables

```bash
# Copy env templates
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Fill in your API keys (see Setup Guide below).

### 3. Run Database Schema

Open [Neon Dashboard](https://console.neon.tech) → SQL Editor → paste and run `server/src/db/schema.sql`.

### 4. Start Development

```bash
# Terminal 1 — Frontend
cd client && npm run dev

# Terminal 2 — Backend
cd server && npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Setup Guide

### Clerk (Google Auth)
1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Enable **Google** as a social provider
4. Copy keys to env files:
   - `VITE_CLERK_PUBLISHABLE_KEY` → `client/.env`
   - `CLERK_SECRET_KEY` → `server/.env`

### Neon (PostgreSQL)
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to `server/.env` as `DATABASE_URL`
4. Run `server/src/db/schema.sql` in the Neon SQL Editor

### Google Gemini
1. Get an API key at [aistudio.google.com](https://aistudio.google.com)
2. Add it to `server/.env` as `GEMINI_API_KEY`
