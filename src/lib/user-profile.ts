// This file handles user profile creation, verification, and history.
// Norm Macdonald style: If the user's real, we'll know. If they're not, we'll know that too.

import crypto from 'crypto';
import { prisma } from './prisma';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  verified: boolean;
  createdAt: Date;
  collaborations: number;
  verificationHistory: Array<{ date: Date; method: string }>;
}

// Get Gravatar image by email
export function getGravatarUrl(email: string): string {
  const hash = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
}

export async function upsertUserProfile({ id, name, email }: { id: string; name: string; email: string }) {
  const image = getGravatarUrl(email);
  return prisma.user.upsert({
    where: { id },
    update: { name, email, image },
    create: {
      id,
      name,
      email,
      image,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: null,
      // Relations and stats are handled by Profile
    },
  });
}

export async function verifyUser(id: string, method: string) {
  return prisma.profile.update({
    where: { userId: id },
    data: {
      isVerified: true,
      verifiedAt: new Date(),
      verificationType: method,
    },
  });
}

// Get user profile with history
export async function getUserProfile(id: string): Promise<UserProfile | null> {
  // Fetch user basic info
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;

  // Fetch profile info
  const profile = await prisma.profile.findUnique({ where: { userId: id } });
  // If profile doesn't exist, fill with defaults
  const verified = profile?.isVerified ?? false;
  const createdAt = user.createdAt;

  // Count collaborations
  const collaborations = profile?.totalCollaborations ?? 0;

  // Fetch verification history (mock: just current verification)
  const verificationHistory = [];
  if (profile?.verifiedAt && profile?.verificationType) {
    verificationHistory.push({ date: profile.verifiedAt, method: profile.verificationType });
  }

  return {
    id: user.id,
    name: user.name ?? '',
    email: user.email,
  image: user.image ?? undefined,
    verified,
    createdAt,
    collaborations,
    verificationHistory,
  };
}

export async function getUserCollaborations(id: string) {
  return prisma.collaborationMember.findMany({ where: { userId: id }, include: { collaboration: true } });
}
