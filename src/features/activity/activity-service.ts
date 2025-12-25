/**
 * Activity Service
 * Tracks user activity and actions for analytics/feeds
 */

export type ActivityType =
  | 'delivery_created'
  | 'delivery_accepted'
  | 'delivery_completed'
  | 'courier_registered'
  | 'profile_updated'

export interface Activity {
  id: string
  userId: string
  type: ActivityType
  metadata?: Record<string, unknown>
  createdAt: Date
}

/**
 * Log a user activity
 */
export async function logActivity(
  userId: string,
  type: ActivityType,
  metadata?: Record<string, unknown>
): Promise<void> {
  // For now, just log to console. In production, save to DB.
  console.log(`[Activity] ${type} by ${userId}`, metadata)
}

/**
 * Get recent activity for a user
 */
export async function getUserActivity(
  userId: string,
  _limit = 20
): Promise<Activity[]> {
  // Placeholder - would query from activity table
  return []
}

/**
 * Get activity feed (all recent activities)
 */
export async function getActivityFeed(_limit = 50): Promise<Activity[]> {
  // Placeholder - would query from activity table
  return []
}
