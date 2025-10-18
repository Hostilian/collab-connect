/**
 * Webhook Secret Rotation API
 * POST /api/webhooks/[id]/rotate-secret - Rotate webhook secret
 */

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { rotateWebhookSecret } from '@/lib/webhooks';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const webhook = await prisma.webhook.findUnique({
      where: { id: params.id },
    });

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    if (webhook.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedWebhook = await rotateWebhookSecret(params.id);

    return NextResponse.json({
      webhook: {
        ...updatedWebhook,
        secret: updatedWebhook.secret, // Show new secret once
      },
      message: 'Secret rotated successfully. Save the new secret - it will not be shown again.',
    });
  } catch (error) {
    console.error('Error rotating secret:', error);
    return NextResponse.json(
      { error: 'Failed to rotate secret' },
      { status: 500 }
    );
  }
}
