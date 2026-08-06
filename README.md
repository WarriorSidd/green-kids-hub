# Green Kids Hub Learning Portal

Green Kids Hub Learning Portal is a SaaS-grade educational gaming and learning management platform for children from Senior KG to 5th Standard.

It includes role-based access, teacher/admin dashboards, homework workflows, game approval and release controls, achievements, reporting, and a reusable educational game catalog seeded for 225 games.

## Apps

- `apps/web`: Next.js, TypeScript, Tailwind CSS student/teacher/admin portal.
- `apps/api`: NestJS, Prisma, PostgreSQL API with JWT auth, RBAC, audit logs, and reporting endpoints.
- `docs`: architecture, API, RBAC, wireframes, sprint plan, deployment, and testing strategy.

## Quick Start

```bash
npm install
copy apps\api\.env.example apps\api\.env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Default local URLs:

- Web: `http://localhost:3000`
- API: `http://localhost:4000/api`

## Authentication

Default accounts are created during database seeding. Credentials are managed securely by the system administrator. Contact your organization's Super Admin for account credentials.

Roles supported: **Super Admin**, **Admin**, **Teacher**, **Student**.

## Production Targets

- Frontend: Vercel
- Backend: Render or Railway
- Database: Neon PostgreSQL
- File storage: local initially, abstracted for future S3/R2 integration
