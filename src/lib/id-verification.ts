/**
 * ID Verification System
 * Handles document upload, verification, and admin review
 */

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { prisma } from './prisma';

const s3Client = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
  ? new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
  : null;

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'collab-connect-verifications';

export type DocumentType = 'passport' | 'drivers_license' | 'national_id';
export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'needs_review';

/**
 * Generate a presigned URL for document upload
 */
export async function generateUploadUrl(
  userId: string,
  fileType: string,
  documentPart: 'front' | 'back' | 'selfie'
): Promise<{ uploadUrl: string; fileKey: string } | null> {
  if (!s3Client) {
    console.warn('S3 not configured');
    return null;
  }

  const fileKey = `verifications/${userId}/${documentPart}-${Date.now()}.${fileType.split('/')[1]}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    ContentType: fileType,
  });

  try {
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return { uploadUrl, fileKey };
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return null;
  }
}

/**
 * Submit ID verification documents
 */
export async function submitIdVerification(params: {
  userId: string;
  documentType: DocumentType;
  documentNumber?: string;
  frontImageUrl: string;
  backImageUrl?: string;
  selfieUrl?: string;
  expiresAt?: Date;
}): Promise<{ success: boolean; verificationId?: string; error?: string }> {
  try {
    const verification = await prisma.idVerification.upsert({
      where: { userId: params.userId },
      create: {
        userId: params.userId,
        documentType: params.documentType,
        documentNumber: params.documentNumber,
        frontImageUrl: params.frontImageUrl,
        backImageUrl: params.backImageUrl,
        selfieUrl: params.selfieUrl,
        expiresAt: params.expiresAt,
        status: 'pending',
      },
      update: {
        documentType: params.documentType,
        documentNumber: params.documentNumber,
        frontImageUrl: params.frontImageUrl,
        backImageUrl: params.backImageUrl,
        selfieUrl: params.selfieUrl,
        expiresAt: params.expiresAt,
        status: 'pending',
        rejectionReason: null,
        reviewedBy: null,
        reviewedAt: null,
      },
    });

    return {
      success: true,
      verificationId: verification.id,
    };
  } catch (error) {
    console.error('Error submitting ID verification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit verification',
    };
  }
}

/**
 * Review ID verification (Admin only)
 */
export async function reviewIdVerification(params: {
  verificationId: string;
  reviewerId: string;
  status: Extract<VerificationStatus, 'approved' | 'rejected' | 'needs_review'>;
  rejectionReason?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const verification = await prisma.idVerification.update({
      where: { id: params.verificationId },
      data: {
        status: params.status,
        reviewedBy: params.reviewerId,
        reviewedAt: new Date(),
        rejectionReason: params.status === 'rejected' ? params.rejectionReason : null,
      },
    });

    // If approved, update user's profile verification
    if (params.status === 'approved') {
      await prisma.profile.update({
        where: { userId: verification.userId },
        data: {
          isVerified: true,
          verifiedAt: new Date(),
          verificationType: 'id',
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error reviewing ID verification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to review verification',
    };
  }
}

/**
 * Get verification status for a user
 */
export async function getVerificationStatus(userId: string) {
  const verification = await prisma.idVerification.findUnique({
    where: { userId },
  });

  if (!verification) {
    return {
      status: 'not_started',
      verification: null,
    };
  }

  return {
    status: verification.status,
    verification: {
      id: verification.id,
      documentType: verification.documentType,
      status: verification.status,
      submittedAt: verification.createdAt,
      reviewedAt: verification.reviewedAt,
      rejectionReason: verification.rejectionReason,
    },
  };
}

/**
 * Get pending verifications (Admin only)
 */
export async function getPendingVerifications(limit = 50) {
  const verifications = await prisma.idVerification.findMany({
    where: {
      status: { in: ['pending', 'needs_review'] },
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: limit,
  });

  // Fetch user details separately
  const verificationsWithUsers = await Promise.all(
    verifications.map(async (v) => {
      const user = await prisma.user.findUnique({
        where: { id: v.userId },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });
      return { ...v, user };
    })
  );

  return verificationsWithUsers;
}

/**
 * Get verification statistics (Admin only)
 */
export async function getVerificationStats() {
  const stats = await prisma.idVerification.groupBy({
    by: ['status'],
    _count: true,
  });

  const total = await prisma.idVerification.count();
  // Note: Average review time calculation would require timestamp difference calculation
  // const avgReviewTime = ...

  return {
    total,
    byStatus: stats.reduce((acc: Record<string, number>, stat) => {
      acc[stat.status] = stat._count;
      return acc;
    }, {} as Record<string, number>),
  };
}
