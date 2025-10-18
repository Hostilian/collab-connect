/**
 * Notification Management API
 * POST /api/notifications/mark-all-read - Mark all notifications as read
 */

import { auth } from '@/lib/auth';
import { markAllAsRead } from '@/lib/notifications';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await markAllAsRead(session.user.id);

    return NextResponse.json({
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 }
    );
  }
}
