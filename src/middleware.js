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

    // If accessing protected route while logged in, proceed without redirect
    if (isAuth && isProtectedRoute(pathname)) {
      return NextResponse.next();
    }

    // If accessing dashboard without auth, redirect to home with login modal
    if (isProtectedRoute(pathname) && !isAuth) {
      const redirectUrl = new URL('/', req.url);
      redirectUrl.searchParams.set('showLogin', 'true');
      redirectUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Handle admin routes
    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token; // Ensure token presence for authorization
      },
    },
    pages: {
      signIn: '/',
      error: '/',
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/'
  ]
};
