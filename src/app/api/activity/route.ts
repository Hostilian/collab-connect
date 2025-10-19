/**
 * Activity Feed API
 * GET /api/activity - Get activity feed
 */

import { getGlobalActivityFeed, getUserActivityFeed } from '@/lib/activity';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);

    const type = searchParams.get('type') as 'user' | 'global' || 'user';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (type === 'user') {
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      const activities = await getUserActivityFeed(session.user.id, {
        limit,
        offset,
        includePrivate: true,
      });

      return NextResponse.json({ activities });
    }

    // Global feed
    const activities = await getGlobalActivityFeed({ limit, offset });

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Activity feed error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
