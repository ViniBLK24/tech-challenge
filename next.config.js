
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ["tech-challenge-upload.s3.us-east-2.amazonaws.com"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configuração para Multi-Zones
  experimental: {
    appDir: true,
  },
  // Configuração para permitir carregamento de zonas externas
  async rewrites() {
    return [
      {
        source: '/investments/:path*',
        destination: 'https://investiment-mf.vercel.app/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/investments/:path*', // Applies to all routes
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Or 'DENY' based on your security requirements
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;