#!/usr/bin/env node
// Verify that the build output directory exists
const fs = require('fs');
const path = require('path');

const outDir = path.join(process.cwd(), 'out');

console.log('Verifying build output...');
console.log('Current working directory:', process.cwd());
console.log('Looking for output directory:', outDir);

if (fs.existsSync(outDir)) {
  const stats = fs.statSync(outDir);
  if (stats.isDirectory()) {
    const files = fs.readdirSync(outDir);
    console.log('✓ SUCCESS: out directory exists');
    console.log('✓ Directory contains', files.length, 'items');
    console.log('✓ First few files:', files.slice(0, 5).join(', '));
    
    // Check for index.html
    if (files.includes('index.html')) {
      console.log('✓ index.html found');
    } else {
      console.log('⚠ WARNING: index.html not found in out directory');
    }
    
    process.exit(0);
  } else {
    console.error('✗ ERROR: out exists but is not a directory');
    process.exit(1);
  }
} else {
  console.error('✗ ERROR: out directory does not exist');
  console.error('Current directory contents:', fs.readdirSync(process.cwd()).join(', '));
  process.exit(1);
}

