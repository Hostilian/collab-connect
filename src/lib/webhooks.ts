/**
 * Webhook System
 *
 * Handles webhook delivery, signature verification, and retry logic
 */

import crypto from 'crypto';
import prisma from './prisma';

// Webhook event types
export enum WebhookEvent {
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
  USER_DELETED = 'user.deleted',
  PROFILE_UPDATED = 'profile.updated',
  COLLABORATION_CREATED = 'collaboration.created',
  COLLABORATION_UPDATED = 'collaboration.updated',
  COLLABORATION_COMPLETED = 'collaboration.completed',
  GROUP_CREATED = 'group.created',
  GROUP_MEMBER_ADDED = 'group.member.added',
  GROUP_MEMBER_REMOVED = 'group.member.removed',
  MESSAGE_SENT = 'message.sent',
  NOTIFICATION_SENT = 'notification.sent',
}

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: Record<string, unknown>;
  webhookId: string;
  deliveryId: string;
}

/**
 * Generate HMAC SHA256 signature for webhook verification
 */
export function generateSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

/**
 * Verify webhook signature
 */
export function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = generateSignature(payload, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Create a new webhook
 */
export async function createWebhook(data: {
  userId: string;
  url: string;
  events: WebhookEvent[];
  description?: string;
}) {
  // Generate secure random secret
  const secret = crypto.randomBytes(32).toString('hex');

  const webhook = await prisma.webhook.create({
    data: {
      userId: data.userId,
      url: data.url,
      secret,
      events: data.events,
      description: data.description,
      isActive: true,
    },
  });

  return webhook;
}

/**
 * Get webhooks for a user
 */
export async function getUserWebhooks(userId: string) {
  return await prisma.webhook.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Update webhook
 */
export async function updateWebhook(
  webhookId: string,
  data: {
    url?: string;
    events?: WebhookEvent[];
    isActive?: boolean;
    description?: string;
  }
) {
  return await prisma.webhook.update({
    where: { id: webhookId },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
}

/**
 * Delete webhook
 */
export async function deleteWebhook(webhookId: string) {
  return await prisma.webhook.delete({
    where: { id: webhookId },
  });
}

/**
 * Rotate webhook secret
 */
export async function rotateWebhookSecret(webhookId: string) {
  const newSecret = crypto.randomBytes(32).toString('hex');

  return await prisma.webhook.update({
    where: { id: webhookId },
    data: {
      secret: newSecret,
      updatedAt: new Date(),
    },
  });
}

/**
 * Trigger webhook delivery
 */
export async function triggerWebhook(
  event: WebhookEvent,
  data: Record<string, unknown>
): Promise<void> {
  // Find all active webhooks subscribed to this event
  const webhooks = await prisma.webhook.findMany({
    where: {
      isActive: true,
      events: {
        has: event,
      },
    },
  });

  // Trigger delivery for each webhook
  const deliveryPromises = webhooks.map((webhook: { id: string }) =>
    deliverWebhook(webhook.id, event, data)
  );

  await Promise.allSettled(deliveryPromises);
}

/**
 * Deliver webhook to endpoint
 */
async function deliverWebhook(
  webhookId: string,
  event: WebhookEvent,
  data: Record<string, unknown>
): Promise<void> {
  const webhook = await prisma.webhook.findUnique({
    where: { id: webhookId },
  });

  if (!webhook || !webhook.isActive) {
    return;
  }

  // Create delivery record
  const delivery = await prisma.webhookDelivery.create({
    data: {
      webhookId,
      event,
      payload: data,
      attempts: 1,
    },
  });

  // Build payload
  const payload: WebhookPayload = {
    event,
    timestamp: new Date().toISOString(),
    data,
    webhookId,
    deliveryId: delivery.id,
  };

  const payloadString = JSON.stringify(payload);
  const signature = generateSignature(payloadString, webhook.secret);

  try {
    // Send HTTP POST request
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Event': event,
        'X-Webhook-ID': webhookId,
        'X-Delivery-ID': delivery.id,
        'User-Agent': 'CollabConnect-Webhooks/1.0',
      },
      body: payloadString,
    });

    const responseBody = await response.text();

    // Update delivery record
    await prisma.webhookDelivery.update({
      where: { id: delivery.id },
      data: {
        responseCode: response.status,
        responseBody: responseBody.substring(0, 1000), // Store first 1000 chars
        success: response.ok,
      },
    });

    // Update webhook last triggered time
    await prisma.webhook.update({
      where: { id: webhookId },
      data: { lastTriggeredAt: new Date() },
    });

    // If failed, schedule retry
    if (!response.ok) {
      await scheduleRetry(delivery.id);
    }
  } catch (error) {
    // Network error or timeout
    await prisma.webhookDelivery.update({
      where: { id: delivery.id },
      data: {
        responseCode: 0,
        responseBody: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      },
    });

    // Schedule retry
    await scheduleRetry(delivery.id);
  }
}

/**
 * Schedule webhook retry with exponential backoff
 */
async function scheduleRetry(deliveryId: string): Promise<void> {
  const delivery = await prisma.webhookDelivery.findUnique({
    where: { id: deliveryId },
  });

  if (!delivery || delivery.attempts >= 5) {
    // Max retries reached
    return;
  }

  // Exponential backoff: 1min, 5min, 15min, 1hr, 6hr
  const delays = [60, 300, 900, 3600, 21600]; // seconds
  const delay = delays[delivery.attempts - 1] || 21600;
  const nextRetryAt = new Date(Date.now() + delay * 1000);

  await prisma.webhookDelivery.update({
    where: { id: deliveryId },
    data: {
      nextRetryAt,
      attempts: delivery.attempts + 1,
    },
  });
}

/**
 * Retry failed webhook deliveries
 * This should be called by a background job/cron
 */
export async function retryFailedDeliveries(): Promise<void> {
  const failedDeliveries = await prisma.webhookDelivery.findMany({
    where: {
      success: false,
      attempts: { lt: 5 },
      nextRetryAt: { lte: new Date() },
    },
    include: {
      webhook: true,
    },
  });

  for (const delivery of failedDeliveries) {
    if (!delivery.webhook.isActive) {
      continue;
    }

    await deliverWebhook(
      delivery.webhookId,
      delivery.event as WebhookEvent,
      delivery.payload
    );
  }
}

/**
 * Get webhook delivery statistics
 */
export async function getWebhookStats(webhookId: string) {
  const [total, successful, failed, pending] = await Promise.all([
    prisma.webhookDelivery.count({ where: { webhookId } }),
    prisma.webhookDelivery.count({ where: { webhookId, success: true } }),
    prisma.webhookDelivery.count({
      where: { webhookId, success: false, attempts: { gte: 5 } },
    }),
    prisma.webhookDelivery.count({
      where: { webhookId, success: false, attempts: { lt: 5 } },
    }),
  ]);

  const successRate = total > 0 ? (successful / total) * 100 : 0;

  return {
    total,
    successful,
    failed,
    pending,
    successRate: Math.round(successRate * 100) / 100,
  };
}

/**
 * Get recent webhook deliveries
 */
export async function getWebhookDeliveries(
  webhookId: string,
  limit: number = 50
) {
  return await prisma.webhookDelivery.findMany({
    where: { webhookId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

/**
 * Test webhook endpoint
 */
export async function testWebhook(webhookId: string): Promise<boolean> {
  await triggerWebhook(WebhookEvent.USER_CREATED, {
    test: true,
    message: 'This is a test webhook delivery',
    timestamp: new Date().toISOString(),
  });

  // Wait a bit for delivery
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Check if delivery was successful
  const latestDelivery = await prisma.webhookDelivery.findFirst({
    where: { webhookId },
    orderBy: { createdAt: 'desc' },
  });

  return latestDelivery?.success || false;
}
