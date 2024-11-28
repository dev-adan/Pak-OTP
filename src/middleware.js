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

    // Only apply auth logic to protected routes
    if (isProtectedRoute(pathname)) {
      if (!isAuth) {
        // Redirect to home page with login modal
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

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (isProtectedRoute(req.nextUrl.pathname)) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/auth/:path*',
    '/api/auth/:path*'
  ]
};
