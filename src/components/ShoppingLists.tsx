'use client';

import { useState } from 'react';

interface ShoppingList {
  id: string;
  name: string;
  store?: string;
  itemCount?: number;
  lastUpdated?: string;
}

// Mock data - replace with actual GraphQL query
const mockLists: ShoppingList[] = [
  { id: '1', name: 'Weekly Groceries', store: 'Walmart', itemCount: 12, lastUpdated: '2 days ago' },
  { id: '2', name: 'Home Depot', store: 'Home Depot', itemCount: 5, lastUpdated: '1 week ago' },
  { id: '3', name: 'Costco Run', store: 'Costco', itemCount: 8, lastUpdated: '3 days ago' },
];

export function ShoppingLists() {
  const [lists, setLists] = useState<ShoppingList[]>(mockLists);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Shopping Lists
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Manage your shopping lists and track your items
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lists.map((list) => (
          <div
            key={list.id}
            className="group cursor-pointer rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
          >
            <div className="mb-3 flex items-start justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {list.name}
              </h3>
              <svg
                className="h-5 w-5 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            
            <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              {list.store && (
                <div className="flex items-center gap-2">
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  {list.store}
                </div>
              )}
              
              {list.itemCount !== undefined && (
                <div className="flex items-center gap-2">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  {list.itemCount} items
                </div>
              )}
              
              {list.lastUpdated && (
                <div className="flex items-center gap-2">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Updated {list.lastUpdated}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {lists.length === 0 && (
        <div className="rounded-lg border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
          <svg
            className="mx-auto h-12 w-12 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            No shopping lists yet. Create your first list to get started.
          </p>
        </div>
      )}
    </div>
  );
}

