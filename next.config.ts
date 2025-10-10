import type { NextConfig } from 'next';
import { withContentlayer } from 'next-contentlayer2';

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    qualities: [100],
    localPatterns: [
      {
        pathname: '/imgs/**',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        pathname: '/**',
      },
    ],
  },
};

export default withContentlayer(nextConfig);
