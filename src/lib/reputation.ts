/**
 * Reputation System
 * Calculates and manages user reputation scores, ratings, and badges
 */

import { prisma } from './prisma';

export type ReputationLevel = 'newcomer' | 'member' | 'trusted' | 'veteran' | 'legendary';
export type RatingCategory = 'communication' | 'reliability' | 'collaboration';

const LEVEL_THRESHOLDS = {
  newcomer: 0,
  member: 100,
  trusted: 500,
  veteran: 1500,
  legendary: 5000,
};

const BADGE_DEFINITIONS = {
  early_adopter: {
    name: 'Early Adopter',
    description: 'One of the first users to join CollabConnect',
    imageUrl: '/badges/early-adopter.svg',
  },
  helpful: {
    name: 'Helpful',
    description: 'Received 50+ positive ratings',
    imageUrl: '/badges/helpful.svg',
  },
  verified: {
    name: 'Verified',
    description: 'Completed all verification steps',
    imageUrl: '/badges/verified.svg',
  },
  super_collaborator: {
    name: 'Super Collaborator',
    description: 'Successfully completed 25+ collaborations',
    imageUrl: '/badges/super-collaborator.svg',
  },
  communicator: {
    name: 'Great Communicator',
    description: 'Average communication rating of 4.5+',
    imageUrl: '/badges/communicator.svg',
  },
  reliable: {
    name: 'Reliable',
    description: 'Average reliability rating of 4.5+',
    imageUrl: '/badges/reliable.svg',
  },
  team_player: {
    name: 'Team Player',
    description: 'Average collaboration rating of 4.5+',
    imageUrl: '/badges/team-player.svg',
  },
};

/**
 * Calculate reputation level from score
 */
function getLevel(score: number): ReputationLevel {
  if (score >= LEVEL_THRESHOLDS.legendary) return 'legendary';
  if (score >= LEVEL_THRESHOLDS.veteran) return 'veteran';
  if (score >= LEVEL_THRESHOLDS.trusted) return 'trusted';
  if (score >= LEVEL_THRESHOLDS.member) return 'member';
  return 'newcomer';
}

/**
 * Initialize reputation for a new user
 */
export async function initializeReputation(userId: string) {
  try {
    const reputation = await prisma.reputation.create({
      data: {
        userId,
        score: 0,
        level: 'newcomer',
      },
    });

    return reputation;
  } catch (error) {
    console.error('Error initializing reputation:', error);
    return null;
  }
}

/**
 * Submit a rating for a user
 */
export async function submitRating(params: {
  fromUserId: string;
  toUserId: string;
  collaborationId?: string;
  rating: number;
  category: RatingCategory;
  comment?: string;
  isAnonymous?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate rating
    if (params.rating < 1 || params.rating > 5) {
      return { success: false, error: 'Rating must be between 1 and 5' };
    }

    // Can't rate yourself
    if (params.fromUserId === params.toUserId) {
      return { success: false, error: 'Cannot rate yourself' };
    }

    // Check if already rated for this collaboration
    if (params.collaborationId) {
      const existing = await prisma.rating.findUnique({
        where: {
          fromUserId_toUserId_collaborationId_category: {
            fromUserId: params.fromUserId,
            toUserId: params.toUserId,
            collaborationId: params.collaborationId,
            category: params.category,
          },
        },
      });

      if (existing) {
        return { success: false, error: 'Already rated for this collaboration' };
      }
    }

    // Create rating
    await prisma.rating.create({
      data: {
        fromUserId: params.fromUserId,
        toUserId: params.toUserId,
        collaborationId: params.collaborationId,
        rating: params.rating,
        category: params.category,
        comment: params.comment,
        isAnonymous: params.isAnonymous ?? false,
      },
    });

    // Recalculate reputation
    await recalculateReputation(params.toUserId);

    return { success: true };
  } catch (error) {
    console.error('Error submitting rating:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit rating',
    };
  }
}

/**
 * Recalculate reputation score for a user
 */
export async function recalculateReputation(userId: string) {
  try {
    // Get all ratings
    const ratings = await prisma.rating.findMany({
      where: { toUserId: userId },
    });

    if (ratings.length === 0) {
      return;
    }

    // Calculate scores by category
    const categories = ['communication', 'reliability', 'collaboration'] as const;
    const categoryScores: Record<string, number> = {};

    for (const category of categories) {
  const categoryRatings = ratings.filter((r: { category: string; rating: number }) => r.category === category);
      if (categoryRatings.length > 0) {
        const avg = categoryRatings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / categoryRatings.length;
        categoryScores[`${category}Score`] = Math.round(avg * 20); // Scale to 0-100
      }
    }

    // Calculate overall score
    const totalRatings = ratings.length;
  const avgRating = ratings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / totalRatings;
  const positiveRatings = ratings.filter((r: { rating: number }) => r.rating >= 4).length;
  const negativeRatings = ratings.filter((r: { rating: number }) => r.rating <= 2).length;

    // Score formula: (average * 20) * log(totalRatings + 1) * positivity multiplier
    const positivityMultiplier = totalRatings > 0
      ? (positiveRatings / totalRatings) * 1.5 + 0.5
      : 1;

    const baseScore = avgRating * 20; // Scale to 0-100
    const volumeBonus = Math.log10(totalRatings + 1) * 50;
    const score = Math.round((baseScore + volumeBonus) * positivityMultiplier);

    const level = getLevel(score);

    // Update reputation
    await prisma.reputation.upsert({
      where: { userId },
      create: {
        userId,
        score,
        level,
        totalRatings,
        positiveRatings,
        negativeRatings,
        ...categoryScores,
      },
      update: {
        score,
        level,
        totalRatings,
        positiveRatings,
        negativeRatings,
        ...categoryScores,
        lastCalculated: new Date(),
      },
    });

    // Check and award badges
    await awardBadges(userId);

  } catch (error) {
    console.error('Error recalculating reputation:', error);
  }
}

/**
 * Award badges based on criteria
 */
async function awardBadges(userId: string) {
  try {
    const reputation = await prisma.reputation.findUnique({
      where: { userId },
      include: { badges: true },
    });

    if (!reputation) return;

  const existingBadges = new Set(reputation.badges.map((b: { badgeType: string }) => b.badgeType));
    const newBadges: string[] = [];

    // Early Adopter - First 1000 users
    if (!existingBadges.has('early_adopter')) {
      const userCount = await prisma.user.count({
        where: {
          createdAt: { lte: new Date() },
        },
      });
      if (userCount <= 1000) {
        newBadges.push('early_adopter');
      }
    }

    // Helpful - 50+ positive ratings
    if (!existingBadges.has('helpful') && reputation.positiveRatings >= 50) {
      newBadges.push('helpful');
    }

    // Verified - Check all verifications
    if (!existingBadges.has('verified')) {
      const [profile, phoneVerif, idVerif] = await Promise.all([
        prisma.profile.findUnique({ where: { userId } }),
        prisma.phoneVerification.findUnique({ where: { userId } }),
        prisma.idVerification.findUnique({ where: { userId } }),
      ]);

      if (profile?.isVerified && phoneVerif?.verified && idVerif?.status === 'approved') {
        newBadges.push('verified');
      }
    }

    // Super Collaborator - 25+ completed collaborations
    if (!existingBadges.has('super_collaborator')) {
      const collabCount = await prisma.collaborationMember.count({
        where: {
          userId,
          collaboration: { status: 'completed' },
        },
      });
      if (collabCount >= 25) {
        newBadges.push('super_collaborator');
      }
    }

    // Category-specific badges (4.5+ average)
    const categoryBadges: [RatingCategory, string][] = [
      ['communication', 'communicator'],
      ['reliability', 'reliable'],
      ['collaboration', 'team_player'],
    ];

    for (const [category, badgeType] of categoryBadges) {
      if (!existingBadges.has(badgeType)) {
        const ratings = await prisma.rating.findMany({
          where: { toUserId: userId, category },
        });

        if (ratings.length >= 10) {
          const avg = ratings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / ratings.length;
          if (avg >= 4.5) {
            newBadges.push(badgeType);
          }
        }
      }
    }

    // Create badge records
    for (const badgeType of newBadges) {
      const badgeInfo = BADGE_DEFINITIONS[badgeType as keyof typeof BADGE_DEFINITIONS];
      await prisma.reputationBadge.create({
        data: {
          reputationId: reputation.id,
          badgeType,
          name: badgeInfo.name,
          description: badgeInfo.description,
          imageUrl: badgeInfo.imageUrl,
        },
      });
    }

  } catch (error) {
    console.error('Error awarding badges:', error);
  }
}

/**
 * Get reputation for a user
 */
export async function getReputation(userId: string) {
  const reputation = await prisma.reputation.findUnique({
    where: { userId },
    include: {
      badges: true,
    },
  });

  if (!reputation) {
    // Initialize if doesn't exist
    return await initializeReputation(userId);
  }

  return reputation;
}

/**
 * Get ratings for a user
 */
export async function getUserRatings(userId: string, limit = 50) {
  const ratings = await prisma.rating.findMany({
    where: { toUserId: userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return ratings;
}

/**
 * Get ratings breakdown
 */
export async function getRatingsBreakdown(userId: string) {
  const ratings = await prisma.rating.findMany({
    where: { toUserId: userId },
  });

  const breakdown = {
    total: ratings.length,
    average: ratings.length > 0
      ? ratings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / ratings.length
      : 0,
    byRating: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    byCategory: {
      communication: { count: 0, average: 0 },
      reliability: { count: 0, average: 0 },
      collaboration: { count: 0, average: 0 },
    },
  };

  // Count by rating value
  ratings.forEach((r: { rating: number }) => {
    if (r.rating >= 1 && r.rating <= 5) {
      breakdown.byRating[r.rating as 1 | 2 | 3 | 4 | 5]++;
    }
  });

  // Calculate by category
  (['communication', 'reliability', 'collaboration'] as RatingCategory[]).forEach((category) => {
  const categoryRatings = ratings.filter((r: { category: string; rating: number }) => r.category === category);
    if (categoryRatings.length > 0) {
      breakdown.byCategory[category] = {
        count: categoryRatings.length,
        average: categoryRatings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / categoryRatings.length,
      };
    }
  });

  return breakdown;
}
