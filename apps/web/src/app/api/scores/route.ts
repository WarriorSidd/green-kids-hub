import { NextResponse } from 'next/server';
import { getServerScores, addServerScore } from '@/lib/server-store';
import { ScoreEntry } from '@/lib/api';

export async function GET() {
  const scores = getServerScores();
  return NextResponse.json(scores);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, gameId, gameTitle, score, stars, timeSec, accuracy } = body;

    const entry: ScoreEntry = {
      id: 'score_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6),
      userId,
      gameId,
      gameTitle,
      score,
      stars: Math.min(stars, 3),
      timeSec,
      accuracy: Math.round(accuracy * 100) / 100,
      playedAt: new Date().toISOString()
    };

    addServerScore(entry);
    return NextResponse.json(entry, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to save score' }, { status: 500 });
  }
}
