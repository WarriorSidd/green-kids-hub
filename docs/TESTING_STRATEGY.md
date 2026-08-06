# Testing Strategy

## API

- Unit tests for auth token issuance, RBAC guard decisions, game workflow transitions, and homework status transitions.
- Integration tests with a test PostgreSQL database for Prisma queries and data scoping.
- Contract tests for public API DTO validation.

## Web

- Component tests for dashboard cards, game filters, login, class selection, and homework controls.
- Playwright E2E tests for student, teacher, admin, and super admin journeys.
- Accessibility checks with keyboard navigation and color contrast.

## Data and Security

- Seed count assertions: Group A 50, Group B 75, Group C 100.
- Teacher scoping tests to confirm teachers cannot see unassigned students.
- Student scoping tests to confirm students cannot see other students.
- Rate limit and invalid JWT tests.

## Release Gates

- TypeScript compile.
- Lint.
- Unit tests.
- E2E smoke tests.
- Prisma migration validation.
- Dependency audit.
