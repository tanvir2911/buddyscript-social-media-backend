# Backend (Express + TypeScript)

## Overview
This service exposes REST APIs for authentication, posts, comments, replies, and likes. It uses Express, TypeScript, Prisma, and PostgreSQL. The app follows a layered structure (routes → controllers → services → repositories) with centralized validation and error handling.

## Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL database

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `env.example` to `.env` and fill in the variables (database connection string, JWT secret, optional Cloudinary credentials).
3. Generate the Prisma client and run migrations if needed:
   ```bash
   npx prisma generate
   # npx prisma migrate deploy   # when migrations are present
   ```

## Available Scripts
- `npm run dev` – Start the development server with hot reload (`ts-node-dev`).
- `npm run build` – Type-check and compile TypeScript to `dist/`.
- `npm start` – Run the compiled server (`node dist/server.js`).
- `npm run prisma:<cmd>` – You can run standard Prisma commands such as `npx prisma studio`, `npx prisma migrate dev`, etc.

## Environment Variables
`env.example` documents every variable the server expects. At a minimum you must provide:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign authentication tokens |
| `JWT_EXPIRES_IN` | Token lifespan (e.g., `7d`) |
| `PORT` | Server port (default 5000) |

Optional Cloudinary keys enable image uploads for posts.

## Running
```bash
npm run dev
# or
npm run build && npm start
```

The API is served at `http://localhost:<PORT>/api`. Key routes include:
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET/POST/PUT/DELETE /api/posts`
- `GET/POST/PUT/DELETE /api/comments`
- `POST /api/likes/{post|comment|reply}/:id`

Refer to `DOCUMENTATION.md` in the repo root for a full architectural breakdown.

