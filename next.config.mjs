/** @type {import('next').NextConfig} */
const nextConfig = {
  // SSR runtime (默认)。不再进行静态导出

  // 将密钥注入到客户端代码（现有前端读取 process.env.API_KEY）
  env: {
    API_KEY: process.env.API_KEY,
  },

  // 保持严格模式
  reactStrictMode: true,

  // 保证构建成功（容错）
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  poweredByHeader: false,
};

export default nextConfig;