/**
 * Individual Webhook Management API
 *
 * GET    /api/webhooks/[id] - Get webhook details
 * PATCH  /api/webhooks/[id] - Update webhook
 * DELETE /api/webhooks/[id] - Delete webhook
 */

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
    deleteWebhook,
    getWebhookDeliveries,
    getWebhookStats,
    updateWebhook,
    WebhookEvent
} from '@/lib/webhooks';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const webhook = await prisma.webhook.findUnique({
      where: { id },
    });

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    if (webhook.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get webhook stats and recent deliveries
    const [stats, recentDeliveries] = await Promise.all([
      getWebhookStats(id),
      getWebhookDeliveries(id, 20),
    ]);

    return NextResponse.json({
      webhook: {
        ...webhook,
        secret: undefined,
        secretPreview: webhook.secret.substring(0, 8) + '...',
      },
      stats,
      recentDeliveries,
    });
  } catch (error) {
    console.error('Error fetching webhook:', error);
    return NextResponse.json(
      { error: 'Failed to fetch webhook' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const webhook = await prisma.webhook.findUnique({
      where: { id },
    });

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    if (webhook.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { url, events, isActive, description } = body;

    // Validate URL if provided
    if (url) {
      try {
        new URL(url);
      } catch {
        return NextResponse.json(
          { error: 'Invalid URL format' },
          { status: 400 }
        );
      }
    }

    // Validate events if provided
    if (events) {
      const validEvents = Object.values(WebhookEvent);
      const invalidEvents = events.filter((e: string) => !validEvents.includes(e as WebhookEvent));
      if (invalidEvents.length > 0) {
        return NextResponse.json(
          {
            error: 'Invalid event types',
            invalidEvents,
            validEvents,
          },
          { status: 400 }
        );
      }
    }

    const updatedWebhook = await updateWebhook(id, {
      url,
      events,
      isActive,
      description,
    });

    return NextResponse.json({
      webhook: {
        ...updatedWebhook,
        secret: undefined,
        secretPreview: updatedWebhook.secret.substring(0, 8) + '...',
      },
    });
  } catch (error) {
    console.error('Error updating webhook:', error);
    return NextResponse.json(
      { error: 'Failed to update webhook' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const webhook = await prisma.webhook.findUnique({
      where: { id },
    });

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    if (webhook.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await deleteWebhook(id);

    return NextResponse.json({
      message: 'Webhook deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting webhook:', error);
    return NextResponse.json(
      { error: 'Failed to delete webhook' },
      { status: 500 }
    );
  }
}
