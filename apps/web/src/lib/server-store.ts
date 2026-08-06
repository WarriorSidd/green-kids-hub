import { StoredUser, ScoreEntry, AuditEntry, ClassLevel, RoleType } from './api';

// Simple password hashing helper matching api.ts
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

const defaultPassword = simpleHash('Admin@2026');
const now = new Date().toISOString();

// Global in-memory server store for Vercel instances
// Using globalThis to preserve state across hot module reloads in Node runtime
const globalForStore = globalThis as unknown as {
  gkhServerStore: ServerState | undefined;
};

function getInitialStore(): ServerState {
  return {
    users: [
      {
        id: 'usr-super-1',
        email: 'superadmin@greenkidshub.com',
        displayName: 'System Super Admin',
        role: 'SUPER_ADMIN',
        passwordHash: defaultPassword,
        isActive: true,
        avatar: 'lion',
        createdAt: now
      },
      {
        id: 'usr-admin-1',
        email: 'admin@greenkidshub.com',
        displayName: 'Rajesh Kumar',
        role: 'ADMIN',
        passwordHash: defaultPassword,
        isActive: true,
        avatar: 'owl',
        createdAt: now
      },
      {
        id: 'usr-teacher-1',
        email: 'teacher@greenkidshub.com',
        displayName: 'Ms. Priya Verma',
        role: 'TEACHER',
        teacherId: 'tch-1',
        classLevel: 'STANDARD_1',
        group: 'Group A',
        passwordHash: defaultPassword,
        isActive: true,
        avatar: 'fox',
        createdAt: now
      },
      {
        id: 'usr-student-1',
        email: 'student@greenkidshub.com',
        displayName: 'Aarav Sharma',
        role: 'STUDENT',
        studentId: 'std-1',
        classLevel: 'STANDARD_1',
        group: 'Group A',
        passwordHash: defaultPassword,
        isActive: true,
        avatar: 'panda',
        createdAt: now
      }
    ],
    scores: [],
    locks: [],
    audit: []
  };
}

export const serverStore = globalForStore.gkhServerStore ?? getInitialStore();

if (process.env.NODE_ENV !== 'production') {
  globalForStore.gkhServerStore = serverStore;
}

export function getServerUsers(): StoredUser[] {
  return serverStore.users;
}

export function addServerUser(user: StoredUser): void {
  const existingIndex = serverStore.users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
  if (existingIndex >= 0) {
    serverStore.users[existingIndex] = user;
  } else {
    serverStore.users.push(user);
  }
}

export function toggleServerUserActive(userId: string): StoredUser | null {
  const user = serverStore.users.find((u) => u.id === userId);
  if (user) {
    user.isActive = !user.isActive;
    return user;
  }
  return null;
}

export function getServerScores(): ScoreEntry[] {
  return serverStore.scores;
}

export function addServerScore(entry: ScoreEntry): void {
  serverStore.scores.push(entry);
}

export function getServerLocks(): GameLockEntry[] {
  return serverStore.locks;
}

export function setServerLock(classLevel: ClassLevel, gameId: string, unlocked: boolean): void {
  if (unlocked) {
    if (!serverStore.locks.some((l) => l.classLevel === classLevel && l.gameId === gameId)) {
      serverStore.locks.push({ classLevel, gameId });
    }
  } else {
    serverStore.locks = serverStore.locks.filter((l) => !(l.classLevel === classLevel && l.gameId === gameId));
  }
}

export function getServerAudit(): AuditEntry[] {
  return serverStore.audit;
}

export function addServerAudit(userId: string, userName: string, action: string, detail: string): void {
  serverStore.audit.unshift({
    id: 'aud_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6),
    userId,
    userName,
    action,
    detail,
    timestamp: new Date().toISOString()
  });
}

export function getServerState(): ServerState {
  return serverStore;
}
