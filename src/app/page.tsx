'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Toolbar } from '@/components/Toolbar';
import { ShoppingLists } from '@/components/ShoppingLists';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      {user ? (
        <>
          <Header />
          <Toolbar />
          <main className="flex-1">
            <ShoppingLists />
          </main>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center px-6 py-16">
          <div className="w-full max-w-md text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
              Household Management
            </h1>
            <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
              Manage your household with ease
            </p>

            <div className="rounded-lg bg-white p-8 shadow-sm dark:bg-zinc-900">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
                  Get Started
                </h2>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  Sign in to access your household management features.
                </p>
              </div>
              <div className="space-y-4">
                <Link
                  href="/login"
                  className="inline-block w-full rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
