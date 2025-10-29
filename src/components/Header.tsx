'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-xl font-bold text-zinc-900 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
          >
            Household Management
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 rounded-full p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="User menu"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-sm font-medium text-white dark:bg-zinc-700">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <svg
                className="h-4 w-4 text-zinc-600 dark:text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showDropdown && (
              <>
                <button
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                  aria-label="Close menu"
                />
                <div className="absolute right-0 z-20 mt-2 w-48 rounded-md border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                  <div className="py-1">
                    <div className="border-b border-zinc-200 px-4 py-2 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                      <div className="font-medium text-zinc-900 dark:text-zinc-50">
                        {user.email}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-zinc-100 dark:text-red-400 dark:hover:bg-zinc-700"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Log out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

