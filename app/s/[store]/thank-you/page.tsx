'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Order, StoreConfig } from '../../../../types';

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

export default function ThankYou() {
  const params = useParams();
  const storeKey = useMemo(() => {
    const raw = (params as any)?.store as string | string[] | undefined;
    const joined = Array.isArray(raw) ? raw.join('/') : raw || '';
    const decoded = safeDecodeURIComponent(joined);
    if (decoded) return decoded;
    if (typeof window !== 'undefined') return storeKeyFromHostname(window.location.hostname) || 'demo';
    return 'demo';
  }, [params]);

  const storeRootHref = useMemo(() => {
    const hasStoreParam = Boolean((params as any)?.store);
    if (hasStoreParam) return `/s/${encodeURIComponent(storeKey)}`;
    if (typeof window !== 'undefined') return storeKeyFromHostname(window.location.hostname) ? '/' : '/store';
    return '/store';
  }, [params, storeKey]);

  const merchantAdminHref = useMemo(() => {
    const hasStoreParam = Boolean((params as any)?.store);
    if (hasStoreParam) return `/s/${encodeURIComponent(storeKey)}/admin`;
    if (typeof window !== 'undefined') return storeKeyFromHostname(window.location.hostname) ? '/admin' : `/s/${encodeURIComponent(storeKey)}/admin`;
    return `/s/${encodeURIComponent(storeKey)}/admin`;
  }, [params, storeKey]);

  const orderId = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const u = new URL(window.location.href);
    return u.searchParams.get('orderId') || '';
  }, []);

  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const cRes = await fetch(`/api/store/${encodeURIComponent(storeKey)}/store-config`, { cache: 'no-store' });
        setConfig(await cRes.json());
      } catch {}
      try {
        const oRes = await fetch(`/api/store/${encodeURIComponent(storeKey)}/orders`, { cache: 'no-store' });
        const o = await oRes.json();
        setOrders(Array.isArray(o) ? o : []);
      } catch {}
    };
    run();
  }, [storeKey]);

  const order = orders.find((o) => o.id === orderId) || null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 inline-flex px-3 py-1 rounded-full">
          Payment successful (Demo)
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-gray-900">Thanks for your order!</h1>
        <p className="mt-2 text-sm text-gray-600">
          {config?.name || `${storeKey} Store`} has received your order.
        </p>

        {orderId && (
          <div className="mt-6 rounded-2xl border border-gray-200 p-5 text-left">
            <div className="text-xs font-bold text-gray-500">Order</div>
            <div className="text-lg font-extrabold text-gray-900">{orderId}</div>
            {order ? (
              <>
                <div className="mt-3 text-sm text-gray-700">
                  Total: <span className="font-extrabold">${order.total.toFixed(2)}</span> • Status:{' '}
                  <span className="font-extrabold">{order.status}</span>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  You can see this order in the merchant admin: <code>/s/{storeKey}/admin</code> → Orders.
                </div>
              </>
            ) : (
              <div className="mt-3 text-sm text-gray-600">Order details will appear shortly.</div>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={storeRootHref}
            className="px-5 py-3 rounded-xl bg-gray-900 text-white font-extrabold hover:bg-black"
          >
            Continue shopping
          </a>
          <a
            href={merchantAdminHref}
            className="px-5 py-3 rounded-xl border border-gray-300 text-gray-900 font-extrabold hover:bg-gray-50"
          >
            Merchant admin
          </a>
        </div>
      </div>
    </div>
  );
}

