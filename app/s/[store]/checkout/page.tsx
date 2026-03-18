'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Order, StoreConfig } from '../../../../types';

type CartItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  slug?: string;
};

function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function storeKeyFromHostname(hostname: string) {
  const host = hostname.split(':')[0].toLowerCase();
  if (host.endsWith('.ezshopia.com')) {
    const sub = host.slice(0, -'.ezshopia.com'.length);
    if (!sub || sub === 'www' || sub === 'admin') return null;
    return sub.split('.')[0];
  }
  if (host.endsWith('.localhost')) {
    const sub = host.slice(0, -'.localhost'.length);
    if (!sub || sub === 'admin') return null;
    return sub.split('.')[0];
  }
  return null;
}

export default function Checkout() {
  const params = useParams();
  const storeKey = useMemo(() => {
    const raw = (params as any)?.store as string | string[] | undefined;
    const joined = Array.isArray(raw) ? raw.join('/') : raw || '';
    const decoded = safeDecodeURIComponent(joined);
    if (decoded) return decoded;
    if (typeof window !== 'undefined') return storeKeyFromHostname(window.location.hostname) || 'demo';
    return 'demo';
  }, [params]);

  const cartStorageKey = `ezshopia_cart_${storeKey}`;

  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: '',
    name: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    country: 'United States',
    zip: '',
    phone: '',
  });

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`/api/store/${encodeURIComponent(storeKey)}/store-config`, { cache: 'no-store' });
        const c = await res.json();
        setConfig(c);
      } catch {}
      try {
        const raw = localStorage.getItem(cartStorageKey);
        if (raw) setCart(JSON.parse(raw));
      } catch {}
    };
    run();
  }, [storeKey, cartStorageKey]);

  const currency = config?.currency || 'USD';
  const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
  const money = (n: number) => `${symbol}${n.toFixed(2)}`;
  const subtotal = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const shipping = subtotal >= 50 ? 0 : cart.length ? 7.5 : 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

  const submit = async () => {
    setError(null);
    if (!cart.length) {
      setError('Your cart is empty.');
      return;
    }
    if (!form.email || !form.name || !form.address1 || !form.city || !form.country || !form.zip) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/store/${encodeURIComponent(storeKey)}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          customerName: form.name,
          shippingAddress: {
            name: form.name,
            address1: form.address1,
            address2: form.address2 || undefined,
            city: form.city,
            province: form.province || undefined,
            country: form.country,
            zip: form.zip,
            phone: form.phone || undefined,
          },
          items: cart.map((it) => ({ productId: it.productId, quantity: it.quantity })),
        }),
      });

      const data = (await res.json().catch(() => null)) as Order | any;
      if (!res.ok || !data || data.error) {
        setError(data?.error || 'Checkout failed.');
        return;
      }

      // clear cart
      try {
        localStorage.removeItem(cartStorageKey);
      } catch {}
      window.location.href = `thank-you?orderId=${encodeURIComponent(data.id)}`;
    } catch (e: any) {
      setError(e?.message || 'Checkout failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <a href="./" className="text-lg font-extrabold text-gray-900">
            {config?.name || `${storeKey} Store`}
          </a>
          <a href="./" className="text-sm font-semibold text-gray-700 hover:text-gray-900">
            Back to store
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h1 className="text-xl font-extrabold text-gray-900">Checkout</h1>
              <p className="mt-1 text-sm text-gray-600">Demo payment mode (no real charge).</p>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">
                  {error}
                </div>
              )}

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1">Email *</label>
                  <input
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1">Full name *</label>
                  <input
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="John Doe"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1">Address line 1 *</label>
                  <input
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.address1}
                    onChange={(e) => setForm((p) => ({ ...p, address1: e.target.value }))}
                    placeholder="123 Main St"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1">Address line 2</label>
                  <input
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.address2}
                    onChange={(e) => setForm((p) => ({ ...p, address2: e.target.value }))}
                    placeholder="Apt, suite, etc."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">City *</label>
                  <input
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.city}
                    onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">ZIP/Postal code *</label>
                  <input
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.zip}
                    onChange={(e) => setForm((p) => ({ ...p, zip: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Country *</label>
                  <input
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.country}
                    onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Phone</label>
                  <input
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={submit}
                disabled={submitting || cart.length === 0}
                className="mt-6 w-full px-5 py-3 rounded-xl bg-gray-900 text-white font-extrabold hover:bg-black disabled:opacity-50"
              >
                {submitting ? 'Processing…' : `Pay ${money(total)} (Demo)`}
              </button>
              <div className="mt-2 text-[11px] text-gray-500 text-center">
                This is a simulated payment flow for testing.
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="text-sm font-extrabold text-gray-900">Order summary</div>
              <div className="mt-4 space-y-3">
                {cart.map((it) => (
                  <div key={it.productId} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                      {it.image ? <img src={it.image} alt="" className="w-full h-full object-cover" /> : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-extrabold text-gray-900 truncate">{it.title}</div>
                      <div className="text-[11px] text-gray-500">Qty {it.quantity}</div>
                    </div>
                    <div className="text-xs font-extrabold text-gray-900">{money(it.price * it.quantity)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-semibold">Subtotal</span>
                  <span className="text-gray-900 font-extrabold">{money(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-semibold">Shipping</span>
                  <span className="text-gray-900 font-extrabold">{money(shipping)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-semibold">Tax</span>
                  <span className="text-gray-900 font-extrabold">{money(tax)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                  <span className="text-gray-900 font-extrabold">Total</span>
                  <span className="text-gray-900 font-extrabold">{money(total)}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-gray-500">
              Free shipping over $50. Orders appear in the merchant admin under Orders.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

