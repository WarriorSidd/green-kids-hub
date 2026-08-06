export interface UserSession {
  id: string;
  email: string;
  displayName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT';
  studentId?: string;
  teacherId?: string;
  token?: string;
}

export const DEMO_ACCOUNTS: UserSession[] = [
  {
    id: 'usr-student-1',
    email: 'student@greenkidshub.com',
    displayName: 'Aarav Sharma (Student)',
    role: 'STUDENT',
    studentId: 'std-1'
  },
  {
    id: 'usr-teacher-1',
    email: 'teacher@greenkidshub.com',
    displayName: 'Ms. Priya Verma (Teacher)',
    role: 'TEACHER',
    teacherId: 'tch-1'
  },
  {
    id: 'usr-admin-1',
    email: 'admin@greenkidshub.com',
    displayName: 'Rajesh Kumar (School Admin)',
    role: 'ADMIN'
  },
  {
    id: 'usr-super-1',
    email: 'superadmin@greenkidshub.com',
    displayName: 'System Super Admin',
    role: 'SUPER_ADMIN'
  }
];

const fallbackUser: UserSession = DEMO_ACCOUNTS[0] || {
  id: 'usr-student-1',
  email: 'student@greenkidshub.com',
  displayName: 'Student',
  role: 'STUDENT'
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export function getStoredUser(): UserSession {
  if (typeof window === 'undefined') return fallbackUser;
  const raw = localStorage.getItem('gkh_user');
  if (!raw) return fallbackUser;
  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    return fallbackUser;
  }
}

export function setStoredUser(user: UserSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('gkh_user', JSON.stringify(user));
  window.dispatchEvent(new Event('gkh_auth_change'));
}

export function clearStoredUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('gkh_user');
  window.dispatchEvent(new Event('gkh_auth_change'));
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const user = getStoredUser();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (user.token) {
    headers['Authorization'] = `Bearer ${user.token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[GKH API] Failed to reach NestJS backend at ${endpoint}. Using fallback demo state.`, err);
    throw err;
  }
}
