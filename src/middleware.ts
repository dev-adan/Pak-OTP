import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = request.nextUrl.pathname;

  const response = NextResponse.next();

  // Get the host from the request
  const host = request.headers.get('host') || '';
  const origin = host.includes('localhost') ? 'http://localhost:3000' : `https://${host}`;

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Return modified response
  return response;
}

// Configure which paths middleware will be applied to
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /_next/* (Next.js internals)
     * 2. /favicon.ico (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
