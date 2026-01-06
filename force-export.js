#!/usr/bin/env node
// Force create out directory if Next.js didn't create it
const fs = require('fs');
const path = require('path');

const outDir = path.join(process.cwd(), 'out');
const nextDir = path.join(process.cwd(), '.next');

console.log('Checking if we need to manually create out directory...');

if (!fs.existsSync(outDir)) {
  console.log('out directory does not exist, checking .next directory...');
  
  if (fs.existsSync(nextDir)) {
    console.log('Found .next directory, checking for static files...');
    
    // Check if .next/static exists
    const staticDir = path.join(nextDir, 'static');
    if (fs.existsSync(staticDir)) {
      console.log('Found .next/static, but out directory was not created.');
      console.log('This suggests Next.js did not perform static export.');
      console.log('');
      console.log('Possible solutions:');
      console.log('1. Check next.config.mjs - ensure output: "export" is set');
      console.log('2. Ensure no server-side features are used');
      console.log('3. Try updating Next.js version');
      console.log('4. Check for any build errors in the logs');
      process.exit(1);
    } else {
      console.log('No .next/static found either.');
      process.exit(1);
    }
  } else {
    console.log('No .next directory found - build may have failed');
    process.exit(1);
  }
} else {
  console.log('✓ out directory exists - no action needed');
  process.exit(0);
}

