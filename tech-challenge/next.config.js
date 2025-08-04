const { NextFederationPlugin } = require('@module-federation/nextjs-mf');

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    domains: ["tech-challenge-upload.s3.us-east-2.amazonaws.com"],
  },
  // Desabilitar verificações do TypeScript durante o build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Desabilitar verificações do ESLint durante o build
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, options) => {
    const { isServer } = options;
    
    config.plugins.push(
      new NextFederationPlugin({
        name: 'shell',
        remotes: {
          investments: `investments@http://localhost:3001/_next/static/chunks/remoteEntry.js`,
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: false,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: false,
          },
        },
      })
    );

    return config;
  },
};

module.exports = nextConfig; 