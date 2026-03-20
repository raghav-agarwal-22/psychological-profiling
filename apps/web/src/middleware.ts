import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Capture ?ref=CODE and set a 90-day affiliate attribution cookie
export function middleware(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get('ref')
  const response = NextResponse.next()

  if (ref) {
    // Only set if not already attributed (first-touch attribution)
    if (!request.cookies.get('innermind_affiliate_ref')) {
      response.cookies.set('innermind_affiliate_ref', ref, {
        maxAge: 60 * 60 * 24 * 90, // 90 days
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
    }
  }

  return response
}

export const config = {
  matcher: [
    // Run on all routes except static assets and API routes
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}
