# API Design

Base URL: `/api`

## Authentication

- `POST /auth/login`: email and password, returns user, access token, refresh token.
- `POST /auth/refresh`: refresh token, returns a new token pair.

## Users

- `GET /users/students?classRoomId=`: list students. Requires `students.view_all`.
- `GET /users/teachers`: list teachers and class assignments. Requires `teachers.manage`.

## Games

- `GET /games?group=&category=&status=`: list games. Requires `games.play`.
- `PATCH /games/:id/submit`: draft to pending approval. Requires `games.create`.
- `PATCH /games/:id/approve`: pending approval to approved. Requires `games.approve`.
- `PATCH /games/:id/lock`: approved to locked with release date. Requires `games.unlock`.
- `PATCH /games/:id/unlock`: approved or locked to unlocked. Requires `games.unlock`.

## Homework

- `GET /homework/class/:classRoomId`: class homework. Requires `homework.view`.
- `POST /homework/:id/submit`: submit student homework. Requires `homework.submit`.

## Reports

- `GET /reports/overview`: platform analytics. Requires `reports.view`.
- `GET /reports/class/:classRoomId/progress`: class progress. Requires `reports.view`.

## Export Strategy

CSV, Excel, and PDF exports should be implemented in the reports module as async jobs for large classes. Small exports can stream directly from API endpoints.
