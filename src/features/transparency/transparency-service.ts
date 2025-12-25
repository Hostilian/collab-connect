/**
 * Transparency Service
 * Handles pricing transparency and fee breakdowns
 */

export interface PriceBreakdown {
  basePrice: number
  distanceFee: number
  urgencyMultiplier: number
  itemTypeMultiplier: number
  subtotal: number
  platformFee: number // 30%
  courierPayout: number // 70%
  total: number
}

/**
 * Get transparent price breakdown
 */
export function getPriceBreakdown(
  basePrice: number,
  distanceFee: number,
  urgencyMultiplier = 1,
  itemTypeMultiplier = 1
): PriceBreakdown {
  const subtotal = (basePrice + distanceFee) * urgencyMultiplier * itemTypeMultiplier
  const platformFee = subtotal * 0.3
  const courierPayout = subtotal * 0.7
  
  return {
    basePrice,
    distanceFee,
    urgencyMultiplier,
    itemTypeMultiplier,
    subtotal,
    platformFee,
    courierPayout,
    total: subtotal,
  }
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency = 'CZK'): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Get fee explanation text
 */
export function getFeeExplanation(): string {
  return 'Platform fee (30%) covers customer support, payment processing, and insurance. Courier receives 70% of the delivery price.'
}
