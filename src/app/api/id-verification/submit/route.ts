/**
 * ID Verification API - Submit Documents
 * POST /api/id-verification/submit
 */

import { auth } from '@/lib/auth';
import { submitIdVerification } from '@/lib/id-verification';
import { rateLimit, rateLimiters } from '@/lib/ratelimit';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Rate limiting: 10 submissions per hour
    const rateLimitResult = await rateLimit(req, rateLimiters.upload, `id-verify:${session.user.id}`);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const {
      documentType,
      documentNumber,
      frontImageUrl,
      backImageUrl,
      selfieUrl,
      expiresAt,
    } = body;

    if (!documentType || !frontImageUrl) {
      return NextResponse.json(
        { error: 'Document type and front image are required' },
        { status: 400 }
      );
    }

    if (!['passport', 'drivers_license', 'national_id'].includes(documentType)) {
      return NextResponse.json(
        { error: 'Invalid document type' },
        { status: 400 }
      );
    }

    const result = await submitIdVerification({
      userId: session.user.id,
      documentType,
      documentNumber,
      frontImageUrl,
      backImageUrl,
      selfieUrl,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verificationId: result.verificationId,
      message: 'Verification submitted successfully. We will review it within 24-48 hours.',
    });
  } catch (error) {
    console.error('ID verification submit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
