import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import type { Session } from "next-auth";

// Simple in-memory rate limiter (for production, use Redis)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per minute per IP

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimit.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

export default auth(async (req: NextRequest & { auth: Session | null }) => {
  // Skip rate limiting for static assets
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/static") ||
    req.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Get identifier (IP address)
  const forwarded = req.headers.get("x-forwarded-for");
  const identifier = forwarded ? forwarded.split(',')[0].trim() : req.headers.get("x-real-ip") || "unknown";

  // Check rate limit for API routes (stricter)
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const apiLimit = checkRateLimit(`api:${identifier}`);
    if (!apiLimit) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
  }

  // Check general rate limit
  if (!checkRateLimit(identifier)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  // Protected routes - require authentication
  const protectedPaths = [
    "/dashboard",
    "/profile",
    "/groups",
    "/collaborations",
    "/map",
    "/messages",
  ];

  if (protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
    if (!req.auth) {
      const signInUrl = new URL("/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Add security headers (additional to next.config.ts)
  const response = NextResponse.next();

  // CORS for API routes
  if (req.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("Access-Control-Allow-Origin", process.env.NEXTAUTH_URL || "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }

  return response;
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)  
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
