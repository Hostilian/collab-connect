/**
 * Onboarding Service
 * Handles new courier onboarding flow
 */

export type OnboardingStep =
  | 'profile'
  | 'verification'
  | 'documents'
  | 'payment'
  | 'complete'

export interface OnboardingStatus {
  currentStep: OnboardingStep
  completedSteps: OnboardingStep[]
  isComplete: boolean
}

/**
 * Get onboarding status for a courier
 */
export async function getOnboardingStatus(
  _courierId: string
): Promise<OnboardingStatus> {
  // Placeholder - would check what steps are complete
  return {
    currentStep: 'profile',
    completedSteps: [],
    isComplete: false,
  }
}

/**
 * Mark an onboarding step as complete
 */
export async function completeOnboardingStep(
  courierId: string,
  step: OnboardingStep
): Promise<OnboardingStatus> {
  console.log(`[Onboarding] ${courierId} completed step: ${step}`)
  return getOnboardingStatus(courierId)
}

/**
 * Check if courier has completed onboarding
 */
export async function isOnboardingComplete(courierId: string): Promise<boolean> {
  const status = await getOnboardingStatus(courierId)
  return status.isComplete
}
