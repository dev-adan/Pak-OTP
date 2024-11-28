import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// This function can check if the request is for a protected route
function isProtectedRoute(pathname) {
  const protectedPaths = ['/dashboard', '/admin'];
  return protectedPaths.some(path => pathname.startsWith(path));
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const pathname = req.nextUrl.pathname;

    // Rate limiting for auth routes
    if (pathname.startsWith('/api/auth')) {
      const ip = req.ip || 'unknown';
      const key = `${ip}:${pathname}`;
      
      // Get current timestamp
      const now = Date.now();
      
      // Initialize or get the rate limit data from memory
      global.rateLimit = global.rateLimit || new Map();
      const rateData = global.rateLimit.get(key) || { count: 0, timestamp: now };
      
      // Reset count if outside the time window (15 minutes)
      if (now - rateData.timestamp > 15 * 60 * 1000) {
        rateData.count = 0;
        rateData.timestamp = now;
      }
      
      // Increment request count
      rateData.count++;
      global.rateLimit.set(key, rateData);
      
      // Check if rate limit exceeded (max 100 requests per 15 minutes)
      if (rateData.count > 100) {
        return new NextResponse(
          JSON.stringify({ error: 'Too many requests, please try again later' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Add rate limit headers
      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', '100');
      response.headers.set('X-RateLimit-Remaining', String(100 - rateData.count));
      response.headers.set('X-RateLimit-Reset', String(rateData.timestamp + 15 * 60 * 1000));
      
      return response;
    }

    // Only apply auth logic to protected routes
    if (isProtectedRoute(pathname)) {
      if (!isAuth) {
        const url = new URL('/', req.url);
        url.searchParams.set('showLogin', 'true');
        return NextResponse.redirect(url);
      }

      // Handle admin routes
      if (pathname.startsWith('/admin') && token.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // For auth pages (login/register), redirect to dashboard if already logged in
    if (pathname.startsWith('/auth') && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Allow the middleware to handle the authorization
        return true;
      },
    },
  }
);

// Update matcher to only include routes that need protection
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/auth/:path*'
  ],
};
