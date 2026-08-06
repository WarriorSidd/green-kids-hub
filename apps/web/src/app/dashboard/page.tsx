'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import {
  getStoredUser,
  UserSession,
  getAllUsers,
  createUserAccount,
  toggleUserActive,
  RoleType,
  ClassLevel,
  CLASS_LABELS,
  getScoreHistory,
  getTotalStats,
  getAuditLog,
  isGameUnlocked,
  setGameUnlocked,
  getAllGameLocks,
  getStudentsByClass,
  changePassword,
  showToast,
  getGroupForClass
} from '@/lib/api';
import { games } from '@/lib/catalog-data';
import {
  IconAward,
  IconBarChart,
  IconBookCheck,
  IconDownload,
  IconGamepad,
  IconPlus,
  IconStar,
  IconUsers,
  IconPlay,
  IconKey,
  IconClose,
  IconUserCheck
} from '@/components/Icons';

// Stat Card inline (avoid dynamic import issues)
function StatCard({ label, value, icon: Icon, tone }: { label: string; value: string; icon: React.ElementType; tone: string }) {
  return (
    <section className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-black text-ink">{value}</p>
        </div>
        <span className={`grid size-12 place-items-center rounded-lg ${tone}`}>
          <Icon className="size-6" />
        </span>
      </div>
    </section>
  );
}

// ─── Sub-Components ──────────────────────────────────────────────

function CreateUserModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<RoleType>('STUDENT');
  const [classLevel, setClassLevel] = useState<ClassLevel>('STANDARD_1');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      createUserAccount(email, displayName, role, role === 'STUDENT' || role === 'TEACHER' ? classLevel : undefined, password, 'SUPER_ADMIN');
      showToast('User account created: ' + displayName, 'success');
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
          <IconClose className="size-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-xl bg-purple-600 text-white">
            <IconPlus className="size-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-ink">Create User Account</h2>
            <p className="text-xs font-semibold text-slate-500">Super Admin — Account Provisioning</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700">Display Name</label>
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm font-semibold outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm font-semibold outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" required />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value as RoleType)}
                className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm font-semibold outline-none">
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            {(role === 'STUDENT' || role === 'TEACHER') && (
              <div>
                <label className="block text-xs font-bold text-slate-700">Class Level</label>
                <select value={classLevel} onChange={(e) => setClassLevel(e.target.value as ClassLevel)}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm font-semibold outline-none">
                  {Object.entries(CLASS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm font-semibold outline-none" required minLength={6} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm font-semibold outline-none" required />
            </div>
          </div>

          {error && <p className="rounded-lg bg-rose-50 p-3 text-xs font-bold text-rose-700">{error}</p>}

          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl bg-slate-100 py-2.5 text-xs font-black text-slate-700">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex-1 rounded-xl bg-purple-600 py-2.5 text-xs font-black text-white shadow-soft hover:bg-purple-700 disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ChangePasswordModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPw !== confirmPw) { setError('Passwords do not match.'); return; }
    try {
      changePassword(userId, currentPw, newPw);
      showToast('Password changed successfully!', 'success');
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to change password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100"><IconClose className="size-5" /></button>
        <h2 className="text-xl font-black text-ink">Change Password</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700">Current Password</label>
            <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm font-semibold outline-none" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700">New Password</label>
            <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm font-semibold outline-none" required minLength={6} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700">Confirm New Password</label>
            <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm font-semibold outline-none" required />
          </div>
          {error && <p className="rounded-lg bg-rose-50 p-3 text-xs font-bold text-rose-700">{error}</p>}
          <button type="submit" className="w-full rounded-xl bg-leaf py-2.5 text-xs font-black text-white shadow-soft hover:bg-emerald-600">Update Password</button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────

export default function DashboardPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'locks' | 'audit'>('overview');

  // Teacher state
  const [teacherTab, setTeacherTab] = useState<'roster' | 'games' | 'homework'>('roster');

  useEffect(() => {
    setUser(getStoredUser());
    const handleAuth = () => setUser(getStoredUser());
    window.addEventListener('gkh_auth_change', handleAuth);
    return () => window.removeEventListener('gkh_auth_change', handleAuth);
  }, []);

  const role = user?.role || 'STUDENT';

  // Refresh helpers
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

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
              <h1 className="mt-2 text-3xl font-black">Welcome back, {user?.displayName || 'User'}!</h1>
              <p className="mt-1 text-sm font-semibold text-emerald-100">
                {role === 'STUDENT' && 'Ready to complete your learning goals today?'}
                {role === 'TEACHER' && 'Manage your class performance and game access.'}
                {role === 'ADMIN' && 'Oversee platform operations and user management.'}
                {role === 'SUPER_ADMIN' && 'Full system control. All services operational.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setShowChangePw(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-xs font-black text-white backdrop-blur hover:bg-white/30">
                <IconKey className="size-4" /> Change Password
              </button>
              {role === 'SUPER_ADMIN' && (
                <button onClick={() => setShowCreateUser(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-xs font-black text-white shadow-soft hover:bg-purple-600">
                  <IconPlus className="size-4" /> Create User Account
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════ SUPER ADMIN DASHBOARD ══════════════ */}
        {role === 'SUPER_ADMIN' && <SuperAdminDashboard activeTab={activeTab} setActiveTab={setActiveTab} refreshKey={refreshKey} refresh={refresh} />}

        {/* ══════════════ ADMIN DASHBOARD ══════════════ */}
        {role === 'ADMIN' && <SuperAdminDashboard activeTab={activeTab} setActiveTab={setActiveTab} refreshKey={refreshKey} refresh={refresh} />}

        {/* ══════════════ TEACHER DASHBOARD ══════════════ */}
        {role === 'TEACHER' && <TeacherDashboard user={user} teacherTab={teacherTab} setTeacherTab={setTeacherTab} refreshKey={refreshKey} refresh={refresh} />}

        {/* ══════════════ STUDENT DASHBOARD ══════════════ */}
        {role === 'STUDENT' && <StudentDashboard user={user} />}
      </div>

      {showCreateUser && <CreateUserModal onClose={() => { setShowCreateUser(false); refresh(); }} />}
      {showChangePw && user && <ChangePasswordModal userId={user.id} onClose={() => setShowChangePw(false)} />}
    </AppShell>
  );
}

// ─── SUPER ADMIN / ADMIN DASHBOARD ──────────────────────────────

function SuperAdminDashboard({ activeTab, setActiveTab, refreshKey, refresh }: {
  activeTab: string; setActiveTab: (t: 'overview' | 'users' | 'locks' | 'audit') => void;
  refreshKey: number; refresh: () => void;
}) {
  const users = getAllUsers('SUPER_ADMIN');
  const allScores = getScoreHistory();
  const totalStudents = users.filter((u) => u.role === 'STUDENT').length;
  const totalTeachers = users.filter((u) => u.role === 'TEACHER').length;
  const totalUnlocked = getAllGameLocks().length;

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'users', label: 'Users (' + users.length + ')' },
    { key: 'locks', label: 'Game Lock Matrix' },
    { key: 'audit', label: 'Audit Log' }
  ] as const;

  return (
    <>
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2" key={refreshKey}>
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`rounded-xl px-4 py-2 text-sm font-black transition ${activeTab === tab.key ? 'bg-purple-600 text-white shadow-soft' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Users" value={String(users.length)} icon={IconUsers} tone="bg-purple-100 text-purple-700" />
          <StatCard label="Students" value={String(totalStudents)} icon={IconUserCheck} tone="bg-sky-100 text-sky-700" />
          <StatCard label="Teachers" value={String(totalTeachers)} icon={IconBookCheck} tone="bg-emerald-100 text-emerald-700" />
          <StatCard label="Games Unlocked" value={String(totalUnlocked)} icon={IconGamepad} tone="bg-amber-100 text-amber-700" />
          <StatCard label="Total Scores Recorded" value={String(allScores.length)} icon={IconBarChart} tone="bg-pink-100 text-pink-700" />
          <StatCard label="Avg Score" value={allScores.length > 0 ? String(Math.round(allScores.reduce((s, e) => s + e.score, 0) / allScores.length)) : '0'} icon={IconStar} tone="bg-yellow-100 text-yellow-700" />
        </section>
      )}

      {activeTab === 'users' && (
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-ink">User Directory</h3>
            <span className="text-xs font-bold text-slate-500">{users.length} accounts</span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-black uppercase text-slate-500">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="p-3 font-black text-ink">
                      <div className="flex items-center gap-2">
                        <span className="grid size-8 place-items-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">
                          {u.displayName.charAt(0).toUpperCase()}
                        </span>
                        {u.displayName}
                      </div>
                    </td>
                    <td className="p-3 text-xs">{u.email}</td>
                    <td className="p-3">
                      <span className={`rounded-md px-2 py-1 text-xs font-black ${
                        u.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' :
                        u.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' :
                        u.role === 'TEACHER' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>{u.role.replace('_', ' ')}</span>
                    </td>
                    <td className="p-3 text-xs">{u.classLevel ? CLASS_LABELS[u.classLevel] : '—'}</td>
                    <td className="p-3">
                      <span className={`rounded-md px-2 py-1 text-xs font-black ${u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {u.role !== 'SUPER_ADMIN' && (
                        <button onClick={() => { toggleUserActive(u.id, 'SUPER_ADMIN'); refresh(); }}
                          className={`rounded-lg px-2.5 py-1 text-xs font-black shadow-sm ${u.isActive ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}>
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'locks' && <GameLockMatrix callerRole="SUPER_ADMIN" refresh={refresh} />}

      {activeTab === 'audit' && (
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-xl font-black text-ink">Audit Log</h3>
          <div className="mt-4 max-h-[500px] overflow-y-auto space-y-2">
            {getAuditLog().slice(0, 50).map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-200 text-xs font-black text-slate-600">
                  {entry.userName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-ink">{entry.detail}</p>
                  <p className="text-xs font-semibold text-slate-500">by {entry.userName} · {new Date(entry.timestamp).toLocaleString()}</p>
                </div>
                <span className="shrink-0 rounded-md bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-600">{entry.action}</span>
              </div>
            ))}
            {getAuditLog().length === 0 && <p className="text-center text-sm font-semibold text-slate-400 py-8">No audit entries yet.</p>}
          </div>
        </section>
      )}
    </>
  );
}

// ─── GAME LOCK MATRIX ────────────────────────────────────────────

function GameLockMatrix({ callerRole, classFilter, refresh }: { callerRole: RoleType; classFilter?: ClassLevel; refresh: () => void }) {
  const classLevels: ClassLevel[] = classFilter
    ? [classFilter]
    : ['SENIOR_KG', 'STANDARD_1', 'STANDARD_2', 'STANDARD_3', 'STANDARD_4', 'STANDARD_5'];

  const handleToggle = (cl: ClassLevel, gameId: string) => {
    const current = isGameUnlocked(cl, gameId);
    setGameUnlocked(cl, gameId, !current, callerRole);
    refresh();
  };

  // Filter games to relevant group if classFilter is provided
  const filteredGames = classFilter
    ? games.filter((g) => g.group === getGroupForClass(classFilter))
    : games;

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-xl font-black text-ink">
        {classFilter ? `Game Access for ${CLASS_LABELS[classFilter]}` : 'Master Game Lock Matrix'}
      </h3>
      <p className="text-xs font-semibold text-slate-500 mt-1">
        Toggle switches to unlock games for each class level.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-black uppercase text-slate-500">
              <th className="p-3 sticky left-0 bg-slate-50">Game</th>
              <th className="p-3">Group</th>
              {classLevels.map((cl) => (
                <th key={cl} className="p-3 text-center whitespace-nowrap">{CLASS_LABELS[cl]}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
            {filteredGames.map((g) => (
              <tr key={g.id}>
                <td className="p-3 font-black text-ink whitespace-nowrap">{g.title}</td>
                <td className="p-3 text-xs">{g.group}</td>
                {classLevels.map((cl) => {
                  const unlocked = isGameUnlocked(cl, g.id);
                  return (
                    <td key={cl} className="p-3 text-center">
                      <button onClick={() => handleToggle(cl, g.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${unlocked ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                        <span className={`inline-block size-4 transform rounded-full bg-white shadow transition-transform ${unlocked ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── TEACHER DASHBOARD ───────────────────────────────────────────

function TeacherDashboard({ user, teacherTab, setTeacherTab, refreshKey: _refreshKey, refresh }: {
  user: UserSession | null;
  teacherTab: string;
  setTeacherTab: (t: 'roster' | 'games' | 'homework') => void;
  refreshKey: number;
  refresh: () => void;
}) {
  const classLevel = user?.classLevel || 'STANDARD_1';
  const students = getStudentsByClass(classLevel as ClassLevel);

  const handleExportCSV = () => {
    if (typeof window === 'undefined') return;
    const rows = [['Student Name', 'Class', 'Games Played', 'Total Score', 'Total Stars']];
    students.forEach((s) => {
      const stats = getTotalStats(s.id);
      rows.push([s.displayName, CLASS_LABELS[classLevel as ClassLevel] || classLevel, String(stats.gamesPlayed), String(stats.totalScore), String(stats.totalStars)]);
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((r) => r.join(',')).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'class-report-' + Date.now() + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV report downloaded!', 'success');
  };

  const tabs = [
    { key: 'roster', label: 'Student Roster (' + students.length + ')' },
    { key: 'games', label: 'Game Access' },
    { key: 'homework', label: 'Homework' }
  ] as const;

  return (
    <>
      {/* Teacher Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Students in Class" value={String(students.length)} icon={IconUsers} tone="bg-sky-100 text-sky-700" />
        <StatCard label="Class: " value={CLASS_LABELS[classLevel as ClassLevel] || classLevel} icon={IconBookCheck} tone="bg-emerald-100 text-emerald-700" />
        <StatCard label="Games Unlocked" value={String(getAllGameLocks().filter((l) => l.classLevel === classLevel).length)} icon={IconGamepad} tone="bg-amber-100 text-amber-700" />
        <StatCard label="Total Scores" value={String(students.reduce((sum, s) => sum + getTotalStats(s.id).totalScore, 0))} icon={IconBarChart} tone="bg-violet-100 text-violet-700" />
      </section>

      {/* Teacher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setTeacherTab(tab.key)}
              className={`rounded-xl px-4 py-2 text-sm font-black transition ${teacherTab === tab.key ? 'bg-emerald-600 text-white shadow-soft' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <button onClick={handleExportCSV}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-black text-emerald-900 shadow-sm ring-1 ring-slate-200 hover:bg-emerald-50">
          <IconDownload className="size-4" /> Export CSV
        </button>
      </div>

      {teacherTab === 'roster' && (
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-xl font-black text-ink">Student Roster — {CLASS_LABELS[classLevel as ClassLevel]}</h3>
          {students.length === 0 ? (
            <p className="mt-4 text-center text-sm font-semibold text-slate-400 py-8">No students in this class yet. Ask your Super Admin to create student accounts.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-black uppercase text-slate-500">
                    <th className="p-3">Student</th>
                    <th className="p-3">Games Played</th>
                    <th className="p-3">Total Score</th>
                    <th className="p-3">Stars Earned</th>
                    <th className="p-3">Avg Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {students.map((s) => {
                    const stats = getTotalStats(s.id);
                    return (
                      <tr key={s.id}>
                        <td className="p-3 font-black text-ink">
                          <div className="flex items-center gap-2">
                            <span className="grid size-8 place-items-center rounded-full bg-sky-100 text-xs font-black text-sky-700">
                              {s.displayName.charAt(0)}
                            </span>
                            {s.displayName}
                          </div>
                        </td>
                        <td className="p-3">{stats.gamesPlayed}</td>
                        <td className="p-3 font-black">{stats.totalScore}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <IconStar className="size-3.5 fill-yellow-400 text-yellow-400" />
                            {stats.totalStars}
                          </div>
                        </td>
                        <td className="p-3">{stats.avgAccuracy}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {teacherTab === 'games' && <GameLockMatrix callerRole="TEACHER" classFilter={classLevel as ClassLevel} refresh={refresh} />}

      {teacherTab === 'homework' && (
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-xl font-black text-ink">Homework Manager</h3>
          <p className="mt-2 text-sm font-semibold text-slate-500">Coming soon — assign games as homework with due dates and track completion.</p>
        </section>
      )}
    </>
  );
}

// ─── STUDENT DASHBOARD ───────────────────────────────────────────

function StudentDashboard({ user }: { user: UserSession | null }) {
  if (!user) return null;

  const stats = getTotalStats(user.id);
  const recentScores = getScoreHistory(user.id).slice(-5).reverse();

  // Achievement badges
  const badges = [
    { label: 'First Game', icon: '🎮', earned: stats.gamesPlayed >= 1 },
    { label: '5 Stars', icon: '⭐', earned: stats.totalStars >= 5 },
    { label: '10 Games', icon: '🏆', earned: stats.gamesPlayed >= 10 },
    { label: 'Perfect Score', icon: '💯', earned: recentScores.some((s) => s.accuracy >= 100) },
    { label: '50 Stars', icon: '🌟', earned: stats.totalStars >= 50 },
    { label: 'Score Master', icon: '👑', earned: stats.totalScore >= 500 },
  ];

  return (
    <>
      {/* Progress Banner */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Your Progress</p>
        <h2 className="mt-2 text-2xl font-black text-ink">
          {stats.gamesPlayed === 0 ? 'Get started by playing your first game!' : `You've played ${stats.gamesPlayed} games!`}
        </h2>
        {stats.gamesPlayed > 0 && (
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
              style={{ width: Math.min(100, stats.gamesPlayed * 5) + '%' }} />
          </div>
        )}
        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <StatCard label="Total Score" value={String(stats.totalScore)} icon={IconBarChart} tone="bg-emerald-100 text-emerald-700" />
          <StatCard label="Stars Earned" value={String(stats.totalStars)} icon={IconStar} tone="bg-yellow-100 text-yellow-700" />
          <StatCard label="Games Played" value={String(stats.gamesPlayed)} icon={IconGamepad} tone="bg-sky-100 text-sky-700" />
          <StatCard label="Avg Accuracy" value={stats.avgAccuracy + '%'} icon={IconAward} tone="bg-pink-100 text-pink-700" />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Recent Activity */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Recent Game Activity</p>
          {recentScores.length === 0 ? (
            <div className="mt-6 text-center py-8">
              <p className="text-sm font-semibold text-slate-400">No games played yet.</p>
              <Link href="/games" className="mt-3 inline-flex items-center gap-2 rounded-xl bg-leaf px-4 py-2.5 text-xs font-black text-white shadow-soft hover:bg-emerald-600">
                <IconPlay className="size-4" /> Browse Games
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {recentScores.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div>
                    <p className="text-sm font-black text-ink">{s.gameTitle}</p>
                    <p className="text-xs font-semibold text-slate-500">{new Date(s.playedAt).toLocaleDateString()} · {s.timeSec}s</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-emerald-700">{s.score} pts</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map((star) => (
                        <svg key={star} className={`size-4 ${star <= s.stars ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} viewBox="0 0 24 24" stroke="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Achievements */}
        <section className="rounded-2xl bg-ink p-5 text-white shadow-soft">
          <p className="text-xs font-black uppercase tracking-wide text-lime-200">Achievement Badges</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {badges.map((badge) => (
              <div key={badge.label}
                className={`flex flex-col items-center justify-center rounded-xl p-3 text-center transition ${badge.earned ? 'bg-white/10' : 'bg-white/5 opacity-40'}`}>
                <span className="text-2xl">{badge.icon}</span>
                <span className="mt-1 text-xs font-black">{badge.label}</span>
                {badge.earned && <span className="mt-0.5 text-[10px] font-bold text-lime-300">Earned!</span>}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Quick Actions */}
      <section className="grid gap-3 sm:grid-cols-2">
        <Link href="/games"
          className="flex items-center gap-4 rounded-2xl bg-emerald-50 p-5 ring-1 ring-emerald-200 hover:bg-emerald-100 transition">
          <div className="grid size-12 place-items-center rounded-xl bg-leaf text-white">
            <IconGamepad className="size-6" />
          </div>
          <div>
            <p className="text-sm font-black text-emerald-900">Browse Games</p>
            <p className="text-xs font-semibold text-emerald-700">Play unlocked games for your class</p>
          </div>
        </Link>
        <Link href="/leaderboard"
          className="flex items-center gap-4 rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-200 hover:bg-amber-100 transition">
          <div className="grid size-12 place-items-center rounded-xl bg-amber-500 text-white">
            <IconAward className="size-6" />
          </div>
          <div>
            <p className="text-sm font-black text-amber-900">Leaderboard</p>
            <p className="text-xs font-semibold text-amber-700">See top scorers in your class</p>
          </div>
        </Link>
      </section>
    </>
  );
}
