/**
 * Activity Feed System
 * Tracks and displays user activities
 */

import { prisma } from './prisma';

export type ActivityType =
  | 'profile_update'
  | 'collaboration_joined'
  | 'collaboration_completed'
  | 'group_created'
  | 'group_joined'
  | 'rating_received'
  | 'badge_earned'
  | 'verification_completed'
  | 'location_shared';

/**
 * Create an activity entry
 */
export async function createActivity(params: {
  userId: string;
  actorId?: string;
  type: ActivityType;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  isPublic?: boolean;
}): Promise<{ success: boolean; activityId?: string }> {
  try {
    const activity = await prisma.activity.create({
      data: {
        userId: params.userId,
        actorId: params.actorId,
        type: params.type,
        title: params.title,
        description: params.description,
        metadata: params.metadata as never,
        isPublic: params.isPublic ?? true,
      },
    });

    return {
      success: true,
      activityId: activity.id,
    };
  } catch (error) {
    console.error('Error creating activity:', error);
    return { success: false };
  }
}

/**
 * Get activity feed for a user
 */
export async function getUserActivityFeed(
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    includePrivate?: boolean;
  } = {}
) {
  const { limit = 50, offset = 0, includePrivate = false } = options;

  const activities = await prisma.activity.findMany({
    where: {
      userId,
      ...(includePrivate ? {} : { isPublic: true }),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });

  return activities;
}

/**
 * Get global activity feed (public activities from all users)
 */
export async function getGlobalActivityFeed(options: {
  limit?: number;
  offset?: number;
  type?: ActivityType;
} = {}) {
  const { limit = 50, offset = 0, type } = options;

  const activities = await prisma.activity.findMany({
    where: {
      isPublic: true,
      ...(type ? { type } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });

  return activities;
}

/**
 * Get activity statistics for a user
 */
export async function getActivityStats(userId: string) {
  const stats = await prisma.activity.groupBy({
    by: ['type'],
    where: { userId },
    _count: true,
  });

  const total = await prisma.activity.count({
    where: { userId },
  });

  return {
    total,
    byType: stats.reduce((acc: Record<string, number>, stat: { type: string; _count: number }) => {
      acc[stat.type] = stat._count;
      return acc;
    }, {} as Record<string, number>),
  };
}
