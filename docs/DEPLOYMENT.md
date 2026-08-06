# Deployment Instructions

## Local Docker

```bash
docker compose up --build
```

## Neon PostgreSQL

1. Create a Neon project.
2. Copy the pooled connection string.
3. Set `DATABASE_URL` in Render/Railway.
4. Run `pnpm db:migrate && pnpm db:seed`.

## Backend on Render or Railway

- Root directory: repository root.
- Build command: `npm install && npm run db:generate && npm --workspace @gkh/api run build`
- Start command: `npm --workspace @gkh/api run start`
- Required environment variables are listed in `apps/api/.env.example`.

## Frontend on Vercel

- Project root: `apps/web`
- Build command: `npm --workspace @gkh/web run build`
- Environment variable: `NEXT_PUBLIC_API_URL=https://your-api-host/api`

## Production Checklist

- Replace JWT secrets.
- Enable HTTPS-only cookies when refresh token storage moves to cookies.
- Configure CORS to production web domain.
- Set database backups.
- Create first super admin securely.
- Turn on audit log retention policy.
