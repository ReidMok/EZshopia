'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Order, Product, StoreConfig } from '../../../../types';
import { Plus, Store, ArrowRight, Box, ShoppingBag, Settings as SettingsIcon, Package, Pencil, Sparkles } from 'lucide-react';
import AiProductCreator from '../../../../components/AiProductCreator';
import ProductEditor from '../../../../components/ProductEditor';
import Settings from '../../../../components/Settings';
import OrderDetail from '../../../../components/OrderDetail';

type Tab = 'products' | 'orders' | 'settings';
type View = 'list' | 'create' | 'edit' | 'order_detail';

export default function StoreAdminPage() {
  const params = useParams<{ store: string }>();
  const store = params?.store || 'demo';

  const [tab, setTab] = useState<Tab>('products');
  const [view, setView] = useState<View>('list');
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const storeHomeUrl = useMemo(() => `/s/${encodeURIComponent(store)}`, [store]);

  const refresh = async () => {
    const res = await fetch(`/api/store/${encodeURIComponent(store)}/bootstrap`, { cache: 'no-store' });
    const data = await res.json();
    setProducts(Array.isArray(data.products) ? data.products : []);
    setConfig(data.storeConfig || null);
    try {
      const oRes = await fetch(`/api/store/${encodeURIComponent(store)}/orders`, { cache: 'no-store' });
      const oData = await oRes.json();
      setOrders(Array.isArray(oData) ? oData : []);
    } catch {}
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

  if (tab === 'settings' && config) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <Store className="w-4 h-4" /> Store Admin
              </div>
              <h1 className="mt-2 text-2xl font-extrabold text-gray-900">{config.name}</h1>
              <p className="mt-1 text-sm text-gray-600">Settings are scoped to this store only.</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={storeHomeUrl}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold hover:bg-gray-50 inline-flex items-center gap-2"
              >
                View store <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => setTab('products')}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-black"
              >
                Back to products
              </button>
            </div>
          </div>

          <Settings
            storeConfig={config}
            onUpdateConfig={async (patch) => {
              const res = await fetch(`/api/store/${encodeURIComponent(store)}/store-config`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patch),
              });
              const updated = await res.json().catch(() => null);
              if (updated) setConfig(updated);
            }}
          />
        </div>
      </div>
    );
  }

  if (tab === 'products' && view === 'create') {
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

  if (tab === 'products' && view === 'edit' && editingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <ProductEditor
          product={editingProduct}
          onCancel={() => {
            setEditingProduct(null);
            setView('list');
          }}
          onSave={async (updated) => {
            await fetch(`/api/store/${encodeURIComponent(store)}/products/${encodeURIComponent(updated.id)}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updated),
            });
            await refresh();
            setEditingProduct(null);
            setView('list');
          }}
        />
      </div>
    );
  }

  if (tab === 'orders' && view === 'order_detail' && selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <OrderDetail
          order={selectedOrder}
          onClose={() => {
            setSelectedOrder(null);
            setView('list');
          }}
          onUpdateStatus={async (orderId, status) => {
            const res = await fetch(
              `/api/store/${encodeURIComponent(store)}/orders/${encodeURIComponent(orderId)}`,
              {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
              }
            );
            const updated = await res.json().catch(() => null);
            if (updated && !updated.error) {
              setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
              setSelectedOrder(updated);
            }
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
            <p className="mt-1 text-sm text-gray-600">Shopify-style store admin. Data is isolated per store.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={storeHomeUrl}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold hover:bg-gray-50 inline-flex items-center gap-2"
            >
              View store <ArrowRight className="w-4 h-4" />
            </a>
            {tab === 'products' ? (
              <button
                onClick={() => setView('create')}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Add product (AI)
              </button>
            ) : tab === 'orders' ? (
              <button
                onClick={async () => {
                  await fetch(`/api/store/${encodeURIComponent(store)}/orders`, { method: 'POST' });
                  await refresh();
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create test order
              </button>
            ) : (
              <button
                onClick={() => setTab('products')}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-black"
              >
                Back
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Store</div>
                <div className="mt-1 text-sm font-extrabold text-gray-900 truncate">{config?.name || store}</div>
              </div>
              <nav className="p-2 space-y-1">
                <button
                  onClick={() => {
                    setTab('products');
                    setView('list');
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                    tab === 'products' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Package className="w-4 h-4" /> Products
                </button>
                <button
                  onClick={() => {
                    setTab('orders');
                    setView('list');
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                    tab === 'orders' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" /> Orders
                </button>
                <button
                  onClick={() => {
                    setTab('settings');
                    setView('list');
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                    tab === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <SettingsIcon className="w-4 h-4" /> Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-9">
            {tab === 'products' && (
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
                      <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                        <a
                          className="flex items-center gap-4 flex-1 min-w-0"
                          href={`/s/${encodeURIComponent(store)}/products/${encodeURIComponent(p.slug)}`}
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                            {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : null}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-extrabold text-gray-900 truncate">{p.title}</div>
                            <div className="text-xs text-gray-500 truncate">/{p.slug}</div>
                          </div>
                        </a>
                        <div className="text-xs font-semibold text-gray-500">{p.status}</div>
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setView('edit');
                          }}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'orders' && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="text-sm font-extrabold text-gray-900">Orders</div>
                  <div className="text-xs text-gray-500">{orders.length} orders</div>
                </div>
                {orders.length === 0 ? (
                  <div className="p-10 text-center text-gray-600">
                    <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <div className="text-sm font-semibold">No orders yet</div>
                    <div className="text-xs text-gray-500 mt-1">Click “Create test order” to generate sample orders for QA.</div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {orders.map((o) => (
                      <button
                        key={o.id}
                        className="w-full text-left px-6 py-4 hover:bg-gray-50 flex items-center justify-between gap-4"
                        onClick={() => {
                          setSelectedOrder(o);
                          setView('order_detail');
                        }}
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-extrabold text-gray-900">{o.id}</div>
                          <div className="text-xs text-gray-500 truncate">{o.customer} • {o.date}</div>
                        </div>
                        <div className="text-xs font-semibold text-gray-600">{o.status}</div>
                        <div className="text-sm font-extrabold text-gray-900">${o.total.toFixed(2)}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'settings' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 text-sm text-gray-600">
                Opening settings…
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

