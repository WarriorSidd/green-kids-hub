'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getStoredUser, UserSession } from '@/lib/api';
import { IconBell, IconGraduationCap, IconLogIn, IconUserCheck } from '@/components/Icons';

const LoginModal = dynamic(() => import('@/components/LoginModal').then((m) => m.LoginModal), {
  ssr: false
});

const nav = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/games', label: 'Games' }
] as const;

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());

    const handleAuthChange = () => {
      setUser(getStoredUser());
    };

    window.addEventListener('gkh_auth_change', handleAuthChange);
    return () => window.removeEventListener('gkh_auth_change', handleAuthChange);
  }, []);

  const getRoleTone = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'TEACHER':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      default:
        return 'bg-amber-100 text-amber-900 border-amber-200';
    }
  };

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-emerald-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-lg bg-leaf text-white shadow-soft">
              <IconGraduationCap className="size-6" />
            </span>
            <span>
              <span className="block text-lg font-black text-ink">Green Kids Hub</span>
              <span className="block text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Learning Portal
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-2 rounded-lg bg-emerald-50 p-1 sm:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-4 py-2 text-sm font-bold text-emerald-900 hover:bg-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user && (
              <div
                className={`hidden md:flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-black ${getRoleTone(
                  user.role
                )}`}
              >
                <IconUserCheck className="size-4" />
                <span>{user.displayName}</span>
              </div>
            )}

            <button
              onClick={() => setIsLoginOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-3.5 py-2 text-xs font-black text-white shadow-sm hover:bg-emerald-900"
            >
              <IconLogIn className="size-4" />
              <span>Switch Role</span>
            </button>

            <button
              aria-label="Notifications"
              className="grid size-10 place-items-center rounded-lg bg-white text-ink shadow-sm ring-1 ring-slate-200"
            >
              <IconBell className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</div>

      {isLoginOpen && <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />}
    </main>
  );
}
