import postgres from 'postgres'

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is not defined')
}

export const sql = postgres(process.env.POSTGRES_URL, {
  ssl: process.env.NODE_ENV === 'production' ? 'require' : 'allow',
})

const securityHeaders = [
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

const cspHeader = (nonce) =>
  `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\n/g, '')

const nextConfig = {
  async headers() {
    if (process.env.NODE_ENV === 'production') {
      const nonce = Buffer.from(`${Date.now()}`).toString('base64')
      return [
        {
          source: '/(.*)',
          headers: [
            ...securityHeaders,
            {
              key: 'Content-Security-Policy',
              value: cspHeader(nonce),
            },
          ],
        },
      ]
    }
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ]
  },
}

export default nextConfig
