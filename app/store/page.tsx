'use client';

import React, { useEffect, useState } from 'react';
import Storefront from '../../components/Storefront';
import type { Product, StoreConfig } from '../../types';

export default function PublicStorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/api/store/demo/bootstrap', { cache: 'no-store' });
        const data = await res.json();
        setProducts(Array.isArray(data.products) ? data.products : []);
        setConfig(data.storeConfig || null);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading store…</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-lg w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
          <h1 className="text-xl font-bold text-gray-900">Store not configured</h1>
          <p className="mt-2 text-sm text-gray-600">请先在后台设置店铺配置并创建产品。</p>
        </div>
      </div>
    );
  }

  return (
    <Storefront
      products={products}
      config={config}
      storeKey="demo"
      rootHrefOverride="/store"
      onExit={() => {
        window.location.href = '/';
      }}
    />
  );
}

