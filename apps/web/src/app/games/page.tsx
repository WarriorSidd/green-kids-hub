'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import { games as initialGames, groups } from '@/lib/catalog-data';
import { categories } from '@/lib/catalog';
import { IconLock, IconPlay, IconStar } from '@/components/Icons';
import { getStoredUser, isGameUnlocked, UserSession, syncWithServer } from '@/lib/api';

export default function GamesPage() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    setIsLoading(false);

    // Sync latest game unlock status from cloud server
    syncWithServer().then(() => {
      setUser(getStoredUser());
    });
  }, []);

  if (isLoading) return <AppShell><div className="p-8 font-medium">Loading...</div></AppShell>;
  
  if (!user) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-black text-ink">Please log in to play games.</h2>
        </div>
      </AppShell>
    );
  }

  const isStudent = user.role === 'STUDENT';
  
  const availableGames = isStudent && user.group
    ? initialGames.filter(g => g.group === user.group)
    : initialGames;

  const filteredGames = availableGames.filter((game) => {
    const matchesGroup = !selectedGroup || game.group === selectedGroup;
    const matchesCategory = !selectedCategory || game.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesCategory && matchesSearch;
  });

  return (
    <AppShell>
      <div className="grid gap-6">
        {isStudent && user.group && (
          <div className="rounded-xl bg-emerald-100 p-4 text-emerald-800 ring-1 ring-emerald-200">
            <p className="font-bold">Welcome! You belong to {user.group}. Showing games for your level.</p>
          </div>
        )}

        {/* Header & Filter Controls */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-emerald-700">
                Learning Catalog
              </p>
              <h2 className="mt-1 text-3xl font-black text-ink">
                Approved Educational Games ({filteredGames.length})
              </h2>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm">
              <svg className="size-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search games or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 bg-transparent font-bold text-ink outline-none sm:w-64"
              />
            </div>
          </div>

          {/* Group Tabs */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedGroup(null)}
              className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                selectedGroup === null
                  ? 'bg-leaf text-white shadow-soft'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Groups
            </button>
            {groups.map((group) => (
              <button
                key={group.key}
                onClick={() => setSelectedGroup(selectedGroup === group.label ? null : group.label)}
                className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                  selectedGroup === group.label
                    ? 'bg-leaf text-white shadow-soft'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {group.label} ({group.classes})
              </button>
            ))}
          </div>
        </section>

        {/* Categories Grid */}
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 8).map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.name;
            return (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(isSelected ? null : category.name)}
                className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50 shadow-sm ring-2 ring-emerald-500'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className={`grid size-10 place-items-center rounded-lg ${category.color}`}>
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-black text-ink">{category.name}</p>
                </div>
              </button>
            );
          })}
        </section>

        {/* Game Cards Grid */}
        <section className="grid gap-4 lg:grid-cols-2">
          {filteredGames.map((game) => {
            const unlocked = !isStudent || isGameUnlocked(user.classLevel, game.id);
            const statusLabel = unlocked ? 'Unlocked' : 'Locked';

            return (
              <article
                key={game.id}
                className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-block rounded-md bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-800">
                        {game.group} · {game.category}
                      </span>
                      <h3 className="mt-2 text-xl font-black text-ink">{game.title}</h3>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-800">
                      <IconStar className="size-3.5 fill-amber-500 text-amber-500" /> {game.stars}/3
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-medium text-slate-600 leading-relaxed">
                    {game.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ${
                      !unlocked
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {statusLabel}
                  </span>

                  {!unlocked ? (
                    <button
                      disabled
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-200 px-4 py-2 text-xs font-black text-slate-500 cursor-not-allowed"
                    >
                      <IconLock className="size-3.5" /> Locked
                    </button>
                  ) : (
                    <Link
                      href={`/games/${game.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-leaf px-4 py-2 text-xs font-black text-white shadow-soft transition hover:bg-emerald-600"
                    >
                      <IconPlay className="size-3.5" /> Play Now
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}
