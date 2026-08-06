import { GameStatus, GameType, HomeworkStatus, LearningGroup, RoleKey } from '@prisma/client';
import { permissions } from '../rbac/permissions';

export const demoPassword = process.env.SEED_PASSWORD || 'SetViaSeedEnvVar';

export const demoRoles: Record<RoleKey, string[]> = {
  SUPER_ADMIN: Object.values(permissions),
  ADMIN: [
    permissions.VIEW_ALL_STUDENTS,
    permissions.MANAGE_STUDENTS,
    permissions.MANAGE_TEACHERS,
    permissions.APPROVE_GAMES,
    permissions.UNLOCK_GAMES,
    permissions.VIEW_HOMEWORK,
    permissions.APPROVE_HOMEWORK,
    permissions.VIEW_SCORES,
    permissions.VIEW_REPORTS,
    permissions.EXPORT_REPORTS,
    permissions.VIEW_TEACHER_ACTIVITY
  ],
  TEACHER: [
    permissions.VIEW_ASSIGNED_STUDENTS,
    permissions.VIEW_HOMEWORK,
    permissions.ASSIGN_HOMEWORK,
    permissions.VIEW_SCORES,
    permissions.VIEW_REPORTS,
    permissions.EXPORT_REPORTS
  ],
  STUDENT: [permissions.PLAY_GAMES, permissions.VIEW_HOMEWORK, permissions.SUBMIT_HOMEWORK]
};

export const demoUsers = [
  {
    id: 'demo-super-admin',
    email: 'superadmin@greenkidshub.com',
    displayName: 'Green Kids Super Admin',
    role: RoleKey.SUPER_ADMIN,
    roleId: RoleKey.SUPER_ADMIN
  },
  {
    id: 'demo-admin',
    email: 'admin@greenkidshub.com',
    displayName: 'Campus Admin',
    role: RoleKey.ADMIN,
    roleId: RoleKey.ADMIN
  },
  {
    id: 'demo-teacher-user',
    email: 'teacher@greenkidshub.com',
    displayName: 'Ms. Anika Teacher',
    role: RoleKey.TEACHER,
    roleId: RoleKey.TEACHER,
    teacherId: 'demo-teacher'
  },
  {
    id: 'demo-student-user',
    email: 'student@greenkidshub.com',
    displayName: 'Aarav Student',
    role: RoleKey.STUDENT,
    roleId: RoleKey.STUDENT,
    studentId: 'demo-student'
  }
];

export const demoCategories = [
  { id: 'cat-english', slug: 'english', name: 'English' },
  { id: 'cat-math', slug: 'mathematics', name: 'Mathematics' },
  { id: 'cat-science', slug: 'science', name: 'Science' },
  { id: 'cat-gk', slug: 'general-knowledge', name: 'General Knowledge' },
  { id: 'cat-brain', slug: 'brain-development', name: 'Brain Development' },
  { id: 'cat-logic', slug: 'logic-development', name: 'Logic Development' },
  { id: 'cat-coding', slug: 'coding-basics', name: 'Coding Basics' },
  { id: 'cat-creativity', slug: 'creativity', name: 'Creativity' },
  { id: 'cat-eq', slug: 'emotional-intelligence', name: 'Emotional Intelligence' },
  { id: 'cat-memory', slug: 'memory-improvement', name: 'Memory Improvement' },
  { id: 'cat-focus', slug: 'focus-concentration', name: 'Focus & Concentration' },
  { id: 'cat-problem', slug: 'problem-solving', name: 'Problem Solving' }
];

export const demoGames = [
  {
    id: 'game-1',
    title: 'Memory Garden Match',
    slug: 'memory-garden-match',
    group: LearningGroup.GROUP_A,
    status: GameStatus.UNLOCKED,
    type: GameType.MEMORY_CARDS,
    category: demoCategories[9],
    categoryId: 'cat-memory',
    estimatedMinutes: 6,
    maxStars: 3
  },
  {
    id: 'game-2',
    title: 'Pattern Path Builder',
    slug: 'pattern-path-builder',
    group: LearningGroup.GROUP_B,
    status: GameStatus.UNLOCKED,
    type: GameType.SEQUENCING,
    category: demoCategories[5],
    categoryId: 'cat-logic',
    estimatedMinutes: 8,
    maxStars: 3
  },
  {
    id: 'game-3',
    title: 'Fraction Pizza Lab',
    slug: 'fraction-pizza-lab',
    group: LearningGroup.GROUP_C,
    status: GameStatus.UNLOCKED,
    type: GameType.DRAG_AND_DROP,
    category: demoCategories[1],
    categoryId: 'cat-math',
    estimatedMinutes: 10,
    maxStars: 3
  },
  {
    id: 'game-4',
    title: 'Kind Choice Quest',
    slug: 'kind-choice-quest',
    group: LearningGroup.GROUP_A,
    status: GameStatus.UNLOCKED,
    type: GameType.INTERACTIVE_QUIZ,
    category: demoCategories[8],
    categoryId: 'cat-eq',
    estimatedMinutes: 6,
    maxStars: 3
  },
  {
    id: 'game-5',
    title: 'Debug the Robot Steps',
    slug: 'debug-the-robot-steps',
    group: LearningGroup.GROUP_C,
    status: GameStatus.UNLOCKED,
    type: GameType.SORTING,
    category: demoCategories[6],
    categoryId: 'cat-coding',
    estimatedMinutes: 9,
    maxStars: 3
  },
  {
    id: 'game-6',
    title: 'Tiny Detective Observation',
    slug: 'tiny-detective-observation',
    group: LearningGroup.GROUP_B,
    status: GameStatus.UNLOCKED,
    type: GameType.TIMED_CHALLENGE,
    category: demoCategories[10],
    categoryId: 'cat-focus',
    estimatedMinutes: 7,
    maxStars: 3
  }
];

export const demoHomework = [
  {
    id: 'homework-brain-builder-week-1',
    title: 'Brain Builder Week 1',
    description: 'Complete the assigned memory, pattern, and math games.',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    classRoomId: 'demo-class-standard-2',
    teacherId: 'demo-teacher',
    games: demoGames.slice(0, 3).map((game) => ({ game })),
    submissions: [
      {
        id: 'submission-demo-student',
        studentId: 'demo-student',
        homeworkId: 'homework-brain-builder-week-1',
        status: HomeworkStatus.PENDING
      }
    ]
  }
];

export const demoStudents = [
  {
    id: 'demo-student',
    user: { id: 'demo-student-user', displayName: 'Aarav Student', email: 'student@greenkidshub.com' },
    classRoom: { id: 'demo-class-standard-2', label: '2nd Standard', group: LearningGroup.GROUP_B },
    totalStars: 18
  }
];

export const demoTeachers = [
  {
    id: 'demo-teacher',
    user: { id: 'demo-teacher-user', displayName: 'Ms. Anika Teacher', email: 'teacher@greenkidshub.com' },
    classes: [{ classRoom: { id: 'demo-class-standard-2', label: '2nd Standard', group: LearningGroup.GROUP_B } }]
  }
];

export const isDemoMode = () => process.env.DEMO_MODE === 'true';
