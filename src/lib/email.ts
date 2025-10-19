import VerificationEmail from '@/emails/VerificationEmail';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';
import { Resend } from 'resend';

// Initialize Resend only when needed to avoid build-time errors
const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(process.env.RESEND_API_KEY);
};

export async function sendVerificationEmail(userId: string, email: string, name: string) {
    try {
        // Generate verification token
        const token = randomUUID();
        const expires = new Date();
        expires.setHours(expires.getHours() + 24); // 24-hour expiration

        // Save token to database
        await prisma.user.update({
            where: { id: userId },
            data: {
                emailVerificationToken: { set: token },
                emailVerificationExpires: { set: expires },
            },
        });

        // Build verification URL
        const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;

        // Send email using Resend
        const resend = getResendClient();
        const { data, error } = await resend.emails.send({
            from: 'CollabConnect <onboarding@collabconnect.com>',
            to: email,
            subject: 'Verify your CollabConnect account',
            react: VerificationEmail({
                name: name || 'there',
                verificationUrl,
            }),
        });

        if (error) {
            logger.error('Resend error', { error: String(error) });
            throw new Error('Failed to send verification email');
        }

        return { success: true, data };
    } catch (_error) {
        logger.error('Send verification email error', { error: String(_error) });
        throw _error;
    }
}

export async function resendVerificationEmail(email: string) {
    try {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error('User not found');
        }

        if (user.emailVerified) {
            throw new Error('Email already verified');
        }

        // Send new verification email
        return await sendVerificationEmail(user.id, user.email, user.name || 'there');
    } catch (_error) {
        logger.error('Resend verification email error', { error: String(_error) });
        throw _error;
    }
}

/**
 * Generic email sending function
 */
export async function sendEmail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}): Promise<void> {
    try {
        const emailPayload = {
            from: 'CollabConnect <notifications@collabconnect.com>',
            to: options.to,
            subject: options.subject,
            ...(options.html ? { html: options.html } : {}),
            ...(options.text ? { text: options.text } : {}),
        };

        // Ensure at least text or html is provided
        const finalPayload = emailPayload.html || emailPayload.text
            ? emailPayload
            : { ...emailPayload, text: options.subject };

        const resend = getResendClient();
        const { error } = await resend.emails.send(finalPayload as { from: string; to: string; subject: string; html?: string; text: string });

        if (error) {
            logger.error('Email send error', { error: String(error) });
            throw new Error('Failed to send email');
        }
    } catch (_error) {
        logger.error('Send email error', { error: String(_error) });
        throw _error;
    }
}
