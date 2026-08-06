'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import { StatCard } from '@/components/StatCard';
import { getStoredUser, UserSession } from '@/lib/api';
import { downloadCSV } from '@/lib/reports';
import { games } from '@/lib/catalog';
import {
  Award,
  BarChart3,
  BookCheck,
  CheckCircle2,
  Download,
  Gamepad2,
  Lock,
  Plus,
  ShieldCheck,
  Star,
  Unlock,
  Users,
  AlertTriangle,
  Play
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<UserSession | null>(null);

  // Homework creation state
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [hwTitle, setHwTitle] = useState('Brain Builder Week 2');
  const [hwDueDate, setHwDueDate] = useState('2026-08-15');
  const [hwGameId, setHwGameId] = useState(games[0].id);
  const [homeworkList, setHomeworkList] = useState([
    {
      id: 'hw-1',
      title: 'Brain Builder Week 1',
      dueDate: 'in 4 days',
      gameTitle: 'Memory Garden Match',
      gameId: 'game-1',
      status: 'PENDING'
    }
  ]);

  // Admin content workflow state
  const [gameStatuses, setGameStatuses] = useState<Record<string, string>>({
    'game-1': 'Unlocked',
    'game-2': 'Unlocked',
    'game-3': 'Approved',
    'game-4': 'Locked',
    'game-5': 'Unlocked',
    'game-6': 'Pending Approval'
  });

  useEffect(() => {
    setUser(getStoredUser());
    const handleAuth = () => setUser(getStoredUser());
    window.addEventListener('gkh_auth_change', handleAuth);
    return () => window.removeEventListener('gkh_auth_change', handleAuth);
  }, []);

  const handleAddHomework = (e: React.FormEvent) => {
    e.preventDefault();
    const game = games.find((g) => g.id === hwGameId) || games[0];
    setHomeworkList([
      ...homeworkList,
      {
        id: `hw-${Date.now()}`,
        title: hwTitle,
        dueDate: `Due ${hwDueDate}`,
        gameTitle: game.title,
        gameId: game.id,
        status: 'PENDING'
      }
    ]);
    setShowHomeworkModal(false);
  };

  const handleExportCSV = () => {
    const rows = [
      ['Student Name', 'Class', 'Games Played', 'Average Score %', 'Homework Status'],
      ['Aarav Sharma', 'Standard 1', '34', '86%', 'Completed'],
      ['Ananya Gupta', 'Standard 1', '28', '92%', 'Completed'],
      ['Rohan Verma', 'Standard 1', '19', '64%', 'Overdue (Needs Attention)']
    ];
    downloadCSV(`class-performance-${Date.now()}.csv`, rows);
  };

  const updateGameStatus = (id: string, newStatus: string) => {
    setGameStatuses({ ...gameStatuses, [id]: newStatus });
  };

  const role = user?.role || 'STUDENT';

  return (
    <AppShell>
      <div className="grid gap-6">
        {/* Banner */}
        <section className="rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-900 p-6 text-white shadow-soft">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <span className="rounded-full bg-emerald-700/60 px-3 py-1 text-xs font-black uppercase text-emerald-200">
                Active Role: {role.replace('_', ' ')}
              </span>
              <h1 className="mt-2 text-3xl font-black">Welcome back, {user?.displayName || 'Student'}!</h1>
              <p className="mt-1 text-sm font-semibold text-emerald-100">
                {role === 'STUDENT' && 'Ready to complete your learning goals today?'}
                {role === 'TEACHER' && 'Classroom score trends are up +12% this week.'}
                {role === 'ADMIN' && 'Content approval queue has 1 game pending review.'}
                {role === 'SUPER_ADMIN' && 'System audit log active. All services operational.'}
              </p>
            </div>
            {role === 'TEACHER' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowHomeworkModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-leaf px-4 py-2.5 text-xs font-black text-white shadow-soft hover:bg-emerald-600"
                >
                  <Plus size={16} /> Assign Homework
                </button>
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-emerald-900 shadow-sm hover:bg-emerald-50"
                >
                  <Download size={16} /> Export Class Report
                </button>
              </div>
            )}
          </div>
        </section>

        {/* STUDENT WORKSPACE */}
        {role === 'STUDENT' && (
          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Weekly Progress</p>
              <h2 className="mt-2 text-2xl font-black text-ink">Learning Path Completion: 68%</h2>
              <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[68%] rounded-full bg-leaf" />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <StatCard label="Games Played" value="34" icon={Gamepad2} tone="bg-emerald-100 text-emerald-700" />
                <StatCard label="Stars" value="86" icon={Star} tone="bg-yellow-100 text-yellow-700" />
                <StatCard label="Badges" value="7" icon={Award} tone="bg-pink-100 text-pink-700" />
              </div>
            </div>

            <div className="rounded-2xl bg-ink p-5 text-white shadow-soft">
              <p className="text-xs font-black uppercase tracking-wide text-lime-200">Assigned Homework</p>
              {homeworkList.map((hw) => (
                <div key={hw.id} className="mt-3 border-t border-slate-700/60 pt-3">
                  <h3 className="text-xl font-black">{hw.title}</h3>
                  <p className="text-xs font-semibold text-slate-300">
                    Attached Game: {hw.gameTitle} · {hw.dueDate}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/games/${hw.gameId}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-sun px-3.5 py-2 text-xs font-black text-yellow-950 shadow-soft"
                    >
                      <Play size={14} /> Launch Game
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TEACHER WORKSPACE */}
        {role === 'TEACHER' && (
          <section className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-ink">Class Analytics & Performance</h3>
                <BarChart3 className="text-emerald-700" />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <StatCard label="Assigned Students" value="31" icon={Users} tone="bg-sky-100 text-sky-700" />
                <StatCard label="Homework Completed" value="82%" icon={BookCheck} tone="bg-lime-100 text-lime-700" />
                <StatCard label="Average Score" value="78%" icon={BarChart3} tone="bg-violet-100 text-violet-700" />
              </div>

              <div className="mt-6 rounded-xl bg-rose-50 p-4 border border-rose-100">
                <div className="flex items-center gap-2 text-rose-900 font-black">
                  <AlertTriangle size={18} /> Students Needing Attention
                </div>
                <div className="mt-3 grid gap-2">
                  {[
                    'Rohan Verma — Overdue homework & low focus score on fractions',
                    'Kavya Patel — Needs 2nd attempt on pattern recognition sequencing'
                  ].map((item) => (
                    <div key={item} className="rounded-lg bg-white p-3 text-xs font-bold text-rose-800 shadow-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-xl font-black text-ink">Active Assignments</h3>
              <div className="mt-4 space-y-3">
                {homeworkList.map((hw) => (
                  <div key={hw.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-black uppercase text-emerald-800">{hw.dueDate}</p>
                    <p className="mt-1 text-sm font-black text-ink">{hw.title}</p>
                    <p className="text-xs font-semibold text-slate-500">{hw.gameTitle}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ADMIN WORKSPACE — CONTENT APPROVAL & RELEASE CALENDAR */}
        {(role === 'ADMIN' || role === 'SUPER_ADMIN') && (
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-xl font-black text-ink">Game Approval & Release Governance</h3>
            <p className="text-xs font-semibold text-slate-500">
              Manage status transitions: Draft → Pending Approval → Approved → Locked → Unlocked
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-black uppercase text-slate-500">
                    <th className="p-3">Game Title</th>
                    <th className="p-3">Group</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Current Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {games.map((g) => {
                    const currentStatus = gameStatuses[g.id] || g.status;
                    return (
                      <tr key={g.id}>
                        <td className="p-3 font-black text-ink">{g.title}</td>
                        <td className="p-3">{g.group}</td>
                        <td className="p-3">{g.category}</td>
                        <td className="p-3">
                          <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-800">
                            {currentStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          {currentStatus !== 'Unlocked' && (
                            <button
                              onClick={() => updateGameStatus(g.id, 'Unlocked')}
                              className="rounded-lg bg-leaf px-2.5 py-1 text-xs font-black text-white shadow-sm"
                            >
                              Unlock Game
                            </button>
                          )}
                          {currentStatus !== 'Locked' && (
                            <button
                              onClick={() => updateGameStatus(g.id, 'Locked')}
                              className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-900"
                            >
                              Lock
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* HOMEWORK CREATOR MODAL */}
        {showHomeworkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <h2 className="text-2xl font-black text-ink">Assign New Homework</h2>
              <form onSubmit={handleAddHomework} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Assignment Title</label>
                  <input
                    type="text"
                    value={hwTitle}
                    onChange={(e) => setHwTitle(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm font-semibold outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Due Date</label>
                  <input
                    type="date"
                    value={hwDueDate}
                    onChange={(e) => setHwDueDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm font-semibold outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Attach Educational Game</label>
                  <select
                    value={hwGameId}
                    onChange={(e) => setHwGameId(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm font-semibold outline-none"
                  >
                    {games.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title} ({g.group})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowHomeworkModal(false)}
                    className="flex-1 rounded-xl bg-slate-100 py-2.5 text-xs font-black text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-leaf py-2.5 text-xs font-black text-white shadow-soft"
                  >
                    Create Assignment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
