import { type NextRequest, NextResponse } from 'next/server';

const MAX_REQ = 100;
const WINDOW_MS = 6e4; // 1 min
const SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), camera=(), microphone=()',
};

const store = new Map<string, { count: number; reset: number }>();

export function proxy(req: NextRequest): NextResponse {
  const res = NextResponse.next();

  Object.entries(SECURITY_HEADERS).forEach(([k, v]) => res.headers.set(k, v));

  if (process.env.NODE_ENV !== 'production') {
    return res;
  }

  if (!req.nextUrl.pathname.startsWith('/api/')) {
    return res;
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  const now = Date.now();

  let rec = store.get(ip) ?? { count: 0, reset: now + WINDOW_MS };

  if (now > rec.reset) rec = { count: 0, reset: now + WINDOW_MS };

  rec.count++;
  store.set(ip, rec);

  if (rec.count > MAX_REQ) {
    const r = NextResponse.json(
      { error: 'Too Many Requests' },
      { status: 429 },
    );

    r.headers.set('Retry-After', String(Math.ceil((rec.reset - now) / 1e3)));

    return r;
  }

  res.headers.set('X-RateLimit-Limit', String(MAX_REQ));
  res.headers.set('X-RateLimit-Remaining', String(MAX_REQ - rec.count));

  return res;
}

export const config = { matcher: ['/api/:path*', '/(.*)'] };
