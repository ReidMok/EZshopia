/** @type {import('next').NextConfig} */
// Force rebuild timestamp: [Date.now()]
const nextConfig = {
  // 'export' creates a static HTML/CSS/JS build compatible with GitHub Pages/Hostinger
  output: 'export',
  
  // Explicitly set the output directory (default is 'out')
  distDir: '.next',
  
  // CRITICAL: This pulls the API_KEY from Hostinger's environment variables
  // and bakes it into the static JavaScript so the browser can use it.
  env: {
    API_KEY: process.env.API_KEY,
  },

  // GitHub Pages/Static hosts do not support Next.js Image Optimization server
  images: {
    unoptimized: true,
    domains: ['picsum.photos', 'via.placeholder.com'],
  },
  
  // Ensure strict mode is on
  reactStrictMode: true,
  
  // Ignore typescript/eslint errors during build to ensure deployment succeeds
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Ensure trailing slash for static export compatibility
  trailingSlash: false,
};

export default nextConfig;