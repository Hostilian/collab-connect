/**
 * User Profile Service
 * Handles courier profile management
 */

import { prisma } from '@/core/database/prisma-client'

export interface UserProfile {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  bio?: string
  isVerified: boolean
  createdAt: Date
}

export interface ProfileUpdateData {
  name?: string
  phone?: string
  avatar?: string
  bio?: string
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  })

  if (!user) return null

  return {
    id: user.id,
    email: user.email || '',
    name: user.name || '',
    isVerified: false,
    createdAt: user.createdAt,
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  data: ProfileUpdateData
): Promise<UserProfile | null> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  })

  return {
    id: user.id,
    email: user.email || '',
    name: user.name || '',
    isVerified: false,
    createdAt: user.createdAt,
  }
}
