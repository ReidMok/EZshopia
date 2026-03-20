'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import SuperAdminDashboard from '../../components/SuperAdminDashboard';
import { clearClientSession } from '../../lib/authSession';

export default function AdminHome() {
  const router = useRouter();

  return (
    <div>
      <div className="px-6 py-4 border-b border-gray-100 bg-white flex items-center justify-between">
        <div className="text-sm font-bold text-gray-900">Platform Admin</div>
        <button
          onClick={async () => {
            try {
              await fetch('/api/auth/logout', { method: 'POST' });
            } catch {}
            clearClientSession();
            router.push('/sign-in');
          }}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold hover:bg-gray-50"
        >
          Logout
        </button>
      </div>
      <SuperAdminDashboard />
    </div>
  );
}

