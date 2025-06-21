import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracing: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Enable output file tracing for smaller Docker images
    outputFileTracingRoot: process.cwd(),
  },
  // Disable source maps in production for smaller bundle size
  productionBrowserSourceMaps: false,
};

export default nextConfig;
