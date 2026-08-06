# System Architecture

## Product Scope

Green Kids Hub Learning Portal is an educational gaming LMS for Senior KG to 5th Standard. It serves students, teachers, administrators, and super administrators. Parents use the student account and do not have separate identities.

## High-Level Architecture

- Frontend: Next.js app router, TypeScript, Tailwind CSS, mobile-first UI.
- Backend: NestJS modular API with validation, rate limiting, JWT auth, RBAC guards, audit logs, and service boundaries.
- Database: PostgreSQL with Prisma ORM.
- Storage: local upload directory initially, abstracted for future cloud object storage.
- Deployment: Vercel for web, Render/Railway for API, Neon PostgreSQL for database.

## Module Boundaries

- Auth: login, refresh tokens, password hashing, token issuance.
- RBAC: role-permission matrix and request guards.
- Users: students, teachers, admins, class assignment, teacher-class scoping.
- Games: reusable templates, approval workflow, release scheduling, permanent unlock behavior.
- Homework: assignments, due dates, attached games, submissions, review states.
- Achievements: stars, badges, certificates, award criteria.
- Reports: student progress, class progress, teacher performance, homework completion, game analytics, exports.
- Notifications: student homework alerts and operational messages.
- Settings: branding, release rules, future feature flags.

## Game Approval Workflow

`DRAFT -> PENDING_APPROVAL -> APPROVED -> LOCKED -> UNLOCKED -> ARCHIVED`

Locked games unlock when the release date is reached. After a game becomes unlocked, the platform never relocks it automatically.

## Learning Groups

- Group A: Senior KG and 1st Standard.
- Group B: 2nd and 3rd Standard.
- Group C: 4th and 5th Standard.

## Future-Ready Extensions

Mobile apps can consume the same API. AI story generation, AI quiz generation, voice narration, attendance, fees, multiple branches, and video learning should be added as independent modules with their own permissions and audit events.
