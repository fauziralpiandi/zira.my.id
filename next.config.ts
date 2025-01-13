import { type NextConfig } from 'next';
import { withContentlayer } from 'next-contentlayer2';
import withBundleAnalyzer from '@next/bundle-analyzer';

import { securityHeader } from '~/lib/services';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: false,
  },
  env: {
    NEXT_PUBLIC_BASE_URL:
      process.env.NODE_ENV === 'production'
        ? 'https://zira.my.id'
        : 'http://localhost:3000',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/**',
      },
    ],
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
};

export default withContentlayer(bundleAnalyzer(nextConfig));
