import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory store for rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<
  string,
  { requests: number[]; blocked: boolean }
>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of Array.from(rateLimitMap.entries())) {
    value.requests = value.requests.filter((time) => now - time < 300000); // 5 minutes
    if (value.requests.length === 0) {
      rateLimitMap.delete(key);
    }
  }
}, 300000);

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 
              request.headers.get('x-real-ip') || 
              'unknown';
  const path = request.nextUrl.pathname;
  const now = Date.now();

  // Different limits for different endpoints based on cost and risk
  const limits: Record<string, { maxRequests: number; windowMs: number }> = {
    '/api/ai/generate-reading': { maxRequests: 5, windowMs: 60000 }, // 5 per minute - expensive AI calls
    '/api/astrology-chart': { maxRequests: 10, windowMs: 60000 }, // 10 per minute - external API
    '/api/timezone': { maxRequests: 20, windowMs: 60000 }, // 20 per minute - external API
    default: { maxRequests: 30, windowMs: 60000 }, // 30 per minute - general endpoints
  };

  const limit = limits[path];
  const finalLimit = limit || limits.default;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { requests: [], blocked: false });
  }

  const userData = rateLimitMap.get(ip)!;

  // Remove old requests outside window
  userData.requests = userData.requests.filter(
    (time) => now - time < finalLimit.windowMs
  );

  if (userData.requests.length >= finalLimit.maxRequests) {
    const oldestRequest = userData.requests[0];
    const retryAfter = Math.ceil(
      (finalLimit.windowMs - (now - oldestRequest)) / 1000
    );

    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        retryAfter,
        limit: finalLimit.maxRequests,
        windowMs: finalLimit.windowMs,
      },
      { status: 429 }
    );
  }

  userData.requests.push(now);

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
