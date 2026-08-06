import { NextResponse } from 'next/server';
import { getServerUsersAsync, getServerScores, getServerLocks, getServerAudit } from '@/lib/server-store';

export async function GET() {
  const users = await getServerUsersAsync();
  const scores = getServerScores();
  const locks = getServerLocks();
  const audit = getServerAudit();

  return NextResponse.json({
    users,
    scores,
    locks,
    audit
  });
}
