import { NextResponse } from 'next/server';
import { getServerLocksAsync, setServerLockAsync, addServerAudit } from '@/lib/server-store';
import { ClassLevel } from '@/lib/api';

export async function GET() {
  const locks = await getServerLocksAsync();
  return NextResponse.json(locks);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { classLevel, gameId, unlocked } = body;

    await setServerLockAsync(classLevel as ClassLevel, gameId, unlocked);
    addServerAudit(
      'server',
      'Teacher/Admin',
      unlocked ? 'UNLOCK_GAME' : 'LOCK_GAME',
      (unlocked ? 'Unlocked' : 'Locked') + ' game ' + gameId + ' for ' + classLevel
    );

    return NextResponse.json({ classLevel, gameId, unlocked });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to update game lock' }, { status: 500 });
  }
}
