const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // API 설정
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*'
      }
    ];
  },

  // 환경 변수 설정
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // 이미지 최적화 설정
  images: {
    domains: ['blog.naver.com', 'postfiles.pstatic.net'],
  },

  // 실험적 기능
  experimental: {
    serverComponentsExternalPackages: ['cheerio']
  }
};

module.exports = nextConfig;
