/**
 * Webhook Test API
 * POST /api/webhooks/[id]/test - Send test webhook
 */

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { testWebhook } from '@/lib/webhooks';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
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

    const success = await testWebhook(id);

    return NextResponse.json({
      success,
      message: success
        ? 'Test webhook delivered successfully'
        : 'Test webhook delivery failed',
    });
  } catch (error) {
    console.error('Error testing webhook:', error);
    return NextResponse.json(
      { error: 'Failed to test webhook' },
      { status: 500 }
    );
  }
}
