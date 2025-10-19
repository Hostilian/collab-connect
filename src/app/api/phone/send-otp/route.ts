/**
 * Phone Verification API - Send OTP
 * POST /api/phone/send-otp
 */

import { auth } from '@/lib/auth';
import { sendPhoneVerificationOTP } from '@/lib/phone-verification';
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

    // Rate limiting: 3 requests per hour
    const rateLimitResult = await rateLimit(req, rateLimiters.email, `phone-otp:${session.user.id}`);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate phone number format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const cleanPhone = phoneNumber.replace(/[\s()-]/g, '');

    if (!phoneRegex.test(cleanPhone) && !/^\d{10}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    const verifyResult = await sendPhoneVerificationOTP(session.user.id, phoneNumber);

    if (!verifyResult.success) {
      return NextResponse.json(
        { error: verifyResult.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      expiresAt: verifyResult.expiresAt,
      message: 'Verification code sent successfully',
    });
  } catch (error) {
    console.error('Phone OTP send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
