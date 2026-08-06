'use client';

import React, { useState } from 'react';
import { DEMO_ACCOUNTS, setStoredUser, UserSession } from '@/lib/api';
import { IconShieldCheck, IconUserCheck, IconKey, IconClose, IconLock } from '@/components/Icons';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('student@greenkidshub.com');
  const [password, setPassword] = useState('ChangeMe123!');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSelectAccount = (account: UserSession) => {
    setStoredUser(account);
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const matched = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase()) || {
      id: `custom-${Date.now()}`,
      email,
      displayName: email.split('@')[0] || email,
      role: 'STUDENT' as const
    } satisfies UserSession;

    setTimeout(() => {
      setStoredUser(matched);
      setLoading(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <IconClose className="size-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-xl bg-leaf text-white">
            <IconShieldCheck className="size-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-ink">Role Portal Login</h2>
            <p className="text-xs font-semibold text-slate-500">
              Select a demo role or enter account credentials
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400">
            Instant 1-Click Role Switcher
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.id}
                onClick={() => handleSelectAccount(acc)}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-emerald-500 hover:bg-emerald-50/50"
              >
                <div>
                  <span className="block text-xs font-black text-emerald-900">{acc.role}</span>
                  <span className="block text-sm font-bold text-slate-800">{acc.displayName.split(' ')[0]}</span>
                </div>
                <IconUserCheck className="size-5 text-emerald-600" />
              </button>
            ))}
          </div>
        </div>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-bold text-slate-400">OR LOGIN WITH CREDS</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700">Email Address</label>
            <div className="mt-1 flex items-center rounded-lg border border-slate-200 px-3 py-2">
              <IconKey className="size-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ml-2 w-full text-sm font-semibold text-ink outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700">Password</label>
            <div className="mt-1 flex items-center rounded-lg border border-slate-200 px-3 py-2">
              <IconLock className="size-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ml-2 w-full text-sm font-semibold text-ink outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-leaf py-3 font-black text-white shadow-soft transition hover:bg-emerald-600 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
