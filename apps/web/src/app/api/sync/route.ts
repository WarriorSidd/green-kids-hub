import { NextResponse } from 'next/server';
import { getServerState } from '@/lib/server-store';

export async function GET() {
  const state = getServerState();
  return NextResponse.json(state);
}
