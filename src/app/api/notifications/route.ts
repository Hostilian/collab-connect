/**
 * Notifications API
 * GET /api/notifications - Get user's notifications
 * POST /api/notifications/mark-all-read - Mark all as read
 */

import { auth } from '@/lib/auth';
import { getUnreadCount, getUserNotifications } from '@/lib/notifications';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const [notifications, unreadCount] = await Promise.all([
      getUserNotifications(session.user.id, { unreadOnly, limit, offset }),
      getUnreadCount(session.user.id),
    ]);

    return NextResponse.json({
      notifications,
      unreadCount,
      hasMore: notifications.length === limit,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
