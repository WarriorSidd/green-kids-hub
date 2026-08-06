'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/AppShell';

export default function GamePlayPage() {
  const params = useParams();
  const gameId = (params?.id as string) || 'game-1';

  return (
    <AppShell>
      <div>Game Play Page: {gameId}</div>
    </AppShell>
  );
}
