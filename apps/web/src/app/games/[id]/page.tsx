'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AppShell } from '@/components/AppShell';

const GameEngine = dynamic(() => import('@/components/GameEngine').then((m) => m.GameEngine), {
  ssr: false
});

export default function GamePlayPage() {
  const params = useParams();
  const gameId = (params?.id as string) || 'game-1';

  return (
    <AppShell>
      <GameEngine gameId={gameId} />
    </AppShell>
  );
}
