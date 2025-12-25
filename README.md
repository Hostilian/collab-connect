# Courier Connect

Customers type two addresses, pick a time, and get a quote in seconds. Couriers see live jobs, tap to accept, and keep 70% of every completed delivery. That's the whole business.

## What you get

- **Instant quoting** – Google Maps + our pricing service estimate distance, urgency, and item risk, then split the payout 70/30.
- **Courier tools** – real-time job feed (Supabase for now), dashboard earnings, and guardrails for ID + phone verification.
- **Multi-language UX** – `/cs`, `/en`, `/uk`, `/vi`, `/tr` share the same delivery form with locale-specific copy and currencies.
- **Ready for money** – Stripe Checkout for payments, Connect transfers for payouts, Twilio/Email hooks for notifications.

## Project layout

```
src/
 ├─ app/
 │   ├─ (public)/           # Landing + delivery form
 │   └─ (courier)/          # Courier dashboard + auth
 ├─ core/                   # Auth, database, security, logging
 ├─ services/               # Pricing, payments, maps, notifications, realtime, i18n
 ├─ features/               # Domain-specific UI + logic (delivery, courier, admin, …)
 ├─ shared/                 # Reusable UI primitives, hooks, styles, providers
 ├─ archive/                # CollabConnect leftovers waiting for deletion
 └─ lib/                    # Temporary re-export shims (delete when imports are clean)
messages/                   # next-intl locale dictionaries
prisma/                     # Database schema + migrations
```

## Getting started

```bash
npm install
npm run dev
```

Environment variables live in `.env`. You need at least:

| Name | Why |
| --- | --- |
| `DATABASE_URL` | Postgres for Prisma + NextAuth |
| `NEXTAUTH_SECRET` | Session signing |
| `STRIPE_SECRET_KEY` | Checkout + payouts |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Courier job feed |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Address autocomplete + map |

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build (fails if lint/test/typecheck break) |
| `npm run lint` | ESLint across TS/TSX |
| `npm run typecheck` | Strict TS compile |
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright flows |
| `npm run prisma:migrate` | Apply new Prisma migrations |

## Style + tone

Short sentences. Honest comments. If something is still a TODO, say so. The code should read like you explained it to a courier over coffee.

## Roadmap

1. Replace the Supabase mock jobs with Prisma-backed deliveries.
2. Finish the `/courier` auth flow + ID verification.
3. Wire notifications (Twilio/SMS + email) when jobs are accepted/picked up/delivered.
4. Delete the `archive/` folder once every route is courier-focused.

Questions? Read the plan in `COURIER_CONNECT_PLAN.md` or open an issue with what hurts.
