import { type NextConfig } from 'next';
import { withContentlayer } from 'next-contentlayer2';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { securityHeader } from '~/lib/services';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BASE_URL:
      'https://f15ee32c-67bc-4d82-a8cc-d1723530eafd-00-ssx75znq6k9z.pike.replit.dev',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
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
