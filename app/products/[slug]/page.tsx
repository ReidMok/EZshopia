'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { Product, StoreConfig } from '../../../types';

type LoadedState =
  | { status: 'loading' }
  | { status: 'not_found' }
  | { status: 'ready'; product: Product; config: StoreConfig | null };

function safeParseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = useMemo(() => decodeURIComponent(params.slug || ''), [params.slug]);

  const [state, setState] = useState<LoadedState>({ status: 'loading' });

  useEffect(() => {
    try {
      const products = safeParseJson<Product[]>(localStorage.getItem('ezshopia_products')) || [];
      const config = safeParseJson<StoreConfig>(localStorage.getItem('ezshopia_config'));
      const product = products.find((p) => p.slug === slug);
      if (!product) {
        setState({ status: 'not_found' });
        return;
      }
      setState({ status: 'ready', product, config });
    } catch {
      setState({ status: 'not_found' });
    }
  }, [slug]);

  if (state.status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading product…</p>
        </div>
      </div>
    );
  }

  if (state.status === 'not_found') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-lg w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
          <h1 className="text-xl font-bold text-gray-900">Product not found</h1>
          <p className="mt-2 text-sm text-gray-600">
            这个详情页从你浏览器的本地数据（localStorage）读取产品。若你换了浏览器/设备，或清空了缓存，就会找不到。
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
            >
              Back to dashboard
            </Link>
            <Link
              href="/"
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50"
            >
              Back to storefront preview
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { product, config } = state;
  const currency = config?.currency || 'USD';
  const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
  const primary = config?.theme?.primaryColor || '#2563eb';
  const secondary = config?.theme?.secondaryColor || '#0f172a';

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-extrabold tracking-tight" style={{ color: secondary }}>
            {config?.name || 'Ezshopia Store'}
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <a
              href="#buy"
              className="text-sm font-semibold px-3 py-1.5 rounded-full text-white"
              style={{ backgroundColor: primary }}
            >
              Buy
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
            <div className="aspect-square bg-white">
              <img
                src={product.images?.[0] || 'https://via.placeholder.com/900'}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {(product.tags || []).slice(0, 10).map((t) => (
                <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                  #{t}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">{product.title}</h1>
            <p className="mt-3 text-2xl font-bold text-gray-900">
              {symbol}
              {product.price.toFixed(2)}
            </p>

            <div className="mt-6 flex items-center gap-3" id="buy">
              <button
                type="button"
                className="px-5 py-3 rounded-xl text-white font-semibold shadow-sm hover:opacity-95 transition-opacity"
                style={{ backgroundColor: primary }}
              >
                Add to cart
              </button>
              <Link
                href="/"
                className="px-5 py-3 rounded-xl border border-gray-300 text-gray-800 font-semibold hover:bg-gray-50"
              >
                Back
              </Link>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              这是“真实独立详情页 URL”，但当前购物车/支付仍是 demo（未接入后端）。
            </p>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <h2 className="text-sm font-bold text-gray-900 mb-3">Description</h2>
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml || '<p>No description.</p>' }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

