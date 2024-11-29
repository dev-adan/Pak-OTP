import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: '/?showLogin=true',
  },
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/auth/sessions',
    '/api/auth/revoke-session/:path*',
    '/api/auth/revoke-all-sessions',
    '/settings/:path*'
  ]
}
