/**
 * Onboarding API
 * GET /api/onboarding - Get progress
 * POST /api/onboarding/complete - Complete a step
 */

import { auth } from '@/lib/auth';
import { completeOnboardingStep, getOnboardingProgress } from '@/lib/onboarding';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const progress = await getOnboardingProgress(session.user.id);

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Onboarding get error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { step } = body;

    if (!step) {
      return NextResponse.json(
        { error: 'Step field is required' },
        { status: 400 }
      );
    }

    const validSteps = [
      'profileCompleted',
      'locationAdded',
      'interestsAdded',
      'verificationStarted',
      'firstGroupJoined',
      'tourCompleted',
    ];

    if (!validSteps.includes(step)) {
      return NextResponse.json(
        { error: 'Invalid step' },
        { status: 400 }
      );
    }

    const result = await completeOnboardingStep(session.user.id, step);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to complete step' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      isComplete: result.isComplete,
    });
  } catch (error) {
    console.error('Onboarding complete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
