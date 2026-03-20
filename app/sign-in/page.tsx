'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setClientSession } from '../../lib/authSession';
import { Mail, Lock, ArrowRight, Store } from 'lucide-react';

const ROOT_DOMAIN = 'ezshopia.com';

function buildMerchantAdminHref(storeKey: string) {
  if (typeof window === 'undefined') return `/s/${encodeURIComponent(storeKey)}/admin`;

  const hostname = window.location.hostname.toLowerCase();
  const rootSuffix = `.${ROOT_DOMAIN}`;
  if (hostname.endsWith(rootSuffix)) {
    const sub = hostname.slice(0, -rootSuffix.length);
    if (sub === storeKey) return '/admin';
  }

  return `/s/${encodeURIComponent(storeKey)}/admin`;
}

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || 'signin_failed');
        return;
      }

      setClientSession({
        userId: data.user.id,
        storeKey: data.user.storeKey,
        role: data.user.role,
      });

      router.push(buildMerchantAdminHref(data.user.storeKey));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <Store className="w-6 h-6" />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-center text-gray-900">Sign in</h1>
        <p className="text-center text-sm text-gray-600 mt-1">Access your merchant admin</p>

        <form className="mt-8 bg-white p-6 rounded-xl border border-gray-200" onSubmit={onSubmit}>
          {error ? <div className="mb-4 text-sm text-red-600 font-semibold">{error}</div> : null}

          <label className="block text-sm font-semibold text-gray-700" htmlFor="email">
            Email
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="you@store.com"
            />
          </div>

          <label className="block text-sm font-semibold text-gray-700 mt-4" htmlFor="password">
            Password
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gray-900 text-white font-extrabold text-sm hover:bg-black disabled:opacity-50"
          >
            {loading ? 'Signing in...' : <>Sign in <ArrowRight className="w-4 h-4" /></>}
          </button>

          <div className="mt-4 text-center text-sm text-gray-600">
            New here?{' '}
            <a href="/sign-up" className="font-extrabold text-blue-600 hover:text-blue-500">
              Create store
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

