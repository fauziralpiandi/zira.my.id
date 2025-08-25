import { NextResponse, type NextRequest } from 'next/server';

const WINDOW_MS = 60 * 1e3;
const MAX_REQ = 100;

const securityHeaders: Record<string, string> = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-XSS-Protection': '1; mode=block',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'X-Response-From': 'Middleware',
};

const counts = new Map<string, { count: number; reset: number }>();

const stats = {
  total: 0,
  paths: new Map<string, number>(),
  devices: new Map<string, number>(),
  statuses: new Map<number, number>(),
  start: Date.now(),
};

const deviceType = (ua: string) => {
  ua = ua.toLowerCase();

  if (
    ua.includes('mobile') ||
    ua.includes('android') ||
    ua.includes('iphone')
  ) {
    return 'Mobile';
  }

  if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'Tablet';
  }

  return 'Desktop';
};

const record = (path: string, ua: string, status = 200) => {
  stats.total++;
  stats.paths.set(path, (stats.paths.get(path) || 0) + 1);
  stats.statuses.set(status, (stats.statuses.get(status) || 0) + 1);
  stats.devices.set(
    deviceType(ua),
    (stats.devices.get(deviceType(ua)) || 0) + 1,
  );
};

const checkRateLimit = (ip?: string) => {
  if (!ip) {
    return {
      limited: false,
      remaining: MAX_REQ,
      reset: Date.now() + WINDOW_MS,
    };
  }

  const now = Date.now();
  const rec = counts.get(ip);

  if (!rec || now > rec.reset) {
    counts.set(ip, { count: 1, reset: now + WINDOW_MS });

    return { limited: false, remaining: MAX_REQ - 1, reset: now + WINDOW_MS };
  }

  rec.count++;

  return {
    limited: rec.count > MAX_REQ,
    remaining: Math.max(0, MAX_REQ - rec.count),
    reset: rec.reset,
  };
};

export function middleware(req: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;
  const ua = req.headers.get('user-agent') || 'Unknown';
  const ip = req.headers.get('x-forwarded-for') || '';
  const start = Date.now();

  if (pathname === '/_analytics') {
    return NextResponse.json({
      total: stats.total,
      uptime: `${Math.floor((Date.now() - stats.start) / 1e3)}s`,
      topPaths: [...stats.paths.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
      devices: Object.fromEntries(stats.devices.entries()),
      statuses: Object.fromEntries(stats.statuses.entries()),
    });
  }

  const { limited, remaining, reset } = checkRateLimit(ip);

  if (limited) {
    record(pathname, ua, 429);

    return NextResponse.json(
      { error: 'Too Many Requests' },
      {
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': MAX_REQ.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': (reset / 1e3).toString(),
        },
      },
    );
  }

  record(pathname, ua);

  const res = NextResponse.next();
  const time = Date.now() - start;

  res.headers.set('X-RateLimit-Limit', MAX_REQ.toString());
  res.headers.set('X-RateLimit-Remaining', remaining.toString());
  res.headers.set('X-RateLimit-Reset', (reset / 1e3).toString());
  res.headers.set('X-Response-Time', `${time}ms`);

  Object.entries(securityHeaders).forEach(([k, v]) => res.headers.set(k, v));

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|imgs/|fonts/).*)',
    '/_analytics',
  ],
};
