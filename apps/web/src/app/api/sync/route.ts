import { NextResponse } from 'next/server';
import { getServerUsersAsync, getServerScores, getServerLocksAsync, getServerAudit } from '@/lib/server-store';

export async function GET() {
  const users = await getServerUsersAsync();
  const scores = getServerScores();
  const locks = await getServerLocksAsync();
  const audit = getServerAudit();

  return NextResponse.json({
    users,
    scores,
    locks,
    audit
  });
}
