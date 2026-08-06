'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import {
  getStoredUser,
  getLeaderboard,
  UserSession,
  ClassLevel,
  CLASS_LABELS
} from '@/lib/api';
import { IconStar } from '@/components/Icons';

export default function LeaderboardPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [filterClass, setFilterClass] = useState<ClassLevel | 'ALL'>('ALL');

  useEffect(() => {
    const u = getStoredUser();
    setUser(u);
    // Students default to seeing their own class
    if (u?.role === 'STUDENT' && u.classLevel) {
      setFilterClass(u.classLevel);
    }
  }, []);

  const leaderboard = getLeaderboard(filterClass === 'ALL' ? undefined : filterClass);

  const classOptions: { key: ClassLevel | 'ALL'; label: string }[] = [
    { key: 'ALL', label: 'All Classes' },
    ...Object.entries(CLASS_LABELS).map(([key, label]) => ({
      key: key as ClassLevel,
      label
    }))
  ];

  // Students can only see their own class
  const canFilterAll = user?.role !== 'STUDENT';

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { emoji: '🥇', bg: 'bg-yellow-100 ring-yellow-300' };
    if (rank === 2) return { emoji: '🥈', bg: 'bg-slate-100 ring-slate-300' };
    if (rank === 3) return { emoji: '🥉', bg: 'bg-amber-100 ring-amber-300' };
    return { emoji: String(rank), bg: 'bg-slate-50 ring-slate-200' };
  };

  return (
    <AppShell>
      <div className="grid gap-6">
        {/* Header */}
        <section className="rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white shadow-soft">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-amber-200">Rankings</p>
              <h1 className="mt-2 text-3xl font-black">🏆 Student Leaderboard</h1>
              <p className="mt-1 text-sm font-semibold text-amber-100">
                Top scorers across all educational games
              </p>
            </div>
          </div>
        </section>

        {/* Class Filter */}
        <div className="flex flex-wrap gap-2">
          {classOptions.map((opt) => {
            if (!canFilterAll && opt.key === 'ALL') return null;
            if (user?.role === 'STUDENT' && opt.key !== user.classLevel && opt.key !== 'ALL') return null;
            return (
              <button key={opt.key} onClick={() => setFilterClass(opt.key)}
                className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                  filterClass === opt.key
                    ? 'bg-amber-500 text-white shadow-soft'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}>
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Leaderboard Table */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          {leaderboard.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-4xl">🏜️</p>
              <p className="mt-3 text-sm font-bold text-slate-400">No scores yet! Play some games to get on the board.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, idx) => {
                const rank = idx + 1;
                const badge = getRankBadge(rank);
                return (
                  <div key={entry.userId}
                    className={`flex items-center gap-4 rounded-xl border p-4 transition ${
                      rank <= 3 ? 'ring-2 ' + badge.bg : 'border-slate-100 bg-white hover:bg-slate-50'
                    }`}>
                    {/* Rank */}
                    <div className={`grid size-10 shrink-0 place-items-center rounded-full ${badge.bg} ring-1 ${rank <= 3 ? '' : 'ring-slate-200'}`}>
                      <span className={`${rank <= 3 ? 'text-xl' : 'text-sm font-black text-slate-600'}`}>
                        {badge.emoji}
                      </span>
                    </div>

                    {/* Avatar & Name */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700">
                        {entry.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-ink truncate">{entry.displayName}</p>
                        {entry.classLevel && (
                          <p className="text-xs font-semibold text-slate-500">{CLASS_LABELS[entry.classLevel]}</p>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="text-center">
                        <p className="text-lg font-black text-emerald-700">{entry.totalScore}</p>
                        <p className="text-[10px] font-bold uppercase text-slate-400">Score</p>
                      </div>
                      <div className="hidden sm:block text-center">
                        <div className="flex items-center justify-center gap-1 text-amber-500">
                          <IconStar className="size-4 fill-amber-400 text-amber-400" />
                          <span className="text-lg font-black">{entry.totalStars}</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase text-slate-400">Stars</p>
                      </div>
                      <div className="hidden sm:block text-center">
                        <p className="text-lg font-black text-sky-600">{entry.gamesPlayed}</p>
                        <p className="text-[10px] font-bold uppercase text-slate-400">Games</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
