import WelcomeEmail from '@/emails/WelcomeEmail';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// GET /api/auth/verify?token=xxx
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json(
                { error: 'Verification token is required' },
                { status: 400 }
            );
        }

        // Find user with this verification token
        const user = await prisma.user.findFirst({
            where: {
                emailVerificationToken: token,
                emailVerificationExpires: {
                    gt: new Date(), // Token hasn't expired
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid or expired verification token' },
                { status: 400 }
            );
        }

        // Check if already verified
        if (user.emailVerified) {
            return NextResponse.redirect(
                new URL('/dashboard?verified=already', request.url)
            );
        }

        // Update user as verified
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                emailVerificationToken: null, // Clear token
                emailVerificationExpires: null,
            },
        });

        // Send welcome email
        try {
            await resend.emails.send({
                from: 'CollabConnect <onboarding@collabconnect.com>',
                to: user.email,
                subject: 'Welcome to CollabConnect!',
                react: WelcomeEmail({
                    name: user.name || 'there',
                    dashboardUrl: `${process.env.NEXTAUTH_URL}/dashboard`,
                }),
            });
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Don't fail verification if welcome email fails
        }

        // Redirect to dashboard with success message
        return NextResponse.redirect(
            new URL('/dashboard?verified=success', request.url)
        );
    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.json(
            { error: 'Failed to verify email' },
            { status: 500 }
        );
    }
}
