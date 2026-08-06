export const permissions = {
  MANAGE_PLATFORM: 'platform.manage',
  MANAGE_USERS: 'users.manage',
  MANAGE_TEACHERS: 'teachers.manage',
  MANAGE_ADMINS: 'admins.manage',
  MANAGE_PERMISSIONS: 'permissions.manage',
  VIEW_ALL_STUDENTS: 'students.view_all',
  VIEW_ASSIGNED_STUDENTS: 'students.view_assigned',
  MANAGE_STUDENTS: 'students.manage',
  CREATE_GAMES: 'games.create',
  APPROVE_GAMES: 'games.approve',
  UNLOCK_GAMES: 'games.unlock',
  PLAY_GAMES: 'games.play',
  MANAGE_CONTENT: 'content.manage',
  VIEW_HOMEWORK: 'homework.view',
  ASSIGN_HOMEWORK: 'homework.assign',
  APPROVE_HOMEWORK: 'homework.approve',
  SUBMIT_HOMEWORK: 'homework.submit',
  VIEW_SCORES: 'scores.view',
  VIEW_REPORTS: 'reports.view',
  EXPORT_REPORTS: 'reports.export',
  VIEW_TEACHER_ACTIVITY: 'teacher_activity.view',
  MANAGE_SETTINGS: 'settings.manage'
} as const;

export type PermissionKey = (typeof permissions)[keyof typeof permissions];
