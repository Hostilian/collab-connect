import { NextResponse } from 'next/server';

export async function GET() {
  const robots = `
# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /auth/
Disallow: /profile/edit

# Sitemaps
Sitemap: https://collab-connect.com/sitemap.xml
  `.trim();

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
