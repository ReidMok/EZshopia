#!/usr/bin/env node
// Manually copy build output to out directory if Next.js didn't create it
const fs = require('fs');
const path = require('path');

const outDir = path.join(process.cwd(), 'out');
const nextDir = path.join(process.cwd(), '.next');

console.log('Attempting to manually create out directory from .next...');

if (fs.existsSync(outDir)) {
  console.log('✓ out directory already exists');
  process.exit(0);
}

if (!fs.existsSync(nextDir)) {
  console.error('✗ .next directory does not exist - build may have failed');
  process.exit(1);
}

// Create out directory
fs.mkdirSync(outDir, { recursive: true });
console.log('✓ Created out directory');

// Copy static files from .next/static to out/_next/static
const staticDir = path.join(nextDir, 'static');
if (fs.existsSync(staticDir)) {
  const outStaticDir = path.join(outDir, '_next', 'static');
  fs.mkdirSync(outStaticDir, { recursive: true });
  
  function copyRecursive(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  
  copyRecursive(staticDir, outStaticDir);
  console.log('✓ Copied static files');
}

// Copy HTML files from .next/server/app to out
const serverAppDir = path.join(nextDir, 'server', 'app');
if (fs.existsSync(serverAppDir)) {
  function copyHtmlFiles(src, dest, basePath = '') {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, basePath ? path.join(basePath, entry.name) : entry.name);
      
      if (entry.isDirectory()) {
        if (entry.name === 'page') {
          // This is a page directory, look for HTML files
          const pageFiles = fs.readdirSync(srcPath);
          for (const file of pageFiles) {
            if (file.endsWith('.html')) {
              const htmlSrc = path.join(srcPath, file);
              const htmlDest = path.join(dest, basePath ? `${basePath}.html` : 'index.html');
              fs.copyFileSync(htmlSrc, htmlDest);
              console.log(`✓ Copied ${htmlDest}`);
            }
          }
        } else {
          fs.mkdirSync(destPath, { recursive: true });
          copyHtmlFiles(srcPath, destPath, path.join(basePath, entry.name));
        }
      }
    }
  }
  
  copyHtmlFiles(serverAppDir, outDir);
}

// Create a basic index.html if it doesn't exist
const indexHtml = path.join(outDir, 'index.html');
if (!fs.existsSync(indexHtml)) {
  const basicHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ezshopia</title>
</head>
<body>
  <div id="app-root"></div>
  <script src="/_next/static/chunks/main.js"></script>
</body>
</html>`;
  fs.writeFileSync(indexHtml, basicHtml);
  console.log('✓ Created basic index.html');
}

console.log('✓ Manual export completed');
process.exit(0);

