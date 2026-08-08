import { PrismaClient, RoleKey, ClassLevel } from '@prisma/client';
import { StoredUser, ScoreEntry, AuditEntry, RoleType } from './api';

const fallbackNeonUrl =
  'postgresql://neondb_owner:npg_s0EMeJOGf7Ca@ep-ancient-fog-axsv9cf2-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function getPrisma(): PrismaClient | null {
  if (typeof window !== 'undefined') return null;
  try {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL || fallbackNeonUrl
          }
        }
      });
    }
    return globalForPrisma.prisma;
  } catch {
    return null;
  }
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return 'h_' + Math.abs(hash).toString(36) + '_' + str.length;
}

interface GameLockEntry {
  classLevel: ClassLevel;
  gameId: string;
}

interface ServerState {
  users: StoredUser[];
  scores: ScoreEntry[];
  locks: GameLockEntry[];
  audit: AuditEntry[];
}

export async function getServerUsersAsync(): Promise<StoredUser[]> {
  const db = getPrisma();
  if (db) {
    try {
      const dbUsers = await db.user.findMany({
        include: {
          role: true,
          studentProfile: { include: { classRoom: true } },
          teacherProfile: { include: { classes: { include: { classRoom: true } } } }
        },
        orderBy: { createdAt: 'desc' }
      });

      if (dbUsers.length > 0) {
        return dbUsers.map((u) => ({
          id: u.id,
          email: u.email,
          displayName: u.displayName,
          role: u.role.key as RoleType,
          classLevel: u.studentProfile?.classRoom?.level as ClassLevel | undefined,
          studentId: u.studentProfile?.id,
          teacherId: u.teacherProfile?.id,
          passwordHash: u.passwordHash,
          isActive: u.isActive,
          createdAt: u.createdAt.toISOString()
        }));
      }
    } catch {
      // Fallback if db offline
    }
  }

  return getFallbackUsers();
}

export async function addServerUserAsync(user: StoredUser): Promise<void> {
  const db = getPrisma();
  if (db) {
    try {
      const roleRecord = await db.role.findUnique({ where: { key: user.role as RoleKey } });
      if (roleRecord) {
        let classRoomId: string | undefined;
        if (user.classLevel) {
          const classRoom = await db.classRoom.findUnique({ where: { level: user.classLevel as ClassLevel } });
          if (classRoom) classRoomId = classRoom.id;
        }

        await db.user.upsert({
          where: { email: user.email },
          update: {
            displayName: user.displayName,
            isActive: user.isActive
          },
          create: {
            email: user.email,
            displayName: user.displayName,
            passwordHash: user.passwordHash,
            roleId: roleRecord.id,
            isActive: user.isActive,
            ...(user.role === 'STUDENT'
              ? { studentProfile: { create: { classRoomId } } }
              : user.role === 'TEACHER'
              ? { teacherProfile: { create: {} } }
              : {})
          }
        });
      }
    } catch (err) {
      console.warn('[Neon DB] User create failed, fallback to local:', err);
    }
  }

  // Update in-memory fallback
  addFallbackUser(user);
}

export async function toggleServerUserActiveAsync(userId: string): Promise<StoredUser | null> {
  const db = getPrisma();
  if (db) {
    try {
      const user = await db.user.findUnique({ where: { id: userId } });
      if (user) {
        const updated = await db.user.update({
          where: { id: userId },
          data: { isActive: !user.isActive },
          include: { role: true }
        });
        return {
          id: updated.id,
          email: updated.email,
          displayName: updated.displayName,
          role: updated.role.key as RoleType,
          passwordHash: updated.passwordHash,
          isActive: updated.isActive
        };
      }
    } catch {}
  }
  return toggleFallbackUserActive(userId);
}

// ─── In-Memory Fallback State ─────────────────────────────────────

const defaultPassword = simpleHash('Admin@2026');
const now = new Date().toISOString();

const fallbackStore: ServerState = {
  users: [
    { id: 'usr-super-1', email: 'superadmin@greenkidshub.com', displayName: 'System Super Admin', role: 'SUPER_ADMIN', passwordHash: defaultPassword, isActive: true, avatar: 'lion', createdAt: now },
    { id: 'usr-admin-1', email: 'admin@greenkidshub.com', displayName: 'Rajesh Kumar', role: 'ADMIN', passwordHash: defaultPassword, isActive: true, avatar: 'owl', createdAt: now },
    { id: 'usr-teacher-1', email: 'teacher@greenkidshub.com', displayName: 'Ms. Priya Verma', role: 'TEACHER', teacherId: 'tch-1', classLevel: 'STANDARD_1', group: 'Group A', passwordHash: defaultPassword, isActive: true, avatar: 'fox', createdAt: now },
    { id: 'usr-student-1', email: 'student@greenkidshub.com', displayName: 'Aarav Sharma', role: 'STUDENT', studentId: 'std-1', classLevel: 'STANDARD_1', group: 'Group A', passwordHash: defaultPassword, isActive: true, avatar: 'panda', createdAt: now }
  ],
  scores: [],
  locks: [],
  audit: []
};

export function getFallbackUsers(): StoredUser[] {
  return fallbackStore.users;
}

export function addFallbackUser(user: StoredUser): void {
  const existingIndex = fallbackStore.users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
  if (existingIndex >= 0) {
    fallbackStore.users[existingIndex] = user;
  } else {
    fallbackStore.users.push(user);
  }
}

export function toggleFallbackUserActive(userId: string): StoredUser | null {
  const user = fallbackStore.users.find((u) => u.id === userId);
  if (user) {
    user.isActive = !user.isActive;
    return user;
  }
  return null;
}

// Legacy exports for compatibility
export function getServerUsers(): StoredUser[] { return fallbackStore.users; }
export function addServerUser(user: StoredUser): void { addFallbackUser(user); }
export function toggleServerUserActive(userId: string): StoredUser | null { return toggleFallbackUserActive(userId); }
export function getServerScores(): ScoreEntry[] { return fallbackStore.scores; }
export function addServerScore(entry: ScoreEntry): void { fallbackStore.scores.push(entry); }
export function getServerLocks(): GameLockEntry[] { return fallbackStore.locks; }
export function setServerLock(classLevel: ClassLevel, gameId: string, unlocked: boolean): void {
  if (unlocked) {
    if (!fallbackStore.locks.some((l) => l.classLevel === classLevel && l.gameId === gameId)) {
      fallbackStore.locks.push({ classLevel, gameId });
    }
  } else {
    fallbackStore.locks = fallbackStore.locks.filter((l) => !(l.classLevel === classLevel && l.gameId === gameId));
  }
}
export function getServerAudit(): AuditEntry[] { return fallbackStore.audit; }
export function addServerAudit(userId: string, userName: string, action: string, detail: string): void {
  fallbackStore.audit.unshift({
    id: 'aud_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6),
    userId,
    userName,
    action,
    detail,
    timestamp: new Date().toISOString()
  });
}
export function getServerState(): ServerState { return fallbackStore; }
