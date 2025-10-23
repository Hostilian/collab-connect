/**
 * GDPR Data Export API
 * POST /api/gdpr/export - Export all user data
 */

import { AuditAction, logAudit } from '@/lib/audit';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch all user data
    const [user, profile, notifications, collaborations, groupMemberships, messages] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: {
          accounts: true,
          sessions: true,
        },
      }),
      prisma.profile.findUnique({
        where: { userId },
        include: {
          hobbies: { include: { hobby: true } },
          interests: { include: { interest: true } },
        },
      }),
      prisma.notification.findMany({
        where: { userId },
      }),
      prisma.collaboration.findMany({
        where: {
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } },
          ],
        },
        include: {
          members: true,
          documents: true,
        },
      }),
      prisma.groupMember.findMany({
        where: { userId },
        include: { group: true },
      }),
      prisma.message.findMany({
        where: { userId },
      }),
    ]);

    // Compile all data
    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
        emailVerified: user?.emailVerified,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt,
        lastLoginAt: user?.lastLoginAt,
      },
      profile: profile ? {
        bio: profile.bio,
        location: profile.location,
        latitude: profile.latitude,
        longitude: profile.longitude,
        isVerified: profile.isVerified,
        verifiedAt: profile.verifiedAt,
        preferredLanguage: profile.preferredLanguage,
        totalCollaborations: profile.totalCollaborations,
        successfulCollabs: profile.successfulCollabs,
        activeCollabs: profile.activeCollabs,
        isAvailable: profile.isAvailable,
        availabilityNote: profile.availabilityNote,
  hobbies: profile.hobbies.map((h: { hobby: { name: string } }) => h.hobby.name),
  interests: profile.interests.map((i: { interest: { name: string } }) => i.interest.name),
      } : null,
      notifications: notifications.map((n: { type: string; title: string | null; message: string | null; isRead: boolean; createdAt: Date }) => ({
        type: n.type,
        title: n.title,
        message: n.message,
        isRead: n.isRead,
        createdAt: n.createdAt,
      })),
      collaborations: collaborations.map((c: { title: string; description: string | null; type: string; status: string; ownerId: string; startedAt: Date | null; completedAt: Date | null }) => ({
        title: c.title,
        description: c.description,
        type: c.type,
        status: c.status,
        role: c.ownerId === userId ? 'owner' : 'member',
        startedAt: c.startedAt,
        completedAt: c.completedAt,
      })),
      groups: groupMemberships.map((gm: { group: { name: string; description: string | null }; role: string; joinedAt: Date }) => ({
        name: gm.group.name,
        description: gm.group.description,
        role: gm.role,
        joinedAt: gm.joinedAt,
      })),
      messages: messages.map((m: { content: string; createdAt: Date }) => ({
        content: m.content,
        createdAt: m.createdAt,
      })),
    };

    // Log the export request
    await logAudit({
      action: AuditAction.DATA_EXPORT,
      userId,
      success: true,
      details: { format: 'JSON' },
    });

    return NextResponse.json({
      data: exportData,
      message: 'Data export complete',
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
