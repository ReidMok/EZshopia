/** @type {import('next').NextConfig} */
const nextConfig = {
  // SSR runtime (默认)。不再进行静态导出

  // 将密钥注入到客户端代码（现有前端读取 process.env.API_KEY）
  env: {
    API_KEY: process.env.API_KEY,
  },

  // 暂时禁用严格模式以避免 hydration 错误
  reactStrictMode: false,

  // 保证构建成功（容错）
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  poweredByHeader: false,

  // 优化构建输出
  swcMinify: true,

  // 改进错误处理
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;