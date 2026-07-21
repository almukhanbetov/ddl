import type { NextConfig } from "next";

const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082');

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    // Backend is self-hosted on the same private network (localhost in dev);
    // Next 16 blocks image optimization from local IPs unless opted in.
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: apiUrl.protocol.replace(':', '') as 'http' | 'https',
        hostname: apiUrl.hostname,
        port: apiUrl.port || '',
        pathname: '/uploads/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
