/**
 * Two-Factor Authentication (2FA) with TOTP
 *
 * Implements Time-based One-Time Password (TOTP) authentication
 * with backup codes for account recovery.
 */

import crypto from 'crypto';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import prisma from './prisma';

const APP_NAME = 'CollabConnect';

/**
 * Generate a new TOTP secret for a user
 */
export function generateTOTPSecret(): string {
  return authenticator.generateSecret();
}

/**
 * Generate QR code for TOTP setup
 */
export async function generateQRCode(
  email: string,
  secret: string
): Promise<string> {
  const otpauth = authenticator.keyuri(email, APP_NAME, secret);
  return await QRCode.toDataURL(otpauth);
}

/**
 * Verify TOTP token
 */
export function verifyTOTP(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token, secret });
  } catch {
    return false;
  }
}

/**
 * Generate backup codes (10 codes)
 */
export function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
  }
  return codes;
}

/**
 * Hash backup codes for storage
 */
function hashBackupCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

/**
 * Enable 2FA for user
 */
export async function enable2FA(userId: string, secret: string, token: string) {
  // Verify the token first
  if (!verifyTOTP(token, secret)) {
    throw new Error('Invalid verification code');
  }

  // Generate backup codes
  const backupCodes = generateBackupCodes();
  const hashedCodes = backupCodes.map(hashBackupCode);

  // Save to database
  await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorEnabled: true,
      twoFactorSecret: secret,
      backupCodes: hashedCodes,
    },
  });

  return {
    enabled: true,
    backupCodes, // Return unhashed codes once for user to save
  };
}

/**
 * Disable 2FA for user
 */
export async function disable2FA(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      backupCodes: [],
    },
  });
}

/**
 * Verify 2FA token during login
 */
export async function verify2FAToken(
  userId: string,
  token: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      twoFactorEnabled: true,
      twoFactorSecret: true,
      backupCodes: true,
    },
  });

  if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
    return false;
  }

  // Try TOTP verification first
  if (verifyTOTP(token, user.twoFactorSecret)) {
    return true;
  }

  // Try backup codes
  const hashedToken = hashBackupCode(token);
  if (user.backupCodes.includes(hashedToken)) {
    // Remove used backup code
    const remainingCodes = user.backupCodes.filter((code: string) => code !== hashedToken);
    await prisma.user.update({
      where: { id: userId },
      data: { backupCodes: remainingCodes },
    });
    return true;
  }

  return false;
}

/**
 * Check if user has 2FA enabled
 */
export async function is2FAEnabled(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorEnabled: true },
  });
  return user?.twoFactorEnabled || false;
}

/**
 * Get remaining backup codes count
 */
export async function getRemainingBackupCodes(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { backupCodes: true },
  });
  return user?.backupCodes.length || 0;
}

/**
 * Regenerate backup codes
 */
export async function regenerateBackupCodes(userId: string): Promise<string[]> {
  const newCodes = generateBackupCodes();
  const hashedCodes = newCodes.map((code: string) => hashBackupCode(code));

  await prisma.user.update({
    where: { id: userId },
    data: { backupCodes: hashedCodes },
  });

  return newCodes;
}
