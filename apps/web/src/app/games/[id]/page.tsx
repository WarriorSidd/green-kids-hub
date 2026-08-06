'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { GameEngine } from '@/components/GameEngine';
import { games } from '@/lib/catalog';

export default function GamePlayPage() {
  const params = useParams();
  const gameId = params.id as string;

  const game = games.find((g) => g.id === gameId || g.slug === gameId) || games[0];

  return (
    <AppShell>
      <GameEngine game={game} />
    </AppShell>
  );
}
