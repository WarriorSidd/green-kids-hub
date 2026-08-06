# RBAC Design

## Roles

- Super Admin: all permissions.
- Admin: manage assigned platform operations, reports, homework approval, students, teachers, content release.
- Teacher: configurable permissions and only assigned class/student data.
- Student: play games, submit homework, view own achievements and progress.

## Permission Examples

- `students.view_all`
- `students.view_assigned`
- `homework.view`
- `homework.assign`
- `scores.view`
- `reports.view`
- `reports.export`
- `games.create`
- `games.approve`
- `games.unlock`

## Data Scoping

Permissions answer "may this user perform this action?" Data scoping answers "which records can this user see?" Teacher endpoints should always join through `TeacherClass` or explicit student assignment. Students should query only by their authenticated student profile.

## Audit Events

Audit these actions:

- login
- user creation and deactivation
- role permission changes
- game submit, approve, lock, unlock, archive
- homework assign, submit, review, complete
- report export
- settings change
