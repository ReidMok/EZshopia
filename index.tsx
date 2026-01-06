import React from 'react';
import { createRoot } from 'react-dom/client';
// Explicitly add .tsx extension for browser-based preview environments
// This file is NOT used by Next.js build, so it is safe to modify for preview only.
// @ts-ignore
import App from './App.tsx';

console.log("Starting Ezshopia App...");

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
        <App />
    );
    console.log("React Root Mounted");
  } catch (e: any) {
    console.error("Failed to mount React root:", e);
    container.innerHTML = `<div style="color:red; padding:20px;">
      <h3>App Crash</h3>
      <p>${e.message}</p>
    </div>`;
  }
} else {
  console.error("Root element not found");
}