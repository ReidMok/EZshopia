'use client';

import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

// Dynamically import App with ssr: false to prevent hydration errors 
// because App.tsx uses localStorage which is browser-only.
const App = dynamic(() => import('../App'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-900">Ezshopia</h2>
        <p className="text-gray-500">Starting AI Engine...</p>
      </div>
    </div>
  )
});

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900">Ezshopia</h2>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <App />
    </Suspense>
  );
}
