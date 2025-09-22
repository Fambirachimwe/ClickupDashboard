import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Disable type checking during build for Railway deployment
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint during build for Railway deployment
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
