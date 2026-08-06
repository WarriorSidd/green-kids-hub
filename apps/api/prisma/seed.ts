import { PrismaClient, ClassLevel, GameStatus, GameType, LearningGroup, RoleKey } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { permissions } from '../src/rbac/permissions';

const prisma = new PrismaClient();

const categories = [
  ['english', 'English', 'Phonics, vocabulary, reading, comprehension, and grammar practice.'],
  ['mathematics', 'Mathematics', 'Numbers, operations, shapes, measurement, fractions, and problem solving.'],
  ['science', 'Science', 'Plants, animals, bodies, materials, weather, space, and experiments.'],
  ['general-knowledge', 'General Knowledge', 'World awareness, community helpers, culture, places, and facts.'],
  ['brain-development', 'Brain Development', 'Memory, attention, pattern recognition, observation, and spatial thinking.'],
  ['logic-development', 'Logic Development', 'Reasoning, classification, if-then thinking, and deduction.'],
  ['coding-basics', 'Coding Basics', 'Sequencing, algorithms, loops, events, and debugging.'],
  ['creativity', 'Creativity', 'Drawing prompts, storytelling, music, design, and imagination.'],
  ['emotional-intelligence', 'Emotional Intelligence', 'Feelings, empathy, kindness, self-control, and choices.'],
  ['memory-improvement', 'Memory Improvement', 'Recall, paired association, auditory memory, and visual memory.'],
  ['focus-concentration', 'Focus & Concentration', 'Sustained attention, selective attention, and impulse control.'],
  ['problem-solving', 'Problem Solving', 'Word problems, strategy tasks, puzzles, and decision making.']
] as const;

const gameTypes = Object.values(GameType);

const classLevelsByGroup: Record<LearningGroup, ClassLevel[]> = {
  GROUP_A: [ClassLevel.SENIOR_KG, ClassLevel.STANDARD_1],
  GROUP_B: [ClassLevel.STANDARD_2, ClassLevel.STANDARD_3],
  GROUP_C: [ClassLevel.STANDARD_4, ClassLevel.STANDARD_5]
};

const gameCounts: Record<LearningGroup, number> = {
  GROUP_A: 50,
  GROUP_B: 75,
  GROUP_C: 100
};

const brainActivities = [
  'Memory Garden Match',
  'Pattern Path Builder',
  'Tiny Detective Observation',
  'Shape Shadow Logic',
  'Sequence Train',
  'Visual Grid Recall',
  'Map the Playground',
  'Choice Quest',
  'Focus Lantern',
  'Puzzle Bridge'
];

const permissionDescriptions: Record<string, string> = {
  [permissions.MANAGE_PLATFORM]: 'Manage the whole platform',
  [permissions.MANAGE_USERS]: 'Create and update users',
  [permissions.MANAGE_TEACHERS]: 'Create and update teachers',
  [permissions.MANAGE_ADMINS]: 'Create and update admins',
  [permissions.MANAGE_PERMISSIONS]: 'Assign role permissions',
  [permissions.VIEW_ALL_STUDENTS]: 'View all students',
  [permissions.VIEW_ASSIGNED_STUDENTS]: 'View assigned students',
  [permissions.MANAGE_STUDENTS]: 'Manage student records',
  [permissions.CREATE_GAMES]: 'Create games',
  [permissions.APPROVE_GAMES]: 'Approve submitted games',
  [permissions.UNLOCK_GAMES]: 'Schedule and unlock games',
  [permissions.PLAY_GAMES]: 'Play unlocked games',
  [permissions.MANAGE_CONTENT]: 'Manage educational content',
  [permissions.VIEW_HOMEWORK]: 'View homework',
  [permissions.ASSIGN_HOMEWORK]: 'Assign homework',
  [permissions.APPROVE_HOMEWORK]: 'Review homework',
  [permissions.SUBMIT_HOMEWORK]: 'Submit homework',
  [permissions.VIEW_SCORES]: 'View scores',
  [permissions.VIEW_REPORTS]: 'View reports',
  [permissions.EXPORT_REPORTS]: 'Export reports',
  [permissions.VIEW_TEACHER_ACTIVITY]: 'Monitor teacher activity',
  [permissions.MANAGE_SETTINGS]: 'Manage platform settings'
};

async function seedRoles() {
  const allPermissions = await Promise.all(
    Object.values(permissions).map((key) =>
      prisma.permission.upsert({
        where: { key },
        update: {},
        create: { key, description: permissionDescriptions[key] ?? key }
      })
    )
  );

  const rolePermissions: Record<RoleKey, string[]> = {
    SUPER_ADMIN: Object.values(permissions),
    ADMIN: [
      permissions.MANAGE_USERS,
      permissions.MANAGE_TEACHERS,
      permissions.VIEW_ALL_STUDENTS,
      permissions.MANAGE_STUDENTS,
      permissions.APPROVE_GAMES,
      permissions.UNLOCK_GAMES,
      permissions.MANAGE_CONTENT,
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

  for (const key of Object.values(RoleKey)) {
    const role = await prisma.role.upsert({
      where: { key },
      update: { name: key.replace('_', ' ') },
      create: { key, name: key.replace('_', ' ') }
    });

    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    const grants = rolePermissions[key]!.map((permissionKey) => {
      const permission = allPermissions.find((item) => item.key === permissionKey);
      if (!permission) throw new Error(`Missing permission ${permissionKey}`);
      return { roleId: role.id, permissionId: permission.id };
    });
    await prisma.rolePermission.createMany({ data: grants });
  }
}

async function seedUsers() {
  const passwordHash = await bcrypt.hash('ChangeMe123!', 12);
  const roles = await prisma.role.findMany();
  const roleId = (key: RoleKey) => {
    const role = roles.find((item) => item.key === key);
    if (!role) throw new Error(`Missing role ${key}`);
    return role.id;
  };

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@greenkidshub.com' },
    update: {},
    create: { email: 'superadmin@greenkidshub.com', displayName: 'Green Kids Super Admin', passwordHash, roleId: roleId(RoleKey.SUPER_ADMIN) }
  });
  const admin = await prisma.user.upsert({
    where: { email: 'admin@greenkidshub.com' },
    update: {},
    create: { email: 'admin@greenkidshub.com', displayName: 'Campus Admin', passwordHash, roleId: roleId(RoleKey.ADMIN) }
  });
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@greenkidshub.com' },
    update: {},
    create: { email: 'teacher@greenkidshub.com', displayName: 'Ms. Anika Teacher', passwordHash, roleId: roleId(RoleKey.TEACHER) }
  });
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@greenkidshub.com' },
    update: {},
    create: { email: 'student@greenkidshub.com', displayName: 'Aarav Student', passwordHash, roleId: roleId(RoleKey.STUDENT) }
  });

  return { superAdmin, admin, teacherUser, studentUser };
}

async function seedClasses() {
  const classes = [
    [ClassLevel.SENIOR_KG, LearningGroup.GROUP_A, 'Senior KG'],
    [ClassLevel.STANDARD_1, LearningGroup.GROUP_A, '1st Standard'],
    [ClassLevel.STANDARD_2, LearningGroup.GROUP_B, '2nd Standard'],
    [ClassLevel.STANDARD_3, LearningGroup.GROUP_B, '3rd Standard'],
    [ClassLevel.STANDARD_4, LearningGroup.GROUP_C, '4th Standard'],
    [ClassLevel.STANDARD_5, LearningGroup.GROUP_C, '5th Standard']
  ] as const;

  return Promise.all(
    classes.map(([level, group, label]) =>
      prisma.classRoom.upsert({
        where: { level },
        update: { group, label },
        create: { level, group, label }
      })
    )
  );
}

function gameContent(group: LearningGroup, type: GameType, categorySlug: string, index: number) {
  const ageNote =
    group === 'GROUP_A'
      ? 'large visuals, short audio-friendly prompts, and 3-5 choices'
      : group === 'GROUP_B'
        ? 'multi-step prompts, reading support, and 5-8 choices'
        : 'strategy prompts, timers, explanations, and 8-12 choices';

  return {
    ageNote,
    rounds: group === 'GROUP_A' ? 5 : group === 'GROUP_B' ? 8 : 10,
    prompt: `Complete ${categorySlug.replace('-', ' ')} challenge ${index}.`,
    choices: ['A', 'B', 'C', 'D'],
    answer: 'A',
    scoring: { correct: 10, hintPenalty: 2, timeBonus: true },
    accessibility: { narrationReady: true, keyboardReady: true, reducedMotionReady: true },
    templateConfig: { type, draggable: ['DRAG_AND_DROP', 'MATCHING', 'SORTING', 'SEQUENCING'].includes(type) }
  };
}

async function seedGames() {
  const categoryRows = await Promise.all(
    categories.map(([slug, name, description]) =>
      prisma.gameCategory.upsert({
        where: { slug },
        update: { name, description },
        create: { slug, name, description }
      })
    )
  );

  for (const group of Object.values(LearningGroup)) {
    for (let i = 1; i <= gameCounts[group]; i += 1) {
      const category = categoryRows[(i - 1) % categoryRows.length]!;
      const type = gameTypes[(i - 1) % gameTypes.length]!;
      const isBrain = category.slug === 'brain-development';
      const baseTitle = isBrain ? brainActivities[(i - 1) % brainActivities.length]! : category.name;
      const title = `${baseTitle} ${group.replace('GROUP_', 'Group ')} ${i}`;
      const slug = `${group.toLowerCase()}-${category.slug}-${i}`;
      await prisma.game.upsert({
        where: { slug },
        update: {},
        create: {
          title,
          slug,
          description: `An evidence-informed ${category.name.toLowerCase()} mini-game using ${type.toLowerCase().replaceAll('_', ' ')} play.`,
          instructions: 'Read or listen to the prompt, try the activity, use hints when needed, and earn up to three stars.',
          categoryId: category.id,
          group,
          classLevels: classLevelsByGroup[group],
          type,
          status: i <= 8 ? GameStatus.UNLOCKED : i <= 12 ? GameStatus.LOCKED : GameStatus.APPROVED,
          releaseDate: i <= 12 && i > 8 ? new Date(Date.now() + i * 86_400_000) : null,
          templateKey: type.toLowerCase(),
          content: gameContent(group, type, category.slug, i),
          estimatedMinutes: group === 'GROUP_A' ? 6 : group === 'GROUP_B' ? 8 : 10,
          maxStars: 3
        }
      });
    }
  }
}

async function seedAchievements() {
  const achievements = [
    ['math-wizard', 'Math Wizard', 'Complete 20 mathematics games.', 'BADGE', 'calculator'],
    ['science-explorer', 'Science Explorer', 'Complete 15 science activities.', 'BADGE', 'flask'],
    ['reading-champion', 'Reading Champion', 'Complete 20 English games.', 'BADGE', 'book-open'],
    ['creative-thinker', 'Creative Thinker', 'Complete 10 creativity games.', 'BADGE', 'palette'],
    ['logic-master', 'Logic Master', 'Score 90% in 10 logic games.', 'CERTIFICATE', 'brain'],
    ['perfect-attendance', 'Perfect Attendance', 'Log in for 20 learning days.', 'CERTIFICATE', 'calendar-check'],
    ['homework-hero', 'Homework Hero', 'Complete 10 homework assignments on time.', 'BADGE', 'clipboard-check']
  ] as const;

  for (const [slug, name, description, kind, icon] of achievements) {
    await prisma.achievement.upsert({
      where: { slug },
      update: { name, description, kind, icon },
      create: { slug, name, description, kind, icon, criteria: { target: description } }
    });
  }
}

async function seedDemoLearning(users: Awaited<ReturnType<typeof seedUsers>>, classes: Awaited<ReturnType<typeof seedClasses>>) {
  const standard2 = classes.find((item) => item.level === ClassLevel.STANDARD_2)!;
  const teacher = await prisma.teacher.upsert({
    where: { userId: users.teacherUser.id },
    update: {},
    create: { userId: users.teacherUser.id }
  });
  await prisma.teacherClass.upsert({
    where: { teacherId_classRoomId: { teacherId: teacher.id, classRoomId: standard2.id } },
    update: {},
    create: { teacherId: teacher.id, classRoomId: standard2.id }
  });

  const student = await prisma.student.upsert({
    where: { userId: users.studentUser.id },
    update: { classRoomId: standard2.id },
    create: { userId: users.studentUser.id, classRoomId: standard2.id, totalStars: 18 }
  });

  const games = await prisma.game.findMany({ where: { group: LearningGroup.GROUP_B, status: GameStatus.UNLOCKED }, take: 3 });
  const homework = await prisma.homework.create({
    data: {
      title: 'Brain Builder Week 1',
      description: 'Complete the assigned memory, pattern, and math games.',
      dueDate: new Date(Date.now() + 5 * 86_400_000),
      classRoomId: standard2.id,
      teacherId: teacher.id,
      games: { create: games.map((game) => ({ gameId: game.id })) },
      submissions: { create: { studentId: student.id } }
    }
  });

  await prisma.notification.create({
    data: {
      userId: users.studentUser.id,
      title: 'New homework assigned',
      body: `${homework.title} is ready to play.`
    }
  });
}

async function main() {
  await seedRoles();
  const users = await seedUsers();
  const classes = await seedClasses();
  await seedGames();
  await seedAchievements();
  await seedDemoLearning(users, classes);
  await prisma.setting.upsert({
    where: { key: 'platform.branding' },
    update: { value: { name: 'Green Kids Hub', primaryColor: '#16a34a' } },
    create: { key: 'platform.branding', value: { name: 'Green Kids Hub', primaryColor: '#16a34a' } }
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
