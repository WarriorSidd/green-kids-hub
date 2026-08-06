# Deployment Report

## Current Status

- Dependencies installed with npm.
- Prisma schema validates.
- Prisma client generation succeeds.
- Lint passes.
- Production builds pass for API and frontend.
- API health endpoint works at `/api/health`.
- Anonymous RBAC protection works: `/api/games` returns `401`.
- Frontend `/dashboard` and `/games` pages return `200`.

## Blockers

- No reachable PostgreSQL database is configured in this environment.
- Docker is not installed on this machine.
- Vercel, Render, Railway, and Neon account credentials are not available in this shell.

## Required Secrets

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CORS_ORIGIN`
- `NEXT_PUBLIC_API_URL`
- Vercel token or logged-in Vercel CLI session
- Render/Railway token or logged-in CLI session

## Verified Commands

```bash
npm install
npm run db:generate
npm --workspace @gkh/api run prisma -- validate
npm run lint
npm run build
```

## Runtime Smoke Test

- `GET /api/health`: `200`
- `GET /api/games` without token: `401`
- `POST /api/auth/login`: blocked by missing database
- `GET /dashboard`: `200`
- `GET /games`: `200`

## Finish Steps After Database Provisioning

```bash
set DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
npm run db:migrate
npm run db:seed
npm run build
```

Then deploy:

```bash
vercel --cwd apps/web --prod
```

Render can be deployed from `render.yaml`.
