'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Product, StoreConfig } from '../../../../types';
import { Plus, Store, ArrowRight, Box } from 'lucide-react';
import AiProductCreator from '../../../../components/AiProductCreator';

type View = 'list' | 'create';

export default function StoreAdminPage() {
  const params = useParams<{ store: string }>();
  const store = params?.store || 'demo';

  const [view, setView] = useState<View>('list');
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const storeHomeUrl = useMemo(() => `/s/${encodeURIComponent(store)}`, [store]);

  const refresh = async () => {
    const res = await fetch(`/api/store/${encodeURIComponent(store)}/bootstrap`, { cache: 'no-store' });
    const data = await res.json();
    setProducts(Array.isArray(data.products) ? data.products : []);
    setConfig(data.storeConfig || null);
  };

  useEffect(() => {
    const run = async () => {
      try {
        await refresh();
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [store]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading store admin…</p>
        </div>
      </div>
    );
  }

  if (view === 'create') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Store className="w-4 h-4" />
            <span className="font-semibold text-gray-900">{config?.name || store}</span>
            <span className="text-gray-400">/</span>
            <span>Create product</span>
          </div>
          <button
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold hover:bg-gray-50"
            onClick={() => setView('list')}
          >
            Back
          </button>
        </div>

        <AiProductCreator
          onCancel={() => setView('list')}
          onSave={async (partial) => {
            await fetch(`/api/store/${encodeURIComponent(store)}/products`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(partial),
            });
            await refresh();
            setView('list');
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
              <Store className="w-4 h-4" />
              Store Admin
            </div>
            <h1 className="mt-2 text-2xl font-extrabold text-gray-900">{config?.name || store}</h1>
            <p className="mt-1 text-sm text-gray-600">Manage products for this store. Public site runs on the store subdomain.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={storeHomeUrl}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold hover:bg-gray-50 inline-flex items-center gap-2"
            >
              View store <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => setView('create')}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add product (AI)
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="text-sm font-extrabold text-gray-900">Products</div>
            <div className="text-xs text-gray-500">{products.length} items</div>
          </div>
          {products.length === 0 ? (
            <div className="p-10 text-center text-gray-600">
              <Box className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <div className="text-sm font-semibold">No products yet</div>
              <div className="text-xs text-gray-500 mt-1">Click “Add product (AI)” to generate your first listing.</div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {products.map((p) => (
                <a
                  key={p.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50"
                  href={`/s/${encodeURIComponent(store)}/products/${encodeURIComponent(p.slug)}`}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-extrabold text-gray-900 truncate">{p.title}</div>
                    <div className="text-xs text-gray-500 truncate">/{p.slug}</div>
                  </div>
                  <div className="text-xs font-semibold text-gray-500">{p.status}</div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

