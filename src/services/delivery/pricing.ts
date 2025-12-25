export type ItemType =
  | "envelope"
  | "small_package"
  | "medium_package"
  | "large_package"
  | "fragile"

export type SupportedCurrency = "CZK" | "EUR" | "USD" | "UAH" | "TRY"

const BASE_RATE: Record<SupportedCurrency, number> = {
  CZK: 22,
  EUR: 1,
  USD: 1.1,
  UAH: 40,
  TRY: 34,
}

const ITEM_MULTIPLIER: Record<ItemType, number> = {
  envelope: 1,
  small_package: 1.2,
  medium_package: 1.5,
  large_package: 2,
  fragile: 1.8,
}

const MIN_PRICE: Record<SupportedCurrency, number> = {
  CZK: 150,
  EUR: 10,
  USD: 12,
  UAH: 400,
  TRY: 350,
}

export type PricingInput = {
  distanceKm: number
  scheduledDate: Date
  itemType: ItemType
  currency?: SupportedCurrency
}

export type PricingBreakdown = {
  baseDistance: number
  timeMultiplier: number
  itemMultiplier: number
  urgencyLabel: "express" | "same_day" | "scheduled"
}

export type PricingResult = {
  totalPrice: number
  courierEarning: number
  platformFee: number
  currency: SupportedCurrency
  breakdown: PricingBreakdown
}

function resolveCurrency(currency?: SupportedCurrency): SupportedCurrency {
  return currency ?? "CZK"
}

function calculateUrgencyMultiplier(date: Date): { multiplier: number; label: PricingBreakdown["urgencyLabel"] } {
  const hoursUntilDelivery = (date.getTime() - Date.now()) / 3_600_000

  if (hoursUntilDelivery <= 2) {
    return { multiplier: 2, label: "express" }
  }

  if (hoursUntilDelivery <= 24) {
    return { multiplier: 1.5, label: "same_day" }
  }

  return { multiplier: 1, label: "scheduled" }
}

export function calculatePrice({
  distanceKm,
  scheduledDate,
  itemType,
  currency,
}: PricingInput): PricingResult {
  const resolvedCurrency = resolveCurrency(currency)
  const baseRate = BASE_RATE[resolvedCurrency]
  const distanceCharge = Math.max(0, distanceKm) * baseRate
  const { multiplier: timeMultiplier, label } = calculateUrgencyMultiplier(scheduledDate)
  const itemMultiplier = ITEM_MULTIPLIER[itemType]

  const rawTotal = distanceCharge * timeMultiplier * itemMultiplier
  const totalPrice = Math.max(MIN_PRICE[resolvedCurrency], Math.round(rawTotal))
  const courierEarning = Math.round(totalPrice * 0.7)
  const platformFee = totalPrice - courierEarning

  return {
    totalPrice,
    courierEarning,
    platformFee,
    currency: resolvedCurrency,
    breakdown: {
      baseDistance: Math.round(distanceCharge),
      timeMultiplier,
      itemMultiplier,
      urgencyLabel: label,
    },
  }
}
