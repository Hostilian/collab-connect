/**
 * Reputation API
 * GET /api/reputation/:userId - Get user reputation
 * POST /api/reputation/rate - Submit a rating
 */

import { auth } from '@/lib/auth';
import { rateLimit, rateLimiters } from '@/lib/ratelimit';
import { getRatingsBreakdown, getReputation, submitRating } from '@/lib/reputation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const params = await context.params;
    const userId = params.userId;

    const [reputation, breakdown] = await Promise.all([
      getReputation(userId),
      getRatingsBreakdown(userId),
    ]);

    return NextResponse.json({
      reputation,
      breakdown,
    });
  } catch (error) {
    console.error('Reputation get error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Rate limiting: 20 ratings per hour
    const rateLimitResult = await rateLimit(req, rateLimiters.api, `rating:${session.user.id}`);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { toUserId, rating, category, comment, collaborationId, isAnonymous } = body;

    if (!toUserId || !rating || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await submitRating({
      fromUserId: session.user.id,
      toUserId,
      rating,
      category,
      comment,
      collaborationId,
      isAnonymous,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Rating submitted successfully',
    });
  } catch (error) {
    console.error('Rating submit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
