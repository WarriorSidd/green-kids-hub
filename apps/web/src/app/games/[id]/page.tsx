'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import { getStoredUser, isGameUnlocked, UserSession, syncWithServer } from '@/lib/api';
import { games } from '@/lib/catalog-data';

const GameEngine = dynamic(() => import('@/components/GameEngine').then((m) => m.GameEngine), {
  ssr: false
});

export default function GamePlayPage() {
  const params = useParams();
  const gameId = (params?.id as string) || 'game-1';
  
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    setIsLoading(false);

    syncWithServer().then(() => {
      setUser(getStoredUser());
    });
  }, []);

  if (isLoading) {
    return (
      <AppShell>
        <div className="p-8 font-medium">Loading...</div>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell>
        <div className="flex h-full min-h-[50vh] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-xl font-black text-ink mb-4">Please log in to play games.</p>
        </div>
      </AppShell>
    );
  }

  const game = games.find((g) => g.id === gameId);
  if (!game) {
    return (
      <AppShell>
        <div className="p-8 font-medium">Game not found.</div>
      </AppShell>
    );
  }

  const isStudent = user.role === 'STUDENT';
  const unlocked = !isStudent || isGameUnlocked(user.classLevel, game.id);

  if (!unlocked) {
    return (
      <AppShell>
        <div className="flex h-full min-h-[50vh] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-2xl font-black text-ink mb-2">This game is locked.</p>
          <p className="text-slate-600 mb-6 font-medium">Ask your teacher to unlock it for your class.</p>
          <Link href="/games" className="rounded-xl bg-leaf px-6 py-3 font-black text-white shadow-soft hover:bg-emerald-600 transition">
            Back to Games
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <GameEngine gameId={gameId} />
    </AppShell>
  );
}
