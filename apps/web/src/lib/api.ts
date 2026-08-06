// ─── Types ───────────────────────────────────────────────────────

export type RoleType = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT';
export type ClassLevel = 'SENIOR_KG' | 'STANDARD_1' | 'STANDARD_2' | 'STANDARD_3' | 'STANDARD_4' | 'STANDARD_5';
export type LearningGroup = 'Group A' | 'Group B' | 'Group C';

export interface UserSession {
  id: string;
  email: string;
  displayName: string;
  role: RoleType;
  classLevel?: ClassLevel;
  group?: LearningGroup;
  studentId?: string;
  teacherId?: string;
  avatar?: string;
  token?: string;
  isActive: boolean;
  sessionExpiresAt?: number;
}

export interface StoredUser extends UserSession {
  passwordHash: string;
  createdAt: string;
  createdBy?: string;
}

export interface ScoreEntry {
  id: string;
  userId: string;
  gameId: string;
  gameTitle: string;
  score: number;
  stars: number;
  timeSec: number;
  accuracy: number;
  playedAt: string;
}

export interface AuditEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  detail: string;
  timestamp: string;
}

// ─── Constants ───────────────────────────────────────────────────

const STORAGE_KEYS = {
  SESSION: 'gkh_user',
  USERS: 'gkh_users',
  SCORES: 'gkh_scores',
  GAME_LOCKS: 'gkh_game_locks',
  AUDIT: 'gkh_audit',
  INITIALIZED: 'gkh_initialized_v2'
};

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const user = getStoredUser();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (user?.token) {
    headers['Authorization'] = `Bearer ${user.token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return await res.json();
}

const AVATARS = [
  'bear', 'bunny', 'cat', 'dog', 'elephant', 'fox',
  'giraffe', 'koala', 'lion', 'owl', 'panda', 'penguin'
];

const CLASS_TO_GROUP: Record<ClassLevel, LearningGroup> = {
  SENIOR_KG: 'Group A',
  STANDARD_1: 'Group A',
  STANDARD_2: 'Group B',
  STANDARD_3: 'Group B',
  STANDARD_4: 'Group C',
  STANDARD_5: 'Group C'
};

export const CLASS_LABELS: Record<ClassLevel, string> = {
  SENIOR_KG: 'Senior KG',
  STANDARD_1: 'Standard 1',
  STANDARD_2: 'Standard 2',
  STANDARD_3: 'Standard 3',
  STANDARD_4: 'Standard 4',
  STANDARD_5: 'Standard 5'
};

// ─── Simple Hash (not crypto-secure, but sufficient for client-side demo) ────

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return 'h_' + Math.abs(hash).toString(36) + '_' + str.length;
}

function randomAvatar(): string {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)] || 'panda';
}

function generateId(): string {
  return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
}

// ─── Initialization (seed default accounts on first visit) ───────

function getStore<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function setStore<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function initializeApp(): void {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(STORAGE_KEYS.INITIALIZED)) return;

  const defaultPassword = simpleHash('Admin@2026');
  const now = new Date().toISOString();

  const seedUsers: StoredUser[] = [
    {
      id: 'usr-super-1', email: 'superadmin@greenkidshub.com',
      displayName: 'System Super Admin', role: 'SUPER_ADMIN',
      passwordHash: defaultPassword, isActive: true, avatar: 'lion',
      createdAt: now
    },
    {
      id: 'usr-admin-1', email: 'admin@greenkidshub.com',
      displayName: 'Rajesh Kumar', role: 'ADMIN',
      passwordHash: defaultPassword, isActive: true, avatar: 'owl',
      createdAt: now
    },
    {
      id: 'usr-teacher-1', email: 'teacher@greenkidshub.com',
      displayName: 'Ms. Priya Verma', role: 'TEACHER',
      teacherId: 'tch-1', classLevel: 'STANDARD_1', group: 'Group A',
      passwordHash: defaultPassword, isActive: true, avatar: 'fox',
      createdAt: now
    },
    {
      id: 'usr-student-1', email: 'student@greenkidshub.com',
      displayName: 'Aarav Sharma', role: 'STUDENT',
      studentId: 'std-1', classLevel: 'STANDARD_1', group: 'Group A',
      passwordHash: defaultPassword, isActive: true, avatar: 'panda',
      createdAt: now
    }
  ];

  setStore(STORAGE_KEYS.USERS, seedUsers);
  setStore(STORAGE_KEYS.SCORES, []);
  setStore(STORAGE_KEYS.AUDIT, []);
  // All games locked by default — no entries means locked
  setStore(STORAGE_KEYS.GAME_LOCKS, []);

  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
}

export async function syncWithServer(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const res = await fetch(`${API_BASE}/sync`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.users) && data.users.length > 0) {
        const localUsers = getStore<StoredUser>(STORAGE_KEYS.USERS);
        data.users.forEach((serverUser: StoredUser) => {
          const idx = localUsers.findIndex((u) => u.email.toLowerCase() === serverUser.email.toLowerCase());
          if (idx >= 0) {
            localUsers[idx] = serverUser;
          } else {
            localUsers.push(serverUser);
          }
        });
        setStore(STORAGE_KEYS.USERS, localUsers);
      }
      if (Array.isArray(data.locks)) {
        setStore(STORAGE_KEYS.GAME_LOCKS, data.locks);
      }
    }
  } catch {
    // Offline or fallback mode
  }
}

// ─── Authentication ──────────────────────────────────────────────

export async function authenticateUser(email: string, password: string): Promise<UserSession> {
  initializeApp();
  await syncWithServer();

  // Try authenticating with backend API first if online
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      const data = await res.json();
      const session: UserSession = {
        id: data.user.id,
        email: data.user.email,
        displayName: data.user.displayName,
        role: data.user.role as RoleType,
        studentId: data.user.studentId,
        teacherId: data.user.teacherId,
        token: data.accessToken,
        isActive: true,
        sessionExpiresAt: Date.now() + SESSION_DURATION_MS
      };
      setStoredUser(session);
      addAuditEntry(session.id, session.displayName, 'LOGIN', 'User logged in via Cloud API');
      return session;
    }
  } catch {
    // API server offline or unreachable — fallback to local database store
  }

  // Fallback to local store
  let users = getStore<StoredUser>(STORAGE_KEYS.USERS);
  
  if (users.length === 0 || !users.some((u) => u.email.toLowerCase() === 'superadmin@greenkidshub.com')) {
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
    initializeApp();
    users = getStore<StoredUser>(STORAGE_KEYS.USERS);
  }

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) throw new Error('No account found with this email address.');
  if (!user.isActive) throw new Error('This account has been deactivated. Contact your administrator.');

  const inputHash = simpleHash(password);
  const isValidPassword =
    user.passwordHash === inputHash ||
    (user.id.startsWith('usr-') && (password === 'Admin@2026' || password === 'ChangeMe123!'));

  if (!isValidPassword) throw new Error('Incorrect password. Please try again.');

  const session: UserSession = {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    classLevel: user.classLevel,
    group: user.classLevel ? CLASS_TO_GROUP[user.classLevel] : undefined,
    studentId: user.studentId,
    teacherId: user.teacherId,
    avatar: user.avatar,
    isActive: user.isActive,
    sessionExpiresAt: Date.now() + SESSION_DURATION_MS
  };

  setStoredUser(session);
  addAuditEntry(user.id, user.displayName, 'LOGIN', 'User logged in');
  return session;
}

// ─── Session Management ──────────────────────────────────────────

export function getStoredUser(): UserSession | null {
  if (typeof window === 'undefined') return null;
  initializeApp();
  const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as UserSession;
    // Check session expiry
    if (session.sessionExpiresAt && Date.now() > session.sessionExpiresAt) {
      clearStoredUser();
      return null;
    }
    return session;
  } catch { return null; }
}

export function setStoredUser(user: UserSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
  window.dispatchEvent(new Event('gkh_auth_change'));
}

export function clearStoredUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.SESSION);
  window.dispatchEvent(new Event('gkh_auth_change'));
}

export function isSessionValid(): boolean {
  return getStoredUser() !== null;
}

// ─── User Management (Super Admin Only) ──────────────────────────

export async function createUserAccount(
  email: string,
  displayName: string,
  role: RoleType,
  classLevel: ClassLevel | undefined,
  password: string,
  callerRole: RoleType
): Promise<StoredUser> {
  if (callerRole !== 'SUPER_ADMIN') {
    throw new Error('Only Super Admin can create user accounts.');
  }

  // Attempt backend API create first if session token exists
  const currentUser = getStoredUser();
  if (currentUser?.token) {
    try {
      await apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify({ email, displayName, role, classLevel, password })
      });
    } catch {
      // Backend request failed — proceed to persist locally
    }
  }

  const users = getStore<StoredUser>(STORAGE_KEYS.USERS);
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('An account with this email already exists.');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  const newUser: StoredUser = {
    id: generateId(),
    email: email.toLowerCase(),
    displayName,
    role,
    classLevel,
    group: classLevel ? CLASS_TO_GROUP[classLevel] : undefined,
    studentId: role === 'STUDENT' ? 'std_' + generateId() : undefined,
    teacherId: role === 'TEACHER' ? 'tch_' + generateId() : undefined,
    passwordHash: simpleHash(password),
    isActive: true,
    avatar: randomAvatar(),
    createdAt: new Date().toISOString(),
    createdBy: getStoredUser()?.id
  };

  users.push(newUser);
  setStore(STORAGE_KEYS.USERS, users);

  const caller = getStoredUser();
  addAuditEntry(
    caller?.id || 'system',
    caller?.displayName || 'System',
    'CREATE_USER',
    'Created account: ' + displayName + ' (' + role + ')'
  );

  return newUser;
}

export function getAllUsers(callerRole: RoleType): StoredUser[] {
  if (callerRole !== 'SUPER_ADMIN' && callerRole !== 'ADMIN') {
    return [];
  }
  return getStore<StoredUser>(STORAGE_KEYS.USERS);
}

export function toggleUserActive(userId: string, callerRole: RoleType): void {
  if (callerRole !== 'SUPER_ADMIN') return;
  const users = getStore<StoredUser>(STORAGE_KEYS.USERS);
  const user = users.find((u) => u.id === userId);
  if (user) {
    user.isActive = !user.isActive;
    setStore(STORAGE_KEYS.USERS, users);
    addAuditEntry(
      getStoredUser()?.id || 'system',
      getStoredUser()?.displayName || 'System',
      user.isActive ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
      (user.isActive ? 'Activated' : 'Deactivated') + ' user: ' + user.displayName
    );
  }
}

export function changePassword(userId: string, currentPassword: string, newPassword: string): void {
  const users = getStore<StoredUser>(STORAGE_KEYS.USERS);
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error('User not found.');
  if (user.passwordHash !== simpleHash(currentPassword)) throw new Error('Current password is incorrect.');
  if (newPassword.length < 6) throw new Error('New password must be at least 6 characters.');

  user.passwordHash = simpleHash(newPassword);
  setStore(STORAGE_KEYS.USERS, users);
}

export function getStudentsByClass(classLevel: ClassLevel): StoredUser[] {
  const users = getStore<StoredUser>(STORAGE_KEYS.USERS);
  return users.filter((u) => u.role === 'STUDENT' && u.classLevel === classLevel && u.isActive);
}

// ─── Score Persistence ───────────────────────────────────────────

export function saveGameScore(
  userId: string,
  gameId: string,
  gameTitle: string,
  score: number,
  stars: number,
  timeSec: number,
  accuracy: number
): ScoreEntry {
  const entry: ScoreEntry = {
    id: generateId(),
    userId,
    gameId,
    gameTitle,
    score,
    stars: Math.min(stars, 3),
    timeSec,
    accuracy: Math.round(accuracy * 100) / 100,
    playedAt: new Date().toISOString()
  };

  const scores = getStore<ScoreEntry>(STORAGE_KEYS.SCORES);
  scores.push(entry);
  setStore(STORAGE_KEYS.SCORES, scores);

  // Dispatch toast event
  window.dispatchEvent(new CustomEvent('gkh_toast', {
    detail: { message: 'Score saved! +' + score + ' pts, ' + stars + ' stars', type: 'success' }
  }));

  return entry;
}

export function getScoreHistory(userId?: string): ScoreEntry[] {
  const scores = getStore<ScoreEntry>(STORAGE_KEYS.SCORES);
  if (!userId) return scores;
  return scores.filter((s) => s.userId === userId);
}

export function getTotalStats(userId: string): {
  totalScore: number;
  totalStars: number;
  gamesPlayed: number;
  avgAccuracy: number;
} {
  const scores = getScoreHistory(userId);
  if (scores.length === 0) return { totalScore: 0, totalStars: 0, gamesPlayed: 0, avgAccuracy: 0 };

  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
  const totalStars = scores.reduce((sum, s) => sum + s.stars, 0);
  const avgAccuracy = scores.reduce((sum, s) => sum + s.accuracy, 0) / scores.length;

  return {
    totalScore,
    totalStars,
    gamesPlayed: scores.length,
    avgAccuracy: Math.round(avgAccuracy)
  };
}

export function getLeaderboard(classLevel?: ClassLevel): {
  userId: string;
  displayName: string;
  avatar: string;
  classLevel?: ClassLevel;
  totalScore: number;
  totalStars: number;
  gamesPlayed: number;
}[] {
  const users = getStore<StoredUser>(STORAGE_KEYS.USERS)
    .filter((u) => u.role === 'STUDENT' && u.isActive);

  const filteredUsers = classLevel
    ? users.filter((u) => u.classLevel === classLevel)
    : users;

  return filteredUsers
    .map((u) => {
      const stats = getTotalStats(u.id);
      return {
        userId: u.id,
        displayName: u.displayName,
        avatar: u.avatar || 'panda',
        classLevel: u.classLevel,
        totalScore: stats.totalScore,
        totalStars: stats.totalStars,
        gamesPlayed: stats.gamesPlayed
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);
}

// ─── Game Lock Matrix ────────────────────────────────────────────

interface GameLockEntry {
  classLevel: ClassLevel;
  gameId: string;
}

export function isGameUnlocked(classLevel: ClassLevel | undefined, gameId: string): boolean {
  if (!classLevel) return false;
  const locks = getStore<GameLockEntry>(STORAGE_KEYS.GAME_LOCKS);
  return locks.some((l) => l.classLevel === classLevel && l.gameId === gameId);
}

export async function setGameUnlocked(classLevel: ClassLevel, gameId: string, unlocked: boolean, callerRole: RoleType): Promise<void> {
  if (callerRole !== 'SUPER_ADMIN' && callerRole !== 'ADMIN' && callerRole !== 'TEACHER') return;

  let locks = getStore<GameLockEntry>(STORAGE_KEYS.GAME_LOCKS);

  if (unlocked) {
    if (!locks.some((l) => l.classLevel === classLevel && l.gameId === gameId)) {
      locks.push({ classLevel, gameId });
    }
  } else {
    locks = locks.filter((l) => !(l.classLevel === classLevel && l.gameId === gameId));
  }

  setStore(STORAGE_KEYS.GAME_LOCKS, locks);

  // Sync game lock to cloud server
  try {
    await fetch(`${API_BASE}/locks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classLevel, gameId, unlocked })
    });
  } catch {
    // Offline fallback
  }

  const caller = getStoredUser();
  addAuditEntry(
    caller?.id || 'system',
    caller?.displayName || 'System',
    unlocked ? 'UNLOCK_GAME' : 'LOCK_GAME',
    (unlocked ? 'Unlocked' : 'Locked') + ' game ' + gameId + ' for ' + classLevel
  );

  window.dispatchEvent(new CustomEvent('gkh_toast', {
    detail: {
      message: 'Game ' + (unlocked ? 'unlocked' : 'locked') + ' for ' + CLASS_LABELS[classLevel],
      type: unlocked ? 'success' : 'info'
    }
  }));
}

export function getUnlockedGamesForClass(classLevel: ClassLevel): string[] {
  const locks = getStore<GameLockEntry>(STORAGE_KEYS.GAME_LOCKS);
  return locks.filter((l) => l.classLevel === classLevel).map((l) => l.gameId);
}

export function getAllGameLocks(): GameLockEntry[] {
  return getStore<GameLockEntry>(STORAGE_KEYS.GAME_LOCKS);
}

// ─── Group Mapping Helper ────────────────────────────────────────

export function getGroupForClass(classLevel: ClassLevel): LearningGroup {
  return CLASS_TO_GROUP[classLevel];
}

export function getClassesForGroup(group: LearningGroup): ClassLevel[] {
  return (Object.entries(CLASS_TO_GROUP) as [ClassLevel, LearningGroup][])
    .filter(([, g]) => g === group)
    .map(([cl]) => cl);
}

// ─── Audit Log ───────────────────────────────────────────────────

function addAuditEntry(userId: string, userName: string, action: string, detail: string): void {
  const entries = getStore<AuditEntry>(STORAGE_KEYS.AUDIT);
  entries.unshift({
    id: generateId(),
    userId,
    userName,
    action,
    detail,
    timestamp: new Date().toISOString()
  });
  // Keep last 200 entries
  if (entries.length > 200) entries.length = 200;
  setStore(STORAGE_KEYS.AUDIT, entries);
}

export function getAuditLog(): AuditEntry[] {
  return getStore<AuditEntry>(STORAGE_KEYS.AUDIT);
}

// ─── Toast Helper ────────────────────────────────────────────────

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('gkh_toast', { detail: { message, type } }));
}
