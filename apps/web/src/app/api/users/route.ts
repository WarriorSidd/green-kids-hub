import { NextResponse } from 'next/server';
import { getServerUsersAsync, addServerUserAsync, addServerAudit } from '@/lib/server-store';
import { StoredUser, RoleType, ClassLevel, LearningGroup } from '@/lib/api';

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return 'h_' + Math.abs(hash).toString(36) + '_' + str.length;
}

const CLASS_TO_GROUP: Record<ClassLevel, LearningGroup> = {
  SENIOR_KG: 'Group A',
  STANDARD_1: 'Group A',
  STANDARD_2: 'Group B',
  STANDARD_3: 'Group B',
  STANDARD_4: 'Group C',
  STANDARD_5: 'Group C'
};

const AVATARS = ['bear', 'bunny', 'cat', 'dog', 'elephant', 'fox', 'giraffe', 'koala', 'lion', 'owl', 'panda', 'penguin'];

export async function GET() {
  const users = await getServerUsersAsync();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, displayName, role, classLevel, password } = body;

    if (!email || !displayName || !role || !password) {
      return NextResponse.json({ error: 'Missing required user fields' }, { status: 400 });
    }

    const users = await getServerUsersAsync();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 400 });
    }

    const newUser: StoredUser = {
      id: 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7),
      email: email.toLowerCase(),
      displayName,
      role: role as RoleType,
      classLevel: classLevel as ClassLevel | undefined,
      group: classLevel ? CLASS_TO_GROUP[classLevel as ClassLevel] : undefined,
      studentId: role === 'STUDENT' ? 'std_' + Date.now().toString(36) : undefined,
      teacherId: role === 'TEACHER' ? 'tch_' + Date.now().toString(36) : undefined,
      passwordHash: simpleHash(password),
      isActive: true,
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)] || 'panda',
      createdAt: new Date().toISOString()
    };

    await addServerUserAsync(newUser);
    addServerAudit('server', 'Super Admin', 'CREATE_USER', 'Created user account: ' + displayName + ' (' + role + ')');

    return NextResponse.json(newUser, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create user' },
      { status: 500 }
    );
  }
}
