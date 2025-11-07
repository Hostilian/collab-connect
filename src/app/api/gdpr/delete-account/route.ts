/**
 * GDPR Account Deletion API
 * POST /api/gdpr/delete-account - Delete user account and all associated data
 */

import { AuditAction, logAudit } from '@/lib/audit';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { password, confirmation } = body;

    // Require explicit confirmation
    if (confirmation !== 'DELETE MY ACCOUNT') {
      return NextResponse.json(
        { error: 'Invalid confirmation. Please type "DELETE MY ACCOUNT" to confirm.' },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Verify password for security
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (user?.password) {
      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        return NextResponse.json(
          { error: 'Invalid password' },
          { status: 401 }
        );
      }
    }

    // Log the deletion request before deleting
    await logAudit({
      action: AuditAction.ACCOUNT_DELETION,
      userId,
      success: true,
      details: { reason: 'User requested account deletion' },
    });

    // Delete all user data (cascade will handle related records)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      message: 'Account successfully deleted. We\'re sorry to see you go.',
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
