'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { Product, PublicReview, StoreConfig } from '../../../types';
import { ChevronRight, Minus, Plus, ShieldCheck, Truck, RotateCcw, Star } from 'lucide-react';

type LoadedState =
  | { status: 'loading' }
  | { status: 'not_found' }
  | { status: 'ready'; product: Product; config: StoreConfig | null; reviews: PublicReview[] };

function safeParseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = useMemo(() => {
    const raw = (params as any)?.slug as string | string[] | undefined;
    const joined = Array.isArray(raw) ? raw.join('/') : raw || '';
    return safeDecodeURIComponent(joined);
  }, [params]);

  const [state, setState] = useState<LoadedState>({ status: 'loading' });
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [openPanel, setOpenPanel] = useState<'shipping' | 'returns' | 'secure' | null>('shipping');

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch(`/api/products/slug/${encodeURIComponent(slug)}`, { cache: 'no-store' });
        const product = (await res.json().catch(() => null)) as Product | null;
        const configRes = await fetch('/api/store-config', { cache: 'no-store' });
        const config = (await configRes.json().catch(() => null)) as StoreConfig | null;
        if (cancelled) return;
        if (!product || (product as any).error) {
          setState({ status: 'not_found' });
          return;
        }
        const reviewsRes = await fetch(`/api/reviews/${encodeURIComponent(product.id)}`, { cache: 'no-store' });
        const reviews = (await reviewsRes.json().catch(() => [])) as PublicReview[];
        setState({ status: 'ready', product, config, reviews: Array.isArray(reviews) ? reviews : [] });
      } catch {
        if (!cancelled) setState({ status: 'not_found' });
      }
    };

    // Ensure we never hang on "loading" if something goes wrong with hydration.
    const timer = window.setTimeout(() => {
      if (!cancelled) setState({ status: 'not_found' });
    }, 2500);

    run();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
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

  const { product, config, reviews: publicReviews } = state;
  const currency = config?.currency || 'USD';
  const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
  const primary = config?.theme?.primaryColor || '#2563eb';
  const secondary = config?.theme?.secondaryColor || '#0f172a';
  const images = (product.images && product.images.length ? product.images : ['https://via.placeholder.com/900']) as string[];
  const activeImage = images[Math.min(activeImageIdx, images.length - 1)];

  const money = (n: number) => `${symbol}${n.toFixed(2)}`;
  const reviewsCount = publicReviews.length;
  const rating =
    reviewsCount === 0
      ? 0
      : publicReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / Math.max(1, reviewsCount);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/store" className="font-extrabold tracking-tight" style={{ color: secondary }}>
            {config?.name || 'Ezshopia Store'}
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/store" className="text-sm font-semibold text-gray-700 hover:text-gray-900">
              Shop
            </Link>
            <a
              href="#buy"
              className="text-sm font-semibold px-3 py-1.5 rounded-full text-white"
              style={{ backgroundColor: primary }}
            >
              Add to cart
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/store" className="hover:text-gray-900 font-semibold">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/store#products" className="hover:text-gray-900 font-semibold">
            Products
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-semibold truncate">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Media column */}
          <div>
            <div className="rounded-2xl border border-gray-200 overflow-hidden bg-gray-50">
              <div className="aspect-square bg-white">
                <img src={activeImage} alt={product.title} className="w-full h-full object-contain" />
              </div>
            </div>
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {images.slice(0, 5).map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`aspect-square rounded-xl border overflow-hidden bg-white ${
                      idx === activeImageIdx ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content column */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {(product.tags || []).slice(0, 8).map((t) => (
                <span key={t} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                  {t}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">{product.title}</h1>

            <div className="mt-3 flex items-center gap-3">
              <div className="text-2xl font-extrabold text-gray-900">{money(product.price)}</div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-900">{rating ? rating.toFixed(1) : '—'}</span>
                <span className="text-gray-500">({reviewsCount} reviews)</span>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              A polished, Shopify-style product page template. Connect payments & inventory to go live.
            </p>

            {/* Quantity + Add */}
            <div className="mt-7" id="buy">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-gray-900">Quantity</div>
                <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
                  In stock
                </div>
              </div>

              <div className="mt-3 flex flex-col sm:flex-row gap-3">
                <div className="inline-flex items-center rounded-xl border border-gray-300 bg-white overflow-hidden">
                  <button
                    type="button"
                    className="px-3 py-3 text-gray-700 hover:bg-gray-50"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-12 text-center text-sm font-bold text-gray-900">{qty}</div>
                  <button
                    type="button"
                    className="px-3 py-3 text-gray-700 hover:bg-gray-50"
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  className="flex-1 px-6 py-3 rounded-xl text-white font-extrabold shadow-sm hover:opacity-95 transition-opacity"
                  style={{ backgroundColor: primary }}
                  onClick={() => alert(`Demo: add to cart (${qty}) not connected yet`)}
                >
                  Add to cart
                </button>

                <Link
                  href="/store"
                  className="px-6 py-3 rounded-xl border border-gray-300 text-gray-900 font-bold hover:bg-gray-50 text-center"
                >
                  Back
                </Link>
              </div>

              {/* Trust row */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-start gap-3 rounded-2xl border border-gray-200 p-4">
                  <Truck className="w-5 h-5 text-gray-700 mt-0.5" />
                  <div>
                    <div className="text-xs font-extrabold text-gray-900">Fast shipping</div>
                    <div className="text-xs text-gray-600">2–5 business days</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-gray-200 p-4">
                  <RotateCcw className="w-5 h-5 text-gray-700 mt-0.5" />
                  <div>
                    <div className="text-xs font-extrabold text-gray-900">Easy returns</div>
                    <div className="text-xs text-gray-600">30-day window</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-gray-200 p-4">
                  <ShieldCheck className="w-5 h-5 text-gray-700 mt-0.5" />
                  <div>
                    <div className="text-xs font-extrabold text-gray-900">Secure checkout</div>
                    <div className="text-xs text-gray-600">Encrypted payments</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accordions */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <button
                type="button"
                className="w-full flex items-center justify-between py-3 text-left"
                onClick={() => setOpenPanel((p) => (p === 'shipping' ? null : 'shipping'))}
              >
                <span className="text-sm font-extrabold text-gray-900">Shipping</span>
                <span className="text-xs font-bold text-gray-500">{openPanel === 'shipping' ? '−' : '+'}</span>
              </button>
              {openPanel === 'shipping' && (
                <div className="pb-4 text-sm text-gray-600 leading-relaxed">
                  Orders ship within 24–48 hours. Tracking is emailed after dispatch. International duties may apply.
                </div>
              )}

              <div className="border-t border-gray-100" />

              <button
                type="button"
                className="w-full flex items-center justify-between py-3 text-left"
                onClick={() => setOpenPanel((p) => (p === 'returns' ? null : 'returns'))}
              >
                <span className="text-sm font-extrabold text-gray-900">Returns</span>
                <span className="text-xs font-bold text-gray-500">{openPanel === 'returns' ? '−' : '+'}</span>
              </button>
              {openPanel === 'returns' && (
                <div className="pb-4 text-sm text-gray-600 leading-relaxed">
                  Return within 30 days in original condition. Refunds processed within 3–5 business days.
                </div>
              )}

              <div className="border-t border-gray-100" />

              <button
                type="button"
                className="w-full flex items-center justify-between py-3 text-left"
                onClick={() => setOpenPanel((p) => (p === 'secure' ? null : 'secure'))}
              >
                <span className="text-sm font-extrabold text-gray-900">Secure checkout</span>
                <span className="text-xs font-bold text-gray-500">{openPanel === 'secure' ? '−' : '+'}</span>
              </button>
              {openPanel === 'secure' && (
                <div className="pb-4 text-sm text-gray-600 leading-relaxed">
                  Payments are encrypted end-to-end. For production, connect Stripe/PayPal and inventory.
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mt-6 border-t border-gray-100 pt-6">
              <h2 className="text-sm font-extrabold text-gray-900 mb-3">Description</h2>
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml || '<p>No description.</p>' }}
              />
            </div>

            {/* Reviews */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-sm font-extrabold text-gray-900">Reviews</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Demo reviews are auto-generated to make the storefront feel realistic.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-gray-900">{rating ? rating.toFixed(1) : '—'}</div>
                  <div className="text-xs text-gray-500">{reviewsCount} reviews</div>
                </div>
              </div>

              {publicReviews.length === 0 ? (
                <div className="mt-4 text-sm text-gray-600">No reviews yet.</div>
              ) : (
                <div className="mt-4 space-y-4">
                  {publicReviews.slice(0, 6).map((r) => (
                    <div key={r.id} className="rounded-2xl border border-gray-200 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-extrabold text-gray-900">{r.authorName}</div>
                          <div className="mt-1 flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                                />
                              ))}
                            </div>
                            <div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</div>
                            {r.source === 'DEMO' && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                                DEMO
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 text-sm font-bold text-gray-900">{r.title}</div>
                      <div className="mt-1 text-sm text-gray-700 leading-relaxed">{r.body}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur border-t border-gray-200 sm:hidden">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="min-w-0">
            <div className="text-xs font-extrabold text-gray-900 truncate">{product.title}</div>
            <div className="text-xs text-gray-600">{money(product.price)}</div>
          </div>
          <button
            type="button"
            className="ml-auto px-4 py-2 rounded-full text-xs font-extrabold text-white"
            style={{ backgroundColor: primary }}
            onClick={() => alert(`Demo: add to cart (${qty}) not connected yet`)}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

