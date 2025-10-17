export { auth as middleware } from "@/lib/auth"

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/groups/:path*",
    "/collaborations/:path*",
    "/map/:path*",
  ],
}
