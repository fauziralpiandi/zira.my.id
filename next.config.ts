import { type NextConfig } from 'next';
import { withContentlayer } from 'next-contentlayer2';

import { securityHeader } from '~/lib/services';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BASE_URL:
      process.env.NODE_ENV === 'production'
        ? 'https://zira.my.id'
        : 'http://localhost:3000',
  },
  headers() {
    if (process.env.NODE_ENV !== 'production') {
      return Promise.resolve([]);
    }
    return Promise.resolve([
      {
        source: '/(.*)',
        headers: securityHeader,
      },
    ]);
  },
  images: {
    qualities: [100],
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
