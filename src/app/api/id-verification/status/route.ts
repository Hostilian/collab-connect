/**
 * ID Verification API - Get Status
 * GET /api/id-verification/status
 */

import { auth } from '@/lib/auth';
import { getVerificationStatus } from '@/lib/id-verification';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const status = await getVerificationStatus(session.user.id);

    return NextResponse.json(status);
  } catch (error) {
    console.error('ID verification status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
