# Courier Connect - AI Agent Instructions

## What This Thing Is

Look, it's a courier service. Not rocket science. People need stuff moved from Point A to Point B. Other people move it. We take 30%, they get 70%. That's the whole business model right there.

## The Big Picture (Or: How We Got Here)

This used to be "CollabConnect" - some insurance collaboration thing. Now it's "Courier Connect" - a delivery service. We're not building the next SpaceX here, folks. Just helping people get their Facebook Marketplace couch delivered.

### Core Concept:
- **Customers**: Don't need to register. Just say "I need this thing moved" and boom, done.
- **Couriers**: Gotta register. We need to know who's carrying people's stuff.
- **Money**: 70% to courier, 30% to us. Simple math.

## Architecture (AKA Where Stuff Lives)

```
src/
├── app/                    # Next.js pages (you know, the website)
│   ├── [locale]/          # Multi-language routes (Czech, English, etc.)
│   ├── courier/           # Courier dashboard (where they see jobs)
│   ├── delivery/          # Customer delivery form (no login needed)
│   └── api/               # Backend stuff (payments, notifications)
├── components/            # UI pieces (buttons, forms, the usual suspects)
├── lib/                   # The important bits
│   ├── pricing.ts         # 70/30 split calculator
│   ├── maps.ts            # Google Maps integration
│   ├── notifications.ts   # Twilio, SendGrid
│   └── validation.ts      # Making sure people don't break things
└── prisma/               # Database (Couriers, Deliveries, Payments)
```

## Code Style: The Norm Macdonald Way

We write code like we're explaining it to a friend at a bar. No corporate jargon. No buzzwords.

### ❌ Bad (Boring):
```typescript
// Process the delivery request asynchronously
async function processDeliveryRequest(data: DeliveryRequestDTO): Promise<DeliveryResponse> {
  const validation = await validateDeliveryInput(data);
  if (!validation.success) throw new ValidationError();
  return createDelivery(validation.data);
}
```

### ✅ Good (Norm Style):
```typescript
// Look, either the customer's request makes sense or it doesn't. Let's find out.
async function processDeliveryRequest(data: DeliveryRequestDTO): Promise<DeliveryResponse> {
  // First, check if they actually gave us real addresses and not just gibberish
  const validation = await validateDeliveryInput(data);
  
  if (!validation.success) {
    // Turns out it was gibberish. Who knew?
    throw new ValidationError();
  }
  
  // Well, would you look at that. It's a real delivery request.
  return createDelivery(validation.data);
}
```

**Key principles:**
- Short sentences. Like you're talking.
- Self-deprecating. We're not curing cancer here.
- Conversational. "Look," "Well," "Turns out."
- No jargon. Say "payment" not "transaction processing pipeline."

## Critical Workflows

### Starting Development:
```bash
# The usual suspects
npm install
npm run dev

# Database stuff (when you need it)
npm run prisma:generate
npm run prisma:migrate
```

### Testing Multi-Language:
Visit `localhost:3000/cs` (Czech), `/en` (English), `/uk` (Ukrainian), `/vi` (Vietnamese), `/tr` (Turkish).

### Pricing Algorithm:
Location: `src/lib/pricing.ts`

The formula: 
1. Base rate × distance = base price
2. Multiply by time urgency (express = 2x, same day = 1.5x, scheduled = 1x)
3. Multiply by item type (envelope = 1x, large package = 2x, fragile = 1.8x)
4. Customer pays 100%, courier gets 70%, we keep 30%

**Don't mess with the 70/30 split. That's the whole point.**

## Database Models (The Important Ones)

### Courier
- Has: email, phone, rating, earnings
- Can: accept jobs, get paid, be verified
- Location: `prisma/schema.prisma`

### Delivery
- Has: pickup address, delivery address, price, courier assignment
- Status: pending → accepted → picked_up → delivered
- Payment: customer pays upfront, courier paid on completion

## External APIs (The Services We Actually Use)

### Google Maps (`src/lib/maps.ts`)
- **Geocoding**: Address → coordinates (duh)
- **Routes**: Calculate distance between points
- **Places**: Autocomplete addresses (so users don't typo "Prag" instead of "Prague")

### Stripe (`src/lib/payments.ts`)
- **Stripe Checkout**: Customer pays
- **Stripe Connect**: Courier gets their 70%
- **Split happens automatically** on delivery completion

### Notifications (`src/lib/notifications.ts`)
- **Twilio**: SMS ("Your courier is 5 minutes away!")
- **SendGrid**: Emails (receipts, confirmations)

### LibreTranslate (`src/lib/i18n.ts`)
- Translates everything into Czech, Ukrainian, Vietnamese, Turkish, etc.
- Self-hosted, open-source, free (unlike Google Translate)

## Multi-Language Magic

Each language gets its own:
- **Route**: `/cs`, `/en`, `/uk`, `/vi`, `/tr`
- **Translations**: `messages/cs.json`, `messages/en.json`, etc.
- **Cultural theme**: Czech = blue/white, Turkish = warm reds, etc.
- **Currency**: CZK, EUR, USD, UAH, TRY (auto-detected)

When adding translations:
1. Add key to ALL language files (don't be lazy)
2. Use the cultural appropriate style (formal in German, casual in English)
3. Test with real native speakers if possible

## Mobile-First (AKA The Important Part)

95% of users will be on phones. Design for thumb reach.

**Touch targets**: Minimum 44px × 44px (Apple says so, who are we to argue?)
**Navigation**: Bottom of screen, not top
**Forms**: Auto-zoom disabled, large inputs
**Loading**: Must feel instant (< 300ms perceived)

Test on:
- Chrome Android
- Safari iOS
- Different screen sizes (iPhone SE to Samsung Galaxy S23)

## Security (Don't Screw This Up)

- **Customer data**: Encrypted at rest, minimal collection
- **Courier verification**: ID check, background check
- **Payments**: Handled by Stripe (don't store card numbers)
- **Rate limiting**: 100 requests/minute per IP
- **Input validation**: Zod schemas for everything

## What NOT to Do

1. **Don't** add "features" nobody asked for
2. **Don't** over-engineer (KISS principle: Keep It Simple, Stupid)
3. **Don't** use corporate jargon in comments
4. **Don't** mess with the 70/30 split
5. **Don't** forget mobile testing
6. **Don't** break the multi-language stuff

## Debugging Tips

### "The map won't load!"
- Check `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env`
- Open browser console, look for API errors
- Make sure billing is enabled on Google Cloud

### "Translations are broken!"
- Check `messages/[locale].json` files exist
- Verify `next-intl` middleware is configured
- Restart dev server (seriously, just restart it)

### "Payment failed!"
- Check Stripe webhook endpoint is live
- Verify `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`
- Check Stripe dashboard for error logs

### "SMS not sending!"
- Check Twilio credentials in `.env`
- Verify phone number format (+420123456789, not 123-456-789)
- Check Twilio console for error messages

## Key Files to Know

- `src/lib/pricing.ts` - The money calculator (70/30 split)
- `src/app/delivery/page.tsx` - Customer delivery form (no registration)
- `src/app/courier/dashboard/page.tsx` - Courier job board
- `prisma/schema.prisma` - Database structure
- `messages/*.json` - All translations
- `.env` - API keys (don't commit this, obviously)

## The Golden Rule

> "If I were smarter, I'd have written it shorter."

Keep code simple. Keep comments conversational. Keep features minimal. We're moving packages, not launching satellites.

---

**Questions?** Read the code. It's pretty self-explanatory. And if it's not, that's a bug in the comments, not in you.

**Need help?** Check the plan: `COURIER_CONNECT_PLAN.md`

**Ready to code?** Good. Stop reading and start building. 🚚
