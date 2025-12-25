import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // Security headers
  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      // Comprehensive Content Security Policy
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.vercel.app https://*.sentry.io https://maps.googleapis.com https://www.googleapis.com https:",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "img-src 'self' data: https: blob: https://maps.gstatic.com *.googleapis.com *.ggpht.com",
          "font-src 'self' https://fonts.gstatic.com",
          "connect-src 'self' https:",
          "frame-src 'self' https://*.vercel.app",
          "worker-src blob:",
          "child-src blob:",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          "upgrade-insecure-requests"
        ].join('; ')
      },
      // Permissions Policy (formerly Feature Policy)
      {
        key: 'Permissions-Policy',
        value: 'geolocation=(self), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
      },
      // Additional security headers
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
      { key: 'X-Download-Options', value: 'noopen' },
      { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
    ]

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
};

export default nextConfig;
