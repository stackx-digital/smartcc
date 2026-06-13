import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ringgitplus.com',
        pathname: '/assets/img/credit-card/**',
      },
    ],
  },
};

export default nextConfig;
