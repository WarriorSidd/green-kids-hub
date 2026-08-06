'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getStoredUser, clearStoredUser, UserSession, isSessionValid } from '@/lib/api';
import { IconLogIn, IconGamepad, IconAward, IconBarChart, IconClose, IconGraduationCap } from '@/components/Icons';

const LoginModal = dynamic(() => import('@/components/LoginModal'), { ssr: false });
const ToastProvider = dynamic(() => import('@/components/Toast').then((m) => m.ToastProvider), { ssr: false });

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkSession = () => {
      if (isSessionValid()) {
        setUser(getStoredUser());
      } else {
        setUser(null);
      }
    };

    checkSession();

    const handleAuthChange = () => checkSession();
    window.addEventListener('gkh_auth_change', handleAuthChange);
    return () => window.removeEventListener('gkh_auth_change', handleAuthChange);
  }, []);

  const handleSignOut = () => {
    clearStoredUser();
    setUser(null);
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: IconBarChart },
    { name: 'Games', href: '/games', icon: IconGamepad },
    { name: 'Leaderboard', href: '/leaderboard', icon: IconAward },
  ];

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-ink">
        <header className="sticky top-0 z-40 w-full backdrop-blur bg-white/90 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="bg-leaf p-2 rounded-xl group-hover:scale-105 transition-transform shadow-soft">
                    <IconGraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-bold text-xl tracking-tight text-emerald-800">Green Kids Hub</span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* User Actions */}
              <div className="hidden md:flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-semibold text-slate-900">{user.displayName}</span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 capitalize">
                        {user.role}
                      </span>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm ${user.role === 'TEACHER' ? 'bg-indigo-500' : 'bg-sun text-slate-900'}`}>
                      {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user.displayName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors ml-2"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="flex items-center gap-2 bg-leaf hover:bg-emerald-600 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-soft"
                  >
                    <IconLogIn className="w-4 h-4" />
                    Sign In
                  </button>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <IconClose className="block h-6 w-6" />
                  ) : (
                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200 bg-white">
              <div className="pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5 text-slate-400" />
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="pt-4 pb-4 border-t border-slate-200">
                {user ? (
                  <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm ${user.role === 'TEACHER' ? 'bg-indigo-500' : 'bg-sun text-slate-900'}`}>
                        {user.avatar ? (
                          <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          user.displayName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="text-base font-medium text-slate-800">{user.displayName}</div>
                        <div className="text-sm font-medium text-emerald-600 capitalize">{user.role}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-sm font-medium text-slate-500 hover:text-red-600"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="px-4">
                    <button
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex w-full justify-center items-center gap-2 bg-leaf hover:bg-emerald-600 text-white px-5 py-3 rounded-xl font-medium transition-colors shadow-soft"
                    >
                      <IconLogIn className="w-5 h-5" />
                      Sign In
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="bg-white border-t border-slate-200 mt-auto py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Green Kids Hub. All rights reserved.</p>
          </div>
        </footer>

        {isLoginModalOpen && (
          <LoginModal isOpen={isLoginModalOpen} onClose={() => {
            setIsLoginModalOpen(false);
            if (isSessionValid()) {
              setUser(getStoredUser());
            }
          }} />
        )}
      </div>
    </ToastProvider>
  );
}
