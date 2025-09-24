import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    // OR if you're not using remotePatterns:
    // domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
