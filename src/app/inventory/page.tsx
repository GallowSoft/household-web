'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client/react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { GET_INVENTORY_ITEMS } from '@/lib/graphql/inventory';

interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  currentQuantity: number;
  unitOfMeasure?: string;
  category?: string | null;
  storageLocation?: string | null;
  expirationDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function InventoryPage() {
  const { user, loading: authLoading } = useAuth();
  const { data, loading: queryLoading, error } = useQuery<{ inventoryItems: InventoryItem[] }>(GET_INVENTORY_ITEMS);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStorageLocation, setSelectedStorageLocation] = useState<string>('');
  const [viewMode, setViewMode] = useState<'card' | 'grid'>('card');

  const items = data?.inventoryItems || [];

  // Extract unique categories and storage locations from items
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    items.forEach((item) => {
      if (item.category) {
        uniqueCategories.add(item.category);
      }
    });
    return Array.from(uniqueCategories).sort();
  }, [items]);

  const storageLocations = useMemo(() => {
    const uniqueLocations = new Set<string>();
    items.forEach((item) => {
      if (item.storageLocation) {
        uniqueLocations.add(item.storageLocation);
      }
    });
    return Array.from(uniqueLocations).sort();
  }, [items]);

  // Filter items based on selected filters
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesLocation = !selectedStorageLocation || item.storageLocation === selectedStorageLocation;
      return matchesCategory && matchesLocation;
    });
  }, [items, selectedCategory, selectedStorageLocation]);

  const loading = authLoading || queryLoading;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <p className="text-zinc-600 dark:text-zinc-400">Please sign in to access inventory.</p>
          <Link
            href="/login"
            className="mt-4 inline-block text-zinc-900 underline dark:text-zinc-50"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return null;
    }
  };

  const isExpiringSoon = (dateString?: string) => {
    if (!dateString) return false;
    try {
      const date = new Date(dateString);
      const today = new Date();
      const diffTime = date.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7; // Expiring within 7 days
    } catch {
      return false;
    }
  };

  const isExpired = (dateString?: string) => {
    if (!dateString) return false;
    try {
      const date = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      return date < today;
    } catch {
      return false;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <div className="text-sm text-red-800 dark:text-red-200">
                Error loading inventory: {error.message}
              </div>
            </div>
          )}

          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center justify-center rounded-md p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                aria-label="Back to home"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Inventory</h1>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Manage your household inventory items
                </p>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800">
              <button
                onClick={() => setViewMode('card')}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === 'card'
                    ? 'bg-zinc-900 text-white dark:bg-zinc-700'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700'
                }`}
                aria-label="Card view"
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
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                Card
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-zinc-900 text-white dark:bg-zinc-700'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700'
                }`}
                aria-label="Grid view"
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
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                Grid
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="category-filter" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Category
              </label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label htmlFor="location-filter" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Storage Location
              </label>
              <select
                id="location-filter"
                value={selectedStorageLocation}
                onChange={(e) => setSelectedStorageLocation(e.target.value)}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              >
                <option value="">All Locations</option>
                {storageLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {(selectedCategory || selectedStorageLocation) && (
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedStorageLocation('');
                  }}
                  className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Results count */}
          <div className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            Showing {filteredItems.length} of {items.length} items
          </div>

          {/* Card View */}
          {viewMode === 'card' && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 flex-1">
                      {item.name}
                    </h3>
                    {item.expirationDate && (
                      <span
                        className={`ml-2 rounded-full px-2 py-1 text-xs font-medium ${
                          isExpired(item.expirationDate)
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            : isExpiringSoon(item.expirationDate)
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        }`}
                      >
                        {isExpired(item.expirationDate) ? 'Expired' : 'Expiring Soon'}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
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
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                      <span className="font-medium">
                        {item.currentQuantity} {item.unitOfMeasure || 'units'}
                      </span>
                    </div>

                    {item.description && (
                      <p className="line-clamp-2 text-zinc-500 dark:text-zinc-500">
                        {item.description}
                      </p>
                    )}

                    {item.category && (
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
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        <span>{item.category}</span>
                      </div>
                    )}

                    {item.storageLocation && (
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
                        <span>{item.storageLocation}</span>
                      </div>
                    )}

                    {item.expirationDate && (
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{formatDate(item.expirationDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Grid/Table View */}
          {viewMode === 'grid' && (
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow dark:border-zinc-700 dark:bg-zinc-800">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                  <thead className="bg-zinc-50 dark:bg-zinc-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Storage Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Expiration Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-800">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                              {item.name}
                            </div>
                            {item.expirationDate && (
                              <span
                                className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                                  isExpired(item.expirationDate)
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                    : isExpiringSoon(item.expirationDate)
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                }`}
                              >
                                {isExpired(item.expirationDate) ? 'Expired' : 'Soon'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                          {item.currentQuantity} {item.unitOfMeasure || 'units'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                          {item.category || '-'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                          {item.storageLocation || '-'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                          {item.expirationDate ? formatDate(item.expirationDate) : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                          <div className="max-w-xs truncate">
                            {item.description || '-'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredItems.length === 0 && (
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                {items.length === 0
                  ? 'No inventory items yet. Add your first item to get started.'
                  : 'No items match your filters. Try adjusting your search criteria.'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

