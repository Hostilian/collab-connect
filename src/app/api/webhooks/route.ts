/**
 * Webhook Management API
 *
 * GET    /api/webhooks - List user's webhooks
 * POST   /api/webhooks - Create new webhook
 */

import { auth } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { createWebhook, getUserWebhooks, WebhookEvent } from '@/lib/webhooks';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit.check(request, `webhooks-read-${ip}`, 50, 60);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's webhooks
    const webhooks = await getUserWebhooks(session.user.id);

    // Don't expose secrets in response
    const safeWebhooks = webhooks.map((webhook: { secret: string; [key: string]: unknown }) => ({
      ...webhook,
      secret: undefined,
      secretPreview: webhook.secret.substring(0, 8) + '...',
    }));

    return NextResponse.json({
      webhooks: safeWebhooks,
      count: webhooks.length,
    });
  } catch (error) {
    console.error('Error fetching webhooks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch webhooks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit.strict(request, `webhooks-create-${ip}`);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { url, events, description } = body;

    // Validation
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Valid URL is required' },
        { status: 400 }
      );
    }

    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: 'At least one event must be specified' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Validate events
    const validEvents = Object.values(WebhookEvent);
    const invalidEvents = events.filter(e => !validEvents.includes(e));
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

    // Create webhook
    const webhook = await createWebhook({
      userId: session.user.id,
      url,
      events,
      description,
    });

    return NextResponse.json({
      webhook: {
        ...webhook,
        secret: webhook.secret, // Include secret only on creation
      },
      message: 'Webhook created successfully. Save the secret securely - it will not be shown again.',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating webhook:', error);
    return NextResponse.json(
      { error: 'Failed to create webhook' },
      { status: 500 }
    );
  }
}
