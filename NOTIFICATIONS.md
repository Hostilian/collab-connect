# 🔔 Notification System Documentation

## Overview

Comprehensive notification system supporting in-app, email, and push notifications with user preferences and delivery tracking.

## 📬 Notification Types

### In-App Notifications
- Real-time toast notifications
- Notification bell with badge count
- Notification center with history
- Mark as read/unread
- Bulk actions

### Email Notifications
- Branded HTML templates
- Plain text fallback
- Unsubscribe links
- Preference management
- Delivery tracking

### Push Notifications
- Web push (Service Worker)
- Mobile push (planned)
- Rich notifications with actions
- Badge updates
- Sound and vibration

## 🎯 Notification Events

### User Events
- Welcome message
- Email verification
- Profile completion reminder
- Account security alerts

### Collaboration Events
- Collaboration invite
- Member joined/left
- Project updates
- Message received

### System Events
- Maintenance notifications
- Feature announcements
- Security updates
- Account warnings

## 📦 Data Structure

### Notification Model

```typescript
interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
  url?: string;
  imageUrl?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  COLLABORATION_INVITE = 'collaboration_invite',
  MESSAGE = 'message',
  SYSTEM = 'system',
}
```

## 🔧 Implementation

### Creating Notifications

```typescript
// lib/notifications.ts
import { prisma } from './prisma';

export async function createNotification(data: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  url?: string;
  priority?: string;
}) {
  const notification = await prisma.notification.create({
    data: {
      ...data,
      priority: data.priority || 'normal',
    },
  });

  // Send real-time update via WebSocket
  await sendRealtimeNotification(data.userId, notification);

  // Send email if user preference allows
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
    include: { notificationPreferences: true },
  });

  if (user?.notificationPreferences?.emailEnabled) {
    await sendEmailNotification(user.email, notification);
  }

  // Send push notification if subscribed
  if (user?.pushSubscription) {
    await sendPushNotification(user.pushSubscription, notification);
  }

  return notification;
}
```

### In-App Notifications

```typescript
// components/NotificationBell.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export function NotificationBell() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!session?.user?.id) return;

    // Fetch initial notifications
    fetchNotifications();

    // Subscribe to real-time updates
    const ws = new WebSocket(`wss://api.collab-connect.com/ws?userId=${session.user.id}`);
    
    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast
      showToast(notification);
    };

    return () => ws.close();
  }, [session]);

  async function fetchNotifications() {
    const res = await fetch('/api/notifications');
    const data = await res.json();
    setNotifications(data.notifications);
    setUnreadCount(data.unreadCount);
  }

  async function markAsRead(id: string) {
    await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }

  return (
    <div className="relative">
      <button className="relative p-2">
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification dropdown */}
      <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={() => markAsRead(notification.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Email Notifications

```typescript
// lib/email-notifications.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailNotification(
  email: string,
  notification: Notification
) {
  await resend.emails.send({
    from: 'notifications@collab-connect.com',
    to: email,
    subject: notification.title,
    html: renderEmailTemplate(notification),
    headers: {
      'X-Entity-Ref-ID': notification.id,
    },
  });
}

function renderEmailTemplate(notification: Notification): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; }
          .content { padding: 20px; background: #f9fafb; }
          .button { background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
          .footer { padding: 20px; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${notification.title}</h1>
          </div>
          <div class="content">
            <p>${notification.message}</p>
            ${notification.url ? `
              <a href="${notification.url}" class="button">View Details</a>
            ` : ''}
          </div>
          <div class="footer">
            <p>CollabConnect | <a href="{{unsubscribe_url}}">Unsubscribe</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}
```

### Push Notifications

```typescript
// lib/push-notifications.ts
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:admin@collab-connect.com',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendPushNotification(
  subscription: PushSubscription,
  notification: Notification
) {
  const payload = JSON.stringify({
    title: notification.title,
    body: notification.message,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: {
      url: notification.url || '/',
      notificationId: notification.id,
    },
    actions: [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  });

  try {
    await webpush.sendNotification(subscription, payload);
  } catch (error) {
    console.error('Push notification failed:', error);
    
    // If subscription is invalid, remove it
    if (error.statusCode === 410) {
      await prisma.user.update({
        where: { pushSubscription: subscription },
        data: { pushSubscription: null },
      });
    }
  }
}

// Client-side: Subscribe to push
export async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;
  
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  // Save subscription to server
  await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription),
  });

  return subscription;
}
```

## ⚙️ User Preferences

### Preference Schema

```typescript
interface NotificationPreferences {
  userId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  
  // Event-specific preferences
  collaborationInvites: boolean;
  messages: boolean;
  projectUpdates: boolean;
  systemAnnouncements: boolean;
  
  // Frequency
  digestEnabled: boolean;
  digestFrequency: 'daily' | 'weekly' | 'monthly';
  
  // Quiet hours
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string;   // "08:00"
}
```

### Preference Management

```typescript
// app/api/notifications/preferences/route.ts
export async function GET(req: Request) {
  const session = await auth();
  
  const preferences = await prisma.notificationPreferences.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json(preferences);
}

export async function PUT(req: Request) {
  const session = await auth();
  const body = await req.json();

  const preferences = await prisma.notificationPreferences.update({
    where: { userId: session.user.id },
    data: body,
  });

  return NextResponse.json(preferences);
}
```

## 📊 Analytics & Monitoring

### Tracking Metrics

```typescript
interface NotificationMetrics {
  sent: number;
  delivered: number;
  read: number;
  clicked: number;
  
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  
  byType: Record<NotificationType, number>;
  byChannel: {
    email: number;
    push: number;
    inApp: number;
  };
}

export async function getNotificationMetrics(userId: string) {
  const notifications = await prisma.notification.findMany({
    where: { userId },
  });

  const metrics = {
    sent: notifications.length,
    delivered: notifications.filter(n => n.deliveredAt).length,
    read: notifications.filter(n => n.read).length,
    clicked: notifications.filter(n => n.clickedAt).length,
    // ... calculate rates
  };

  return metrics;
}
```

## 🔗 API Endpoints

### List Notifications

```
GET /api/notifications?page=1&limit=20&unread=true
```

### Mark as Read

```
POST /api/notifications/:id/read
```

### Mark All as Read

```
POST /api/notifications/read-all
```

### Delete Notification

```
DELETE /api/notifications/:id
```

### Get Preferences

```
GET /api/notifications/preferences
```

### Update Preferences

```
PUT /api/notifications/preferences
```

## 🧪 Testing

```typescript
// Test notification creation
await createNotification({
  userId: 'user_123',
  type: NotificationType.INFO,
  title: 'Test Notification',
  message: 'This is a test',
  url: '/dashboard',
});

// Test email delivery
await sendEmailNotification('test@example.com', notification);

// Test push notification
await sendPushNotification(subscription, notification);
```

---

*Last Updated: October 2025*
