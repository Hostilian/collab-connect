/**
 * Onboarding System
 * Tracks user onboarding progress
 */

import { prisma } from './prisma';

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const ONBOARDING_STEPS = [
  {
    id: 1,
    field: 'profileCompleted' as const,
    title: 'Complete Your Profile',
    description: 'Add your name, bio, and profile picture',
  },
  {
    id: 2,
    field: 'locationAdded' as const,
    title: 'Share Your Location',
    description: 'Add your location to connect with nearby collaborators',
  },
  {
    id: 3,
    field: 'interestsAdded' as const,
    title: 'Choose Your Interests',
    description: 'Select hobbies and interests to find like-minded people',
  },
  {
    id: 4,
    field: 'verificationStarted' as const,
    title: 'Verify Your Identity',
    description: 'Complete email, phone, or ID verification',
  },
  {
    id: 5,
    field: 'firstGroupJoined' as const,
    title: 'Join a Group',
    description: 'Find and join your first collaboration group',
  },
  {
    id: 6,
    field: 'tourCompleted' as const,
    title: 'Take the Tour',
    description: 'Learn how to use CollabConnect effectively',
  },
];

/**
 * Initialize onboarding for a new user
 */
export async function initializeOnboarding(userId: string) {
  try {
    const progress = await prisma.onboardingProgress.create({
      data: {
        userId,
        currentStep: 1,
        totalSteps: ONBOARDING_STEPS.length,
      },
    });

    return progress;
  } catch (error) {
    console.error('Error initializing onboarding:', error);
    return null;
  }
}

/**
 * Get onboarding progress
 */
export async function getOnboardingProgress(userId: string) {
  let progressRecord = await prisma.onboardingProgress.findUnique({
    where: { userId },
  });

  if (!progressRecord) {
    progressRecord = await initializeOnboarding(userId);
  }

  if (!progressRecord) {
    throw new Error('Failed to initialize onboarding');
  }

  const steps = ONBOARDING_STEPS.map(step => ({
    ...step,
    completed: progressRecord![step.field],
  }));

  const completedCount = steps.filter(s => s.completed).length;
  const percentComplete = Math.round((completedCount / ONBOARDING_STEPS.length) * 100);

  return {
    progress: steps,
    currentStep: progressRecord.currentStep,
    totalSteps: progressRecord.totalSteps,
    isComplete: progressRecord.isComplete,
    percentComplete,
  };
}/**
 * Mark a step as complete
 */
export async function completeOnboardingStep(
  userId: string,
  stepField: 'profileCompleted' | 'locationAdded' | 'interestsAdded' | 'verificationStarted' | 'firstGroupJoined' | 'tourCompleted'
): Promise<{ success: boolean; isComplete?: boolean }> {
  try {
    const progress = await prisma.onboardingProgress.findUnique({
      where: { userId },
    });

    if (!progress) {
      await initializeOnboarding(userId);
    }

    const updateData: Record<string, boolean | Date | number> = {
      [stepField]: true,
    };

    // Check if all steps are complete
    const updatedProgress = await prisma.onboardingProgress.update({
      where: { userId },
      data: updateData,
    });

    const allComplete =
      updatedProgress.profileCompleted &&
      updatedProgress.locationAdded &&
      updatedProgress.interestsAdded &&
      updatedProgress.verificationStarted &&
      updatedProgress.firstGroupJoined &&
      updatedProgress.tourCompleted;

    if (allComplete && !updatedProgress.isComplete) {
      await prisma.onboardingProgress.update({
        where: { userId },
        data: {
          isComplete: true,
          completedAt: new Date(),
        },
      });
    }

    // Update current step to next incomplete step
    const currentStepIndex = ONBOARDING_STEPS.findIndex(
      s => !updatedProgress[s.field]
    );

    if (currentStepIndex !== -1) {
      await prisma.onboardingProgress.update({
        where: { userId },
        data: {
          currentStep: currentStepIndex + 1,
        },
      });
    }

    return {
      success: true,
      isComplete: allComplete,
    };
  } catch (error) {
    console.error('Error completing onboarding step:', error);
    return { success: false };
  }
}

/**
 * Auto-check and update onboarding progress
 */
export async function autoCheckOnboardingProgress(userId: string) {
  try {
    const [profile, interests, groups, verifications] = await Promise.all([
      prisma.profile.findUnique({ where: { userId } }),
      prisma.profileInterest.count({ where: { profileId: userId } }),
      prisma.groupMember.count({ where: { userId } }),
      Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.phoneVerification.findUnique({ where: { userId } }),
        prisma.idVerification.findUnique({ where: { userId } }),
      ]),
    ]);

    const updates: Record<string, boolean> = {};

    // Check profile completion
    if (profile && profile.bio && (profile.latitude !== null && profile.longitude !== null)) {
      updates.profileCompleted = true;
    }

    // Check location
    if (profile && profile.latitude !== null && profile.longitude !== null) {
      updates.locationAdded = true;
    }

    // Check interests
    if (interests > 0) {
      updates.interestsAdded = true;
    }

    // Check verification
    const [user, phoneVerif, idVerif] = verifications;
    if (
      user?.emailVerified ||
      phoneVerif?.verified ||
      idVerif?.status === 'approved'
    ) {
      updates.verificationStarted = true;
    }

    // Check group membership
    if (groups > 0) {
      updates.firstGroupJoined = true;
    }

    if (Object.keys(updates).length > 0) {
      await prisma.onboardingProgress.updateMany({
        where: { userId },
        data: updates,
      });
    }
  } catch (error) {
    console.error('Error auto-checking onboarding:', error);
  }
}
