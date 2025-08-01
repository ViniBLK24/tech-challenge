import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
};

export default nextConfig;
