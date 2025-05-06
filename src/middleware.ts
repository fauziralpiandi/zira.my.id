import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

import { securityHeader } from '@/lib/services';

const LOG_PREFIX = '[Middleware]';

const rateLimit = {
  windowMs: 60 * 1000,
  maxRequests: 100,
  requestCounts: new Map<string, { count: number; resetTime: number }>(),

  shouldLimit(ip: string): boolean {
    if (!ip) return false;

    const now = Date.now();
    const record = this.requestCounts.get(ip);

    if (!record || now > record.resetTime) {
      this.requestCounts.set(ip, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return false;
    }

    record.count += 1;

    return record.count > this.maxRequests;
  },

  getRemainingRequests(ip: string): number {
    if (!ip) return this.maxRequests;

    const now = Date.now();
    const record = this.requestCounts.get(ip);

    if (!record || now > record.resetTime) {
      return this.maxRequests;
    }

    return Math.max(0, this.maxRequests - record.count);
  },

  getResetTime(ip: string): number {
    if (!ip) return Date.now() + this.windowMs;

    const record = this.requestCounts.get(ip);

    return record ? record.resetTime : Date.now() + this.windowMs;
  },
};

const analytics = {
  totalRequests: 0,
  pathCounts: new Map<string, number>(),
  userAgents: new Map<string, number>(),
  statusCounts: new Map<number, number>(),
  startTime: Date.now(),

  recordVisit(pathname: string, userAgent: string, status = 200) {
    this.totalRequests++;
    this.pathCounts.set(pathname, (this.pathCounts.get(pathname) || 0) + 1);
    this.statusCounts.set(status, (this.statusCounts.get(status) || 0) + 1);

    const device = this.categorizeUserAgent(userAgent);

    this.userAgents.set(device, (this.userAgents.get(device) || 0) + 1);
  },

  categorizeUserAgent(userAgent: string): string {
    if (!userAgent) return 'Unknown';

    userAgent = userAgent.toLowerCase();

    if (
      userAgent.includes('mobile') ||
      userAgent.includes('android') ||
      userAgent.includes('iphone')
    ) {
      return 'Mobile';
    }

    if (userAgent.includes('tablet') || userAgent.includes('ipad')) {
      return 'Tablet';
    }

    return 'Desktop';
  },

  getSummary() {
    const runningTime = Math.floor((Date.now() - this.startTime) / 1000);
    const topPaths = [...this.pathCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const deviceStats = Object.fromEntries(this.userAgents.entries());
    const statusStats = Object.fromEntries(this.statusCounts.entries());

    return {
      totalRequests: this.totalRequests,
      runningTime: `${runningTime}s`,
      topPaths,
      deviceStats,
      statusStats,
    };
  },
};

const middlewareHeaders = {
  'X-Response-From': 'Middleware',
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
};

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === '/_analytics') {
    return NextResponse.json(analytics.getSummary());
  }

  const { pathname, search } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const start = Date.now();

  if (rateLimit.shouldLimit(ip)) {
    console.warn(`${LOG_PREFIX} Rate limit exceeded for IP: ${ip}`);
    analytics.recordVisit(pathname, userAgent, 429);

    const response = NextResponse.json(
      { error: 'Too Many Requests', message: 'Rate limit exceeded' },
      { status: 429 },
    );

    response.headers.set('Retry-After', '60');
    response.headers.set('X-RateLimit-Limit', rateLimit.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', '0');
    response.headers.set(
      'X-RateLimit-Reset',
      (rateLimit.getResetTime(ip) / 1000).toString(),
    );

    return response;
  }

  analytics.recordVisit(pathname, userAgent);

  console.log(`${LOG_PREFIX} Request: ${request.method} ${pathname}${search}`);

  const response = NextResponse.next();
  const responseTime = Date.now() - start;

  response.headers.set('X-RateLimit-Limit', rateLimit.maxRequests.toString());
  response.headers.set(
    'X-RateLimit-Remaining',
    rateLimit.getRemainingRequests(ip).toString(),
  );
  response.headers.set(
    'X-RateLimit-Reset',
    (rateLimit.getResetTime(ip) / 1000).toString(),
  );
  response.headers.set('X-Response-Time', `${responseTime}ms`);

  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  securityHeader.forEach(({ key, value }) => {
    response.headers.set(key, value);
  });

  console.log(
    `${LOG_PREFIX} Response: ${request.method} ${pathname}${search} - ${responseTime}ms`,
  );

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|imgs/|fonts/).*)',
    '/_analytics',
  ],
};
