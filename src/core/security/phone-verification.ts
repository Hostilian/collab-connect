/**
 * Phone Verification System with Twilio
 * Implements OTP generation, SMS sending, and validation
 */

import crypto from 'node:crypto';
import twilio from 'twilio';
import { prisma } from '@/core/database/prisma-client';

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER;
const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 3;

/**
 * Generate a random OTP
 */
function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Hash OTP for secure storage
 */
function hashOTP(otp: string): string {
  return crypto
    .createHash('sha256')
    .update(otp + process.env.NEXTAUTH_SECRET)
    .digest('hex');
}

/**
 * Format phone number to E.164 format
 */
function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replaceAll(/\D/g, '');

  // Add + prefix if not present
  if (!phone.startsWith('+')) {
    // Assume US if no country code
    if (digits.length === 10) {
      return `+1${digits}`;
    }
    return `+${digits}`;
  }

  return phone;
}

/**
 * Send OTP via Twilio SMS
 */
export async function sendPhoneVerificationOTP(
  userId: string,
  phoneNumber: string
): Promise<{ success: boolean; error?: string; expiresAt?: Date }> {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);

    // Check if Twilio is configured
    if (!twilioClient || !TWILIO_PHONE) {
      console.warn('Twilio not configured, OTP will only be logged');
    }

    // Check for recent OTP
    const existingVerification = await prisma.phoneVerification.findUnique({
      where: { userId },
    });

    if (existingVerification && existingVerification.expiresAt > new Date()) {
      const timeSinceCreation = Date.now() - existingVerification.createdAt.getTime();
      if (timeSinceCreation < 60000) { // 1 minute
        return {
          success: false,
          error: 'Please wait before requesting a new code',
        };
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Store in database
    await prisma.phoneVerification.upsert({
      where: { userId },
      create: {
        userId,
        phoneNumber: formattedPhone,
        otp: hashedOTP,
        expiresAt,
        attempts: 0,
      },
      update: {
        phoneNumber: formattedPhone,
        otp: hashedOTP,
        expiresAt,
        attempts: 0,
        verified: false,
      },
    });

    // Send SMS via Twilio
    if (twilioClient && TWILIO_PHONE) {
      await twilioClient.messages.create({
        body: `Your CollabConnect verification code is: ${otp}. Valid for ${OTP_EXPIRY_MINUTES} minutes.`,
        from: TWILIO_PHONE,
        to: formattedPhone,
      });
    } else {
      // Log OTP for development
  // [DEV] OTP for ${formattedPhone}: ${otp}
    }

    return {
      success: true,
      expiresAt,
    };
  } catch (error) {
    console.error('Error sending phone verification OTP:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send OTP',
    };
  }
}

/**
 * Verify OTP code
 */
export async function verifyPhoneOTP(
  userId: string,
  otp: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const verification = await prisma.phoneVerification.findUnique({
      where: { userId },
    });

    if (!verification) {
      return {
        success: false,
        error: 'No verification request found',
      };
    }

    // Check if already verified
    if (verification.verified) {
      return {
        success: false,
        error: 'Phone number already verified',
      };
    }

    // Check expiry
    if (verification.expiresAt < new Date()) {
      return {
        success: false,
        error: 'Verification code expired',
      };
    }

    // Check attempts
    if (verification.attempts >= MAX_ATTEMPTS) {
      return {
        success: false,
        error: 'Maximum attempts exceeded. Please request a new code',
      };
    }

    // Verify OTP
    const hashedOTP = hashOTP(otp);
    const isValid = hashedOTP === verification.otp;

    if (!isValid) {
      // Increment attempts
      await prisma.phoneVerification.update({
        where: { userId },
        data: { attempts: verification.attempts + 1 },
      });

      return {
        success: false,
        error: `Invalid code. ${MAX_ATTEMPTS - verification.attempts - 1} attempts remaining`,
      };
    }

    // Mark as verified
    await prisma.phoneVerification.update({
      where: { userId },
      data: {
        verified: true,
        verifiedAt: new Date(),
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error verifying phone OTP:', error);
    return {
      success: false,
      error: 'Failed to verify code',
    };
  }
}

/**
 * Check if user's phone is verified
 */
export async function isPhoneVerified(userId: string): Promise<boolean> {
  const verification = await prisma.phoneVerification.findUnique({
    where: { userId },
  });

  return verification?.verified ?? false;
}

/**
 * Get phone verification status
 */
export async function getPhoneVerificationStatus(userId: string) {
  const verification = await prisma.phoneVerification.findUnique({
    where: { userId },
  });

  if (!verification) {
    return {
      verified: false,
      phoneNumber: null,
    };
  }

  return {
    verified: verification.verified,
    phoneNumber: verification.phoneNumber,
    verifiedAt: verification.verifiedAt,
    expiresAt: verification.expiresAt,
    attemptsRemaining: Math.max(0, MAX_ATTEMPTS - verification.attempts),
  };
}
