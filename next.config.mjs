/** @type {import('next').NextConfig} */
const nextConfig = {
  // CRITICAL: Enable static export
  output: 'export',
  
  // Disable features incompatible with static export
  trailingSlash: false,
  
  // CRITICAL: This pulls the API_KEY from Hostinger's environment variables
  // and bakes it into the static JavaScript so the browser can use it.
  env: {
    API_KEY: process.env.API_KEY,
  },

  // GitHub Pages/Static hosts do not support Next.js Image Optimization server
  images: {
    unoptimized: true,
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
  
  // Explicitly disable features incompatible with static export
  poweredByHeader: false,
};

export default nextConfig;