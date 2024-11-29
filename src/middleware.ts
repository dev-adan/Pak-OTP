import { withAuth } from "next-auth/middleware"
import { NextResponse, NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request });

  // Check if accessing protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      const loginUrl = new URL('/?showLogin=true', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Additional session validation
    if (!session.email || !session.sub) {
      const loginUrl = new URL('/?showLogin=true', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Add session info to headers for server components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', session.sub);
    requestHeaders.set('x-user-email', session.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
