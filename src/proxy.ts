import { NextResponse } from 'next/server';

const SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), camera=(), microphone=()',
};

export const config = { matcher: '/:path*' };

export function proxy(): NextResponse {
  const res = NextResponse.next();

  Object.entries(SECURITY_HEADERS).forEach(([k, v]) => res.headers.set(k, v));

  return res;
}
