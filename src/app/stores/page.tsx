'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';

interface Store {
  id: string;
  name: string;
  address?: string;
  type?: string;
}

// Mock data - replace with actual GraphQL query
const mockStores: Store[] = [
  { id: '1', name: 'Walmart', address: '123 Main St', type: 'Grocery' },
  { id: '2', name: 'Home Depot', address: '456 Oak Ave', type: 'Home Improvement' },
  { id: '3', name: 'Costco', address: '789 Pine Rd', type: 'Wholesale' },
];

export default function StoresPage() {
  const { user, loading } = useAuth();
  const [stores, setStores] = useState<Store[]>(mockStores);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [formData, setFormData] = useState({ name: '', address: '', type: '' });

  const handleOpenAddModal = () => {
    setEditingStore(null);
    setFormData({ name: '', address: '', type: '' });
    setShowAddModal(true);
  };

  const handleEditStore = (store: Store) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      address: store.address || '',
      type: store.type || '',
    });
    setShowAddModal(true);
  };

  const handleSaveStore = () => {
    if (!formData.name.trim()) return;

    if (editingStore) {
      setStores(stores.map(s =>
        s.id === editingStore.id
          ? { ...s, name: formData.name, address: formData.address, type: formData.type }
          : s
      ));
    } else {
      const newStore: Store = {
        id: Date.now().toString(),
        name: formData.name,
        address: formData.address || undefined,
        type: formData.type || undefined,
      };
      setStores([...stores, newStore]);
    }

    setShowAddModal(false);
    setFormData({ name: '', address: '', type: '' });
    setEditingStore(null);
  };

  const handleDeleteStore = (id: string) => {
    if (confirm('Are you sure you want to delete this store?')) {
      setStores(stores.filter(s => s.id !== id));
    }
  };

  const handleCancelModal = () => {
    setShowAddModal(false);
    setFormData({ name: '', address: '', type: '' });
    setEditingStore(null);
  };

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
          <p className="text-zinc-600 dark:text-zinc-400">Please sign in to access stores.</p>
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

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Stores</h1>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Manage your shopping stores
                </p>
              </div>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-700 dark:hover:bg-zinc-600"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Store
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow dark:border-zinc-700 dark:bg-zinc-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                <thead className="bg-zinc-50 dark:bg-zinc-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Type
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-800">
                  {stores.map((store) => (
                    <tr key={store.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {store.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {store.address || '-'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {store.type || '-'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditStore(store)}
                            aria-label="Edit store"
                            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteStore(store.id)}
                            aria-label="Delete store"
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {stores.length === 0 && (
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                No stores yet. Add your first store to get started.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Store Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {editingStore ? 'Edit Store' : 'Add Store'}
              </h3>
              <button
                onClick={handleCancelModal}
                aria-label="Close modal"
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Store Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
                  placeholder="e.g., Walmart"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
                  placeholder="e.g., 123 Main St"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Type
                </label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
                  placeholder="e.g., Grocery, Home Improvement"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleCancelModal}
                className="flex-1 rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStore}
                disabled={!formData.name.trim()}
                className="flex-1 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-700 dark:hover:bg-zinc-600"
              >
                {editingStore ? 'Update' : 'Add'} Store
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

