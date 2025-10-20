// Well, here's the part where we take people's money and give most of it to the courier. Stripe does the heavy lifting.
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-09-30.clover',
});

export async function createCheckoutSession({
  amount,
  currency = 'czk',
  deliveryId,
  successUrl,
  cancelUrl,
}: {
  amount: number;
  currency?: string;
  deliveryId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  // Look, if Stripe doesn't like your request, that's on them.
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: 'Courier Delivery',
            description: `Delivery ID: ${deliveryId}`,
          },
          unit_amount: amount * 100, // Stripe wants cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      deliveryId,
    },
  });
  return session;
}

export async function payoutCourier({
  courierStripeAccountId,
  amount,
  currency = 'czk',
  deliveryId,
}: {
  courierStripeAccountId: string;
  amount: number;
  currency?: string;
  deliveryId: string;
}) {
  // Stripe Connect payout. 70% to courier, 30% to us. That's the deal.
  const transfer = await stripe.transfers.create({
    amount: Math.floor(amount * 0.7 * 100), // 70% in cents
    currency,
    destination: courierStripeAccountId,
    metadata: {
      deliveryId,
    },
  });
  return transfer;
}
