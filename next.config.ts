import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracing: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Enable any experimental features if needed
  },
  // Disable source maps in production for smaller bundle size
  productionBrowserSourceMaps: false,
};

export default nextConfig;
