import { resendVerificationEmail } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/resend-verification
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        await resendVerificationEmail(email);

        return NextResponse.json({
            message: 'Verification email sent successfully',
        });
    } catch (error) {
        console.error('Resend verification error:', error);

        // Handle specific errors
        if (error instanceof Error) {
            if (error.message === 'User not found') {
                return NextResponse.json(
                    { error: 'No account found with that email' },
                    { status: 404 }
                );
            }
            if (error.message === 'Email already verified') {
                return NextResponse.json(
                    { error: 'This email is already verified' },
                    { status: 400 }
                );
            }
        }

        return NextResponse.json(
            { error: 'Failed to resend verification email' },
            { status: 500 }
        );
    }
}
