import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simplified middleware without NextAuth to avoid Edge Runtime compatibility issues
// Auth will be checked on the page level using getServerSession
export function middleware(request: NextRequest) {
  // For now, just pass through all requests
  // TODO: Implement auth checks using a different approach if needed
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
