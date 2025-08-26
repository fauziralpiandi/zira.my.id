import { NextResponse, type NextRequest } from 'next/server';

const WINDOW_MS = 6e4;
const MAX_REQ = 100;

const store = new Map<string, { count: number; reset: number }>();

const SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Content-Security-Policy':
    "default-src 'self'; img-src * data:; script-src 'self'; style-src 'self' 'unsafe-inline';",
};

export function middleware(req: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/')) {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    const now = Date.now();
    const rec = store.get(ip) ?? { count: 0, reset: now + WINDOW_MS };

    if (now > rec.reset) {
      rec.count = 0;
      rec.reset = now + WINDOW_MS;
    }

    rec.count++;
    store.set(ip, rec);

    if (rec.count > MAX_REQ) {
      const res = NextResponse.json(
        { error: 'Too Many Requests' },
        { status: 429 },
      );

      res.headers.set(
        'Retry-After',
        Math.ceil((rec.reset - now) / 1e3).toString(),
      );
      res.headers.set('X-RateLimit-Limit', MAX_REQ.toString());
      res.headers.set('X-RateLimit-Remaining', '0');

      applySecurityHeaders(res);

      return res;
    }

    const res = NextResponse.next();

    res.headers.set('X-RateLimit-Limit', MAX_REQ.toString());
    res.headers.set('X-RateLimit-Remaining', String(MAX_REQ - rec.count));
    res.headers.set(
      'X-RateLimit-Reset',
      Math.floor(rec.reset / 1e3).toString(),
    );

    applySecurityHeaders(res);

    return res;
  }

  const res = NextResponse.next();

  applySecurityHeaders(res);

  return res;
}

function applySecurityHeaders(res: NextResponse) {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.headers.set(k, v);
}

export const config = {
  matcher: ['/api/:path*', '/(.*)'],
};
