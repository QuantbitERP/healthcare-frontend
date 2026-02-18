import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  // useCache: true,
  images: {
    disableStaticImages: false, // enabled by default
  },
  // Configure for deployment with base path
  basePath: '/pos',
  assetPrefix: '/pos',
  // Configure port for deployment
  port: 4430,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.(js|jsx|ts|tsx)$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
