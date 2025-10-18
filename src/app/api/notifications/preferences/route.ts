/**
 * Notification Preferences API
 * GET /api/notifications/preferences - Get user's notification preferences
 * PATCH /api/notifications/preferences - Update notification preferences
 */

import { auth } from '@/lib/auth';
import { getNotificationPreferences, updateNotificationPreferences } from '@/lib/notifications';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences = await getNotificationPreferences(session.user.id);

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const preferences = await updateNotificationPreferences(
      session.user.id,
      body
    );

    return NextResponse.json({
      preferences,
      message: 'Preferences updated successfully',
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}
