/**
 * Notification System
 *
 * Handles in-app, email, and push notifications
 */

import { sendEmail } from './email';
import prisma from './prisma';

export enum NotificationType {
  NEW_MATCH = 'new_match',
  GROUP_INVITE = 'group_invite',
  NEW_MESSAGE = 'new_message',
  COLLABORATION_UPDATE = 'collaboration_update',
  PROFILE_VIEW = 'profile_view',
  VERIFICATION_COMPLETE = 'verification_complete',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface NotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  data?: Record<string, unknown>;
  priority?: NotificationPriority;
}

interface NotificationPreferences {
  inAppEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: number | null;
  quietHoursEnd?: number | null;
  [key: string]: boolean | number | null | undefined;
}

/**
 * Create and send a notification
 */
export async function sendNotification(data: NotificationData) {
  const {
    userId,
    type,
    title,
    message,
    link,
    data: additionalData,
    priority = NotificationPriority.NORMAL,
  } = data;

  // Get user preferences
  const preferences = await getNotificationPreferences(userId);

  // Check if notification type is enabled
  if (!isNotificationEnabled(type, preferences)) {
    return null;
  }

  // Check quiet hours
  if (isQuietHours(preferences)) {
    // Store for later delivery (or skip for non-critical)
    if (priority !== NotificationPriority.URGENT) {
      return null;
    }
  }

  // Create in-app notification
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      link,
      data: additionalData as never,
      priority,
      sentInApp: preferences.inAppEnabled,
      sentEmail: false,
      sentPush: false,
    },
  });

  // Send email notification (if enabled)
  if (preferences.emailEnabled && shouldSendEmail(type, preferences)) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      });

      if (user) {
        await sendEmail({
          to: user.email,
          subject: title,
          text: message,
          html: generateEmailHTML(title, message, link),
        });

        await prisma.notification.update({
          where: { id: notification.id },
          data: { sentEmail: true },
        });
      }
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }

  // Send push notification (if enabled)
  if (preferences.pushEnabled && shouldSendPush(type, preferences)) {
    try {
      await sendPushNotification(userId, {
        title,
        body: message,
        data: { notificationId: notification.id, link },
      });

      await prisma.notification.update({
        where: { id: notification.id },
        data: { sentPush: true },
      });
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }

  return notification;
}

/**
 * Get user's notification preferences
 */
export async function getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
  let preferences = await prisma.notificationPreference.findUnique({
    where: { userId },
  });

  // Create default preferences if not exist
  if (!preferences) {
    preferences = await prisma.notificationPreference.create({
      data: { userId },
    });
  }

  return preferences as unknown as NotificationPreferences;
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  userId: string,
  data: Partial<{
    emailEnabled: boolean;
    pushEnabled: boolean;
    inAppEnabled: boolean;
    newMatch: boolean;
    groupInvite: boolean;
    newMessage: boolean;
    collaborationUpdate: boolean;
    profileView: boolean;
    weeklyDigest: boolean;
    quietHoursEnabled: boolean;
    quietHoursStart: number;
    quietHoursEnd: number;
  }>
) {
  return await prisma.notificationPreference.upsert({
    where: { userId },
    update: data,
    create: {
      userId,
      ...data,
    },
  });
}

/**
 * Check if notification type is enabled for user
 */
function isNotificationEnabled(
  type: NotificationType,
  preferences: NotificationPreferences
): boolean {
  const mapping: Record<NotificationType, string> = {
    [NotificationType.NEW_MATCH]: 'newMatch',
    [NotificationType.GROUP_INVITE]: 'groupInvite',
    [NotificationType.NEW_MESSAGE]: 'newMessage',
    [NotificationType.COLLABORATION_UPDATE]: 'collaborationUpdate',
    [NotificationType.PROFILE_VIEW]: 'profileView',
    [NotificationType.VERIFICATION_COMPLETE]: 'inAppEnabled',
    [NotificationType.PAYMENT_SUCCESS]: 'inAppEnabled',
    [NotificationType.PAYMENT_FAILED]: 'inAppEnabled',
    [NotificationType.SYSTEM_ANNOUNCEMENT]: 'inAppEnabled',
  };

  const prefKey = mapping[type];
  return preferences[prefKey] !== false;
}

/**
 * Check if it's currently quiet hours for the user
 */
function isQuietHours(preferences: NotificationPreferences): boolean {
  if (!preferences.quietHoursEnabled) {
    return false;
  }

  const now = new Date();
  const currentHour = now.getHours();
  const start = preferences.quietHoursStart || 22;
  const end = preferences.quietHoursEnd || 8;

  if (start < end) {
    return currentHour >= start && currentHour < end;
  } else {
    // Quiet hours span midnight
    return currentHour >= start || currentHour < end;
  }
}

/**
 * Determine if email should be sent for this notification type
 */
function shouldSendEmail(
  type: NotificationType,
  _preferences: NotificationPreferences
): boolean {
  // Only send email for important notifications
  const emailTypes = [
    NotificationType.GROUP_INVITE,
    NotificationType.COLLABORATION_UPDATE,
    NotificationType.VERIFICATION_COMPLETE,
    NotificationType.PAYMENT_SUCCESS,
    NotificationType.PAYMENT_FAILED,
  ];

  return emailTypes.includes(type);
}

/**
 * Determine if push should be sent for this notification type
 */
function shouldSendPush(
  type: NotificationType,
  _preferences: NotificationPreferences
): boolean {
  // Send push for most notifications except profile views
  return type !== NotificationType.PROFILE_VIEW;
}

/**
 * Generate email HTML for notification
 */
function generateEmailHTML(title: string, message: string, link?: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">CollabConnect</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
          <h2 style="color: #333; margin-top: 0;">${title}</h2>
          <p style="font-size: 16px; color: #555;">${message}</p>
          ${link ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${link}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                View Details
              </a>
            </div>
          ` : ''}
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            You received this email because you have notifications enabled in your CollabConnect account.
            <br>
            <a href="${process.env.NEXTAUTH_URL}/dashboard/settings" style="color: #667eea;">Manage notification preferences</a>
          </p>
        </div>
      </body>
    </html>
  `;
}

/**
 * Send push notification (Web Push API)
 */
async function sendPushNotification(
  userId: string,
  payload: { title: string; body: string; data?: Record<string, unknown> }
): Promise<void> {
  try {
    // Get user's push subscriptions
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId, isActive: true },
    });

    if (subscriptions.length === 0) {
      console.log('No active push subscriptions for user:', userId);
      return;
    }

    const webpush = (await import('web-push')).default;

    // Configure VAPID keys (should be in environment variables)
    webpush.setVapidDetails(
      `mailto:${process.env.VAPID_EMAIL || 'admin@collabconnect.com'}`,
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    );

    // Send to all user's subscriptions
    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      data: payload.data || {},
      timestamp: Date.now(),
    });

    const sendPromises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          notificationPayload
        );
      } catch (error) {
        // If subscription is invalid, mark it as inactive
        const err = error as { statusCode?: number };
        if (err.statusCode === 404 || err.statusCode === 410) {
          await prisma.pushSubscription.update({
            where: { id: sub.id },
            data: { isActive: false },
          });
        }
        console.error('Failed to send push notification:', error);
      }
    });

    await Promise.allSettled(sendPromises);
  } catch (error) {
    console.error('Push notification error:', error);
  }
}

/**
 * Get user's notifications
 */
export async function getUserNotifications(
  userId: string,
  options: {
    unreadOnly?: boolean;
    limit?: number;
    offset?: number;
  } = {}
) {
  const { unreadOnly = false, limit = 50, offset = 0 } = options;

  return await prisma.notification.findMany({
    where: {
      userId,
      ...(unreadOnly && { isRead: false }),
      isArchived: false,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string) {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}

/**
 * Mark all notifications as read for user
 */
export async function markAllAsRead(userId: string) {
  return await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}

/**
 * Archive notification
 */
export async function archiveNotification(notificationId: string) {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: {
      isArchived: true,
      archivedAt: new Date(),
    },
  });
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId: string) {
  return await prisma.notification.delete({
    where: { id: notificationId },
  });
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
  return await prisma.notification.count({
    where: {
      userId,
      isRead: false,
      isArchived: false,
    },
  });
}
