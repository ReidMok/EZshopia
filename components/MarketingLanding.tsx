'use client';

import React from 'react';
import Link from 'next/link';
import { Store, Sparkles, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

export default function MarketingLanding() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Store className="w-5 h-5" />
            </div>
            <div className="font-extrabold tracking-tight text-lg">Ezshopia</div>
          </div>
          <nav className="flex items-center gap-4">
            <a href="#features" className="text-sm font-semibold text-gray-600 hover:text-gray-900">
              Features
            </a>
            <a href="#pricing" className="text-sm font-semibold text-gray-600 hover:text-gray-900">
              Pricing
            </a>
            <Link href="/sign-in" className="text-sm font-semibold text-gray-900 hover:text-gray-700">
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-extrabold px-4 py-2 rounded-full text-white"
              style={{ backgroundColor: '#2563eb' }}
            >
              Create store
              <ArrowRight className="w-4 h-4 inline ml-2" />
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-blue-600/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-emerald-500/10 blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-white/60">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-blue-700">AI-native storefront builder</span>
                </div>
                <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight">
                  Build and manage a Shopify-like store with AI.
                </h1>
                <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-xl">
                  Ezshopia helps you generate products, listings, SEO content, and run a complete storefront with a clean merchant
                  admin—multi-tenant and shareable.
                </p>
                <div className="mt-7 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-extrabold text-white shadow-sm"
                    style={{ backgroundColor: '#2563eb' }}
                  >
                    Start free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                  <a href="#features" className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold border border-gray-300 text-gray-900 hover:bg-gray-50">
                    Explore features
                  </a>
                </div>

                <div className="mt-9 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="text-sm font-extrabold">Fast setup</div>
                    <div className="text-xs text-gray-600 mt-1">Generate a store in minutes</div>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="text-sm font-extrabold">Real storefront</div>
                    <div className="text-xs text-gray-600 mt-1">Shareable product pages</div>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="text-sm font-extrabold">Admin ready</div>
                    <div className="text-xs text-gray-600 mt-1">Orders, customers, reviews</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-[32px] border border-gray-200 overflow-hidden shadow-sm bg-gradient-to-b from-white to-gray-50">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-extrabold">Ezshopia Demo</div>
                      <div className="text-[11px] font-bold text-gray-500">AI Commerce</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
                        <div className="text-xs font-bold text-blue-700">Products</div>
                        <div className="mt-2 text-lg font-extrabold">AI listings</div>
                      </div>
                      <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
                        <div className="text-xs font-bold text-emerald-700">Orders</div>
                        <div className="mt-2 text-lg font-extrabold">Paid demo</div>
                      </div>
                      <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                        <div className="text-xs font-bold text-slate-700">Reviews</div>
                        <div className="mt-2 text-lg font-extrabold">Moderation</div>
                      </div>
                      <div className="rounded-2xl bg-purple-50 border border-purple-100 p-4">
                        <div className="text-xs font-bold text-purple-700">Theme</div>
                        <div className="mt-2 text-lg font-extrabold">Shopify-like UI</div>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center gap-3 text-xs text-gray-600">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      Store data is isolated per customer store.
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-blue-600/10 blur-2xl" />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Features</div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Everything you need to run a store</h2>
              <p className="mt-3 text-gray-600">
                AI product generation + a real merchant admin + shareable public storefront.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <Zap className="w-6 h-6 text-blue-600" />
                <h3 className="mt-4 text-lg font-extrabold">AI listing & SEO</h3>
                <p className="mt-2 text-sm text-gray-600">Upload an image, generate title, description, tags, and SEO.</p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h3 className="mt-4 text-lg font-extrabold">Store isolation</h3>
                <p className="mt-2 text-sm text-gray-600">Multi-tenant JSON DB with store-scoped APIs.</p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <Store className="w-6 h-6 text-purple-600" />
                <h3 className="mt-4 text-lg font-extrabold">Merchant admin</h3>
                <p className="mt-2 text-sm text-gray-600">Products, orders, customers, reviews, and settings—clean UI.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-14 sm:py-20 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Pricing</div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Simple plans for testing</h2>
              <p className="mt-3 text-gray-600">You can expand into paid tiers later (Stripe integration comes next).</p>
            </div>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-extrabold">Free</div>
                <div className="mt-3 text-3xl font-extrabold">$0</div>
                <div className="mt-2 text-sm text-gray-600">For trying the platform</div>
                <ul className="mt-5 text-sm text-gray-700 space-y-2">
                  <li>Shareable storefront</li>
                  <li>AI products generation</li>
                  <li>Demo checkout</li>
                </ul>
                <Link href="/sign-up" className="mt-6 block w-full text-center px-5 py-3 rounded-full bg-gray-900 text-white font-extrabold text-sm hover:bg-black">
                  Start free
                </Link>
              </div>
              <div className="rounded-3xl border-2 border-blue-600 bg-white p-6 shadow-sm relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-600/10 blur-2xl" />
                <div className="text-sm font-extrabold">PRO</div>
                <div className="mt-3 text-3xl font-extrabold">$19</div>
                <div className="mt-2 text-sm text-gray-600">For serious store owners</div>
                <ul className="mt-5 text-sm text-gray-700 space-y-2">
                  <li>More storefront pages</li>
                  <li>Deeper admin controls</li>
                  <li>Priority AI generations</li>
                </ul>
                <Link href="/sign-up" className="mt-6 block w-full text-center px-5 py-3 rounded-full bg-blue-600 text-white font-extrabold text-sm hover:bg-blue-700">
                  Upgrade later
                </Link>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-extrabold">Enterprise</div>
                <div className="mt-3 text-3xl font-extrabold">Custom</div>
                <div className="mt-2 text-sm text-gray-600">For teams & agencies</div>
                <ul className="mt-5 text-sm text-gray-700 space-y-2">
                  <li>Role-based access</li>
                  <li>Custom domains</li>
                  <li>Advanced workflows</li>
                </ul>
                <a href="#contact" className="mt-6 block w-full text-center px-5 py-3 rounded-full border border-gray-300 text-gray-900 font-extrabold text-sm hover:bg-gray-50">
                  Talk to sales
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Get started</div>
                  <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Ready to build a store with AI?</h2>
                  <p className="mt-3 text-gray-600 max-w-xl">
                    Create your store account and manage it from a Shopify-like admin.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link href="/sign-in" className="px-5 py-3 rounded-full border border-gray-300 bg-white text-gray-900 font-extrabold text-sm hover:bg-gray-50">
                    Sign in
                  </Link>
                  <Link href="/sign-up" className="px-5 py-3 rounded-full bg-blue-600 text-white font-extrabold text-sm hover:bg-blue-700 inline-flex items-center">
                    Create store <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} Ezshopia. Demo commerce platform for AI store building.
          </div>
          <div className="flex gap-4 text-sm font-semibold text-gray-600">
            <a href="#features" className="hover:text-gray-900">Features</a>
            <a href="#pricing" className="hover:text-gray-900">Pricing</a>
            <Link href="/sign-in" className="hover:text-gray-900">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

