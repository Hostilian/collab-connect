// Look, it's the money calculator. 70% to the courier, 30% to us. That's the whole business model.
export type PricingInput = {
  distanceKm: number;
  scheduledDate: Date;
  itemType: 'envelope' | 'small_package' | 'medium_package' | 'large_package' | 'fragile';
};

export type PricingResult = {
  totalPrice: number;
  courierEarning: number;
  platformFee: number;
  breakdown: {
    baseDistance: number;
    timeMultiplier: number;
    itemMultiplier: number;
  };
};

export function calculatePrice({ distanceKm, scheduledDate, itemType }: PricingInput): PricingResult {
  // Base rate per kilometer
  const baseRate = 20; // CZK, EUR, or local currency
  const distanceCost = distanceKm * baseRate;

  // Time multiplier
  const hoursUntilDelivery = (scheduledDate.getTime() - Date.now()) / (1000 * 60 * 60);
  let timeMultiplier = 1.0;
  if (hoursUntilDelivery < 2) timeMultiplier = 2.0;
  else if (hoursUntilDelivery < 24) timeMultiplier = 1.5;
  else if (hoursUntilDelivery < 48) timeMultiplier = 1.2;
  else timeMultiplier = 1.0;

  // Item type multiplier
  const itemMultipliers: Record<string, number> = {
    envelope: 1.0,
    small_package: 1.2,
    medium_package: 1.5,
    large_package: 2.0,
    fragile: 1.8,
  };
  const itemMultiplier = itemMultipliers[itemType] || 1.0;

  // Total customer price
  const totalPrice = distanceCost * timeMultiplier * itemMultiplier;
  const courierEarning = totalPrice * 0.70;
  const platformFee = totalPrice * 0.30;

  return {
    totalPrice: Math.round(totalPrice),
    courierEarning: Math.round(courierEarning),
    platformFee: Math.round(platformFee),
    breakdown: {
      baseDistance: Math.round(distanceCost),
      timeMultiplier,
      itemMultiplier,
    },
  };
}
