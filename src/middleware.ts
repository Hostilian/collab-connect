import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware is simplified to avoid Edge Runtime issues with next-auth
// Authentication is handled in the actual route handlers and API routes
export function middleware(_request: NextRequest) {
  // For now, just pass through all requests
  // In production, you would check authentication via API routes or getServerSession
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/groups/:path*",
    "/collaborations/:path*",
    "/map/:path*",
  ],
}
