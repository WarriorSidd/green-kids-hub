'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getStoredUser, clearStoredUser, UserSession, isSessionValid } from '@/lib/api';
import { IconLogIn, IconGamepad, IconAward, IconBarChart, IconClose, IconGraduationCap, IconBell } from '@/components/Icons';

const LoginModal = dynamic(() => import('@/components/LoginModal'), { ssr: false });
const ToastProvider = dynamic(() => import('@/components/Toast').then((m) => m.ToastProvider), { ssr: false });

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  readAt?: string | null;
  createdAt: string;
}

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async (userId: string) => {
    try {
      const res = await fetch(`/api/notifications?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    const checkSession = () => {
      if (isSessionValid()) {
        const u = getStoredUser();
        setUser(u);
        if (u) fetchNotifications(u.id);
      } else {
        setUser(null);
      }
    };

    checkSession();

    const handleAuthChange = () => checkSession();
    window.addEventListener('gkh_auth_change', handleAuthChange);

    // Poll for notifications every 30 seconds if tab is active
    const interval = setInterval(() => {
      if (document.hidden) return;
      const u = getStoredUser();
      if (u) fetchNotifications(u.id);
    }, 30000);

    return () => {
      window.removeEventListener('gkh_auth_change', handleAuthChange);
      clearInterval(interval);
    };
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id })
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
      );
    } catch {
      /* ignore */
    }
  };

  const handleSignOut = () => {
    clearStoredUser();
    setUser(null);
  };

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: IconBarChart },
    { name: 'Games', href: '/games', icon: IconGamepad },
    { name: 'Leaderboard', href: '/leaderboard', icon: IconAward },
  ];

  const NotificationDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        aria-label="Notifications"
      >
        <IconBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-slate-200 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-black text-sm text-ink flex items-center gap-2">
              <IconBell className="w-4 h-4 text-emerald-600" /> Notifications
            </h4>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <IconClose className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 max-h-64 overflow-y-auto space-y-2">
            {notifications.length === 0 ? (
              <p className="text-xs font-semibold text-slate-400 text-center py-4">
                No notifications yet.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkRead(n.id)}
                  className={`p-3 rounded-xl cursor-pointer text-left transition ${
                    !n.readAt
                      ? 'bg-emerald-50 border border-emerald-200'
                      : 'bg-slate-50 border border-slate-100 opacity-75'
                  }`}
                >
                  <p className="text-xs font-black text-ink">{n.title}</p>
                  <p className="mt-0.5 text-xs text-slate-600 leading-snug">{n.body}</p>
                  <p className="mt-1 text-[10px] text-slate-400 font-semibold">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );

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

              {/* User Actions & Notifications (Desktop) */}
              <div className="hidden md:flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-3">
                    <NotificationDropdown />
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
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-leaf hover:bg-emerald-600 transition-colors shadow-soft"
                  >
                    <IconLogIn className="w-4 h-4" />
                    Sign In
                  </button>
                )}
              </div>

              {/* Mobile Actions (Bell + Menu button) */}
              <div className="flex items-center gap-2 md:hidden">
                {user && <NotificationDropdown />}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  {isMobileMenuOpen ? <IconClose className="w-6 h-6" /> : <IconBarChart className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-slate-100">
                {user ? (
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="font-semibold text-slate-900">{user.displayName}</span>
                    <button onClick={handleSignOut} className="text-sm font-medium text-red-600">
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsLoginModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-leaf"
                  >
                    <IconLogIn className="w-4 h-4" />
                    Sign In
                  </button>
                )}
              </div>
            </div>
          )}
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      </div>
    </ToastProvider>
  );
}
