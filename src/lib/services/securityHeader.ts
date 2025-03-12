const csp = `
    default-src 'self';
    script-src 'self';
    style-src 'self';
    img-src 'self' https:;
    font-src 'self';
    base-uri 'self';
    form-action 'self';
    frame-src 'self';
    frame-ancestors 'none';
`.replace(/\n/g, '');

export const securityHeader = [
  {
    key: 'Content-Security-Policy',
    value: csp,
  },
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
];
