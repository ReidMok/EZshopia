import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ezshopia - AI Commerce',
  description: 'Self-hosted AI Commerce Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Tailwind CDN Fallback for safety */}
        <script src="https://cdn.tailwindcss.com"></script>
        {/* Inter font from Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`body { font-family: 'Inter', sans-serif; }`}</style>
      </head>
      <body className="bg-gray-50 min-h-screen text-slate-900">
        <div id="app-root" className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}