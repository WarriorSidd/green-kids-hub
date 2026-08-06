'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import { categories, games as initialGames, groups } from '@/lib/catalog';
import { CalendarClock, Lock, Play, Search, Star, Sparkles } from 'lucide-react';

export default function GamesPage() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = initialGames.filter((game) => {
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
              <Search size={18} className="text-slate-400" />
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
                  <Icon size={20} />
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
          {filteredGames.map((game) => (
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
                    <Star size={14} className="fill-amber-500" /> {game.stars}/3
                  </span>
                </div>
                <p className="mt-2 text-xs font-medium text-slate-600 leading-relaxed">
                  {game.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ${
                    game.status === 'Locked'
                      ? 'bg-slate-100 text-slate-500'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {game.status === 'Locked' ? <Lock size={14} /> : <Sparkles size={14} />}
                  {game.status}
                </span>

                {game.status === 'Locked' ? (
                  <button
                    disabled
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-200 px-4 py-2 text-xs font-black text-slate-500 cursor-not-allowed"
                  >
                    <Lock size={14} /> Locked
                  </button>
                ) : (
                  <Link
                    href={`/games/${game.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-leaf px-4 py-2 text-xs font-black text-white shadow-soft transition hover:bg-emerald-600"
                  >
                    <Play size={14} /> Play Now
                  </Link>
                )}
              </div>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
