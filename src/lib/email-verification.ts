import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

/**
 * Generate a unique email verification token
 */
export async function generateVerificationToken(email: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.user.update({
    where: { email },
    data: {
      emailVerificationToken: token,
      emailVerificationExpires: expires,
    },
  });

  return token;
}

/**
 * Validate and consume a verification token
 */
export async function validateVerificationToken(
  token: string
): Promise<{
  valid: boolean;
  user?: {
    id: string;
    email: string;
    name: string | null;
  };
  error?: string;
}> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return {
        valid: false,
        error: 'Invalid or expired verification token',
      };
    }

    // Mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    return {
      valid: true,
      user,
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return {
      valid: false,
      error: 'Verification failed',
    };
  }
}

/**
 * Check if a user needs email verification
 */
export async function needsEmailVerification(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { emailVerified: true },
  });

  return !user?.emailVerified;
}

/**
 * Resend verification email (with rate limiting check)
 */
export async function canResendVerification(email: string): Promise<{
  canResend: boolean;
  remainingTime?: number;
}> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      emailVerificationExpires: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return { canResend: false };
  }

  // Check if last email was sent less than 5 minutes ago
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  if (user.updatedAt > fiveMinutesAgo) {
    const remainingTime = Math.ceil(
      (user.updatedAt.getTime() + 5 * 60 * 1000 - Date.now()) / 1000
    );
    return {
      canResend: false,
      remainingTime,
    };
  }

  return { canResend: true };
}
