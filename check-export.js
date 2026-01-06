#!/usr/bin/env node
// Check if Next.js actually performed the export
const fs = require('fs');
const path = require('path');

console.log('Checking Next.js build output...');
console.log('Current directory:', process.cwd());

const nextDir = path.join(process.cwd(), '.next');
const outDir = path.join(process.cwd(), 'out');

// Check .next directory
if (fs.existsSync(nextDir)) {
  console.log('✓ .next directory exists');
  const nextContents = fs.readdirSync(nextDir);
  console.log('  Contents:', nextContents.join(', '));
  
  // Check for export manifest
  const exportManifest = path.join(nextDir, 'export-marker.json');
  if (fs.existsSync(exportManifest)) {
    console.log('✓ Export marker found');
  } else {
    console.log('⚠ No export marker found - Next.js may not have performed export');
  }
} else {
  console.log('✗ .next directory does not exist');
}

// Check out directory
if (fs.existsSync(outDir)) {
  console.log('✓ out directory exists');
  const outContents = fs.readdirSync(outDir);
  console.log('  Contents:', outContents.slice(0, 10).join(', '));
  console.log('  Total files:', outContents.length);
} else {
  console.log('✗ out directory does not exist');
  console.log('  This means Next.js did not perform static export');
  console.log('  Possible reasons:');
  console.log('  1. output: "export" not properly configured');
  console.log('  2. Using features incompatible with static export');
  console.log('  3. Next.js version issue');
}

