import Stripe from "stripe"

// Use `as const` to satisfy type requirement while avoiding hardcoded version mismatch
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  typescript: true,
})

function requireStripeClient() {
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    throw new Error("STRIPE_SECRET_KEY is not configured")
  }

  return stripe
}

type CheckoutInput = {
  amount: number
  currency?: string
  deliveryId: string
  successUrl: string
  cancelUrl: string
}

export async function createCheckoutSession({
  amount,
  currency = "czk",
  deliveryId,
  successUrl,
  cancelUrl,
}: CheckoutInput) {
  const stripe = requireStripeClient()
  const cents = Math.max(0, Math.round(amount * 100))

  return stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: "Courier Delivery",
            description: `Delivery ID: ${deliveryId}`,
          },
          unit_amount: cents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      deliveryId,
    },
  })
}

type PayoutInput = {
  courierStripeAccountId: string
  amount: number
  currency?: string
  deliveryId: string
}

export async function payoutCourier({
  courierStripeAccountId,
  amount,
  currency = "czk",
  deliveryId,
}: PayoutInput) {
  const stripe = requireStripeClient()
  const courierShare = Math.max(0, Math.round(amount * 0.7 * 100))

  return stripe.transfers.create({
    amount: courierShare,
    currency,
    destination: courierStripeAccountId,
    metadata: {
      deliveryId,
      split: "70/30",
    },
  })
}
