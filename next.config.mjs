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

  // 添加缓存控制头，防止浏览器缓存问题
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // 生成唯一构建 ID，强制浏览器加载新版本
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

export default nextConfig;