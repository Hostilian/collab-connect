import { createRateLimitResponse, getRateLimitHeaders, rateLimit, rateLimiters } from '@/lib/ratelimit';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Apply rate limiting
  const result = await rateLimit(request, rateLimiters.search);

  if (!result.success) {
    return createRateLimitResponse(result.limit, new Date(result.reset));
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters' },
        {
          status: 400,
          headers: getRateLimitHeaders(result.limit, result.remaining, result.reset),
        }
      );
    }

    // TODO: Implement actual search logic
    // For now, return mock data
    const results = {
      query,
      total: 0,
      page,
      limit,
      results: [],
    };

    return NextResponse.json(results, {
      headers: getRateLimitHeaders(result.limit, result.remaining, result.reset),
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      {
        status: 500,
        headers: getRateLimitHeaders(result.limit, result.remaining, result.reset),
      }
    );
  }
}
