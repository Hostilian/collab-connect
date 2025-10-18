/**
 * 2FA Setup API
 * POST /api/auth/2fa/setup - Generate QR code for 2FA setup
 * POST /api/auth/2fa/enable - Enable 2FA with verification
 * POST /api/auth/2fa/disable - Disable 2FA
 */

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
    disable2FA,
    enable2FA,
    generateQRCode,
    generateTOTPSecret,
    getRemainingBackupCodes,
    is2FAEnabled,
    regenerateBackupCodes,
} from '@/lib/two-factor';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'status') {
      const enabled = await is2FAEnabled(session.user.id);
      const remainingCodes = enabled ? await getRemainingBackupCodes(session.user.id) : 0;

      return NextResponse.json({
        enabled,
        remainingBackupCodes: remainingCodes,
      });
    }

    if (action === 'setup') {
      // Generate new secret and QR code
      const secret = generateTOTPSecret();
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { email: true },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const qrCode = await generateQRCode(user.email, secret);

      return NextResponse.json({
        secret,
        qrCode,
        message: 'Scan this QR code with your authenticator app',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('2FA GET error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, secret, token } = body;

    if (action === 'enable') {
      if (!secret || !token) {
        return NextResponse.json(
          { error: 'Secret and verification token required' },
          { status: 400 }
        );
      }

      const result = await enable2FA(session.user.id, secret, token);

      return NextResponse.json({
        enabled: true,
        backupCodes: result.backupCodes,
        message: '2FA enabled successfully. Save these backup codes securely!',
      });
    }

    if (action === 'disable') {
      if (!token) {
        return NextResponse.json(
          { error: 'Verification token required' },
          { status: 400 }
        );
      }

      // Verify token before disabling
      const { verify2FAToken } = await import('@/lib/two-factor');
      const valid = await verify2FAToken(session.user.id, token);

      if (!valid) {
        return NextResponse.json(
          { error: 'Invalid verification code' },
          { status: 401 }
        );
      }

      await disable2FA(session.user.id);

      return NextResponse.json({
        enabled: false,
        message: '2FA disabled successfully',
      });
    }

    if (action === 'regenerate-codes') {
      if (!token) {
        return NextResponse.json(
          { error: 'Verification token required' },
          { status: 400 }
        );
      }

      // Verify token before regenerating
      const { verify2FAToken } = await import('@/lib/two-factor');
      const valid = await verify2FAToken(session.user.id, token);

      if (!valid) {
        return NextResponse.json(
          { error: 'Invalid verification code' },
          { status: 401 }
        );
      }

      const newCodes = await regenerateBackupCodes(session.user.id);

      return NextResponse.json({
        backupCodes: newCodes,
        message: 'Backup codes regenerated successfully',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('2FA POST error:', error);
    if (error instanceof Error && error.message === 'Invalid verification code') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
