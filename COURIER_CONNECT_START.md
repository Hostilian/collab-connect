# 🚚 COURIER CONNECT - TRANSFORMATION COMPLETE GUIDE

## 📋 Current Status: **Phase 1 Complete → Starting Phase 2**

✅ **COMPLETED:**
1. Created `.github/copilot-instructions.md` (Norm Macdonald style guidelines)
2. Created `COURIER_CONNECT_PLAN.md` (comprehensive technical plan)
3. Updated `package.json` to "courier-connect" v2.0.0
4. Committed initial transformation to Git

🔄 **IN PROGRESS:**
- Transforming homepage from CollabConnect to Courier Connect
- Setting up multi-language system
- Building customer delivery form

⚪ **NEXT UP:**
- Install next-intl for multi-language
- Create translation files (Czech, English, Ukrainian, Vietnamese, Turkish)
- Integrate Google Maps API
- Build pricing algorithm

---

## 🎯 What We're Building

**Courier Connect** = Uber for packages, but simpler

### Customer Experience (NO REGISTRATION):
```
1. Open hostilian.org
2. Pick language (🇨🇿🇬🇧🇺🇦🇻🇳🇹🇷)
3. Enter: Where to pick up? Where to deliver?
4. Choose: When? (today, tomorrow, next week)
5. Select: What? (envelope, package, fragile item)
6. See price instantly
7. Pay
8. Track courier in real-time
9. Done!
```

### Courier Experience (REGISTRATION REQUIRED):
```
1. Register & verify identity
2. Open courier dashboard
3. See jobs on map in your area
4. Tap to accept job
5. Navigate to pickup
6. Pick up item
7. Navigate to delivery
8. Complete delivery
9. Get 70% of payment instantly
10. Done!
```

---

## 💰 The Money Formula (70/30 Split)

```typescript
// Pricing is simple. Distance + urgency + item size = price.
// Courier always gets 70%. Platform keeps 30%.

Price = (Distance × BaseRate) × TimeMultiplier × ItemMultiplier

Where:
- BaseRate = 20 CZK/km (or local currency)
- TimeMultiplier:
  • Express (< 2 hours) = 2.0x
  • Same day (< 24 hours) = 1.5x
  • Next day (< 48 hours) = 1.2x
  • Scheduled (> 48 hours) = 1.0x
- ItemMultiplier:
  • Envelope = 1.0x
  • Small package = 1.2x
  • Medium package = 1.5x
  • Large package = 2.0x
  • Fragile = 1.8x

Split:
- Courier gets: 70% of total price
- Platform keeps: 30% of total price
```

**Example:**
- 10km delivery in Prague, same day, large package
- Price = (10 × 20) × 1.5 × 2.0 = 600 CZK
- Courier gets: 420 CZK
- Platform fee: 180 CZK

---

## 🌍 Multi-Language Magic

### Core Languages (Phase 2):
1. 🇨🇿 **Czech** (Čeština) - Blue/white theme, formal, CZK
2. 🇬🇧 **English** - Professional, USD/EUR
3. 🇺🇦 **Ukrainian** (Українська) - Blue/yellow theme, UAH
4. 🇻🇳 **Vietnamese** (Tiếng Việt) - Vibrant colors, VND
5. 🇹🇷 **Turkish** (Türkçe) - Warm reds, TRY

### Later (Phase 4):
- 🇩🇪 German, 🇫🇷 French, 🇪🇸 Spanish, 🇵🇱 Polish, 🇮🇹 Italian
- + 150+ more Steam-recognized countries

### Cultural Customization:
Each language gets its own:
- Color scheme (Czech = blue/white, Turkish = warm tones)
- Font style
- Currency (CZK, EUR, USD, UAH, TRY)
- Date format (DD/MM vs MM/DD)
- Distance units (km vs miles)
- Cultural imagery

---

## 🛠️ Tech Stack

### Frontend:
- **Next.js 15** (App Router, Turbopack)
- **React 19** (latest)
- **TypeScript** (strict mode)
- **Tailwind CSS** (mobile-first)
- **next-intl** (multi-language)
- **React Hook Form** (forms)
- **Zod** (validation)

### Maps:
- **Google Maps Platform**:
  - Maps JavaScript API (display map)
  - Geocoding API (address → coordinates)
  - Routes API (calculate distance)
  - Places API (address autocomplete)

### Payments:
- **Stripe** + **Stripe Connect** (70/30 split)

### Notifications:
- **Twilio** (SMS)
- **SendGrid** (Email)

### Database:
- **PostgreSQL** (Vercel Postgres)
- **Prisma ORM**

### Real-Time:
- **Pusher** or **Socket.io** (live tracking)

### Deployment:
- **Vercel** (auto-deploy from GitHub)
- **GitHub Actions** (CI/CD)
- **Sentry** (error tracking)

---

## 📝 Code Style: Norm Macdonald Rules

### ❌ Don't Write Like This:
```typescript
// Process delivery request
async function processDeliveryRequest(data: DeliveryDTO): Promise<DeliveryResponse> {
  const validation = await validateInput(data);
  if (!validation.success) throw new ValidationError();
  return createDelivery(validation.data);
}
```

### ✅ Write Like This:
```typescript
// Look, either the customer gave us a real address or they didn't. Let's find out.
async function processDeliveryRequest(data: DeliveryDTO): Promise<DeliveryResponse> {
  // First, check if this is actually an address and not just gibberish
  const validation = await validateInput(data);
  
  if (!validation.success) {
    // Turns out it was gibberish. Who knew?
    throw new ValidationError();
  }
  
  // Well, would you look at that. It's legit.
  return createDelivery(validation.data);
}
```

**Rules:**
1. Short sentences. Like you're talking.
2. Self-deprecating. We're not curing cancer.
3. Conversational words: "Look," "Well," "Turns out"
4. No jargon. Say "payment" not "transaction processor"
5. "If I were smarter, I'd have written it shorter"

---

## 📱 Mobile-First Design

### Why Mobile First?
95% of users will be on phones. Thumb-friendly or die.

### Design Rules:
- **Touch targets**: Minimum 44px × 44px (Apple standard)
- **Navigation**: Bottom of screen (thumb reach)
- **Forms**: Large inputs, no zoom, autocomplete
- **Loading**: Must feel instant (< 300ms perceived)
- **Buttons**: Big, obvious, one action per screen

### Test On:
- Chrome Android
- Safari iOS
- iPhone SE (smallest)
- Samsung Galaxy S23 (largest)

---

## 🗂️ File Structure

```
courier-connect/
├── .github/
│   └── copilot-instructions.md          # Norm Macdonald coding rules
├── src/
│   ├── app/
│   │   ├── [locale]/                    # /cs, /en, /uk, /vi, /tr
│   │   │   ├── page.tsx                 # Homepage (language-specific)
│   │   │   └── delivery/
│   │   │       └── page.tsx             # Delivery form (no auth)
│   │   ├── courier/
│   │   │   ├── signup/page.tsx          # Courier registration
│   │   │   └── dashboard/page.tsx       # Courier job board
│   │   └── api/
│   │       ├── deliveries/              # Delivery endpoints
│   │       ├── payments/                # Stripe webhooks
│   │       └── notifications/           # Twilio, SendGrid
│   ├── components/
│   │   ├── delivery/
│   │   │   ├── DeliveryForm.tsx         # Main delivery form
│   │   │   ├── AddressInput.tsx         # Google Maps autocomplete
│   │   │   └── PriceDisplay.tsx         # Show price breakdown
│   │   ├── map/
│   │   │   ├── MapView.tsx              # Google Maps display
│   │   │   └── RouteVisualization.tsx   # Show route on map
│   │   └── ui/                          # Buttons, inputs, etc.
│   └── lib/
│       ├── pricing.ts                   # 70/30 calculator
│       ├── maps.ts                      # Google Maps wrapper
│       ├── payments.ts                  # Stripe integration
│       ├── notifications.ts             # Twilio + SendGrid
│       └── validation.ts                # Zod schemas
├── messages/
│   ├── cs.json                          # Czech translations
│   ├── en.json                          # English translations
│   ├── uk.json                          # Ukrainian translations
│   ├── vi.json                          # Vietnamese translations
│   └── tr.json                          # Turkish translations
├── prisma/
│   └── schema.prisma                    # Courier, Delivery models
├── COURIER_CONNECT_PLAN.md              # Full technical plan
└── START_HERE.md                        # This file! 👋
```

---

## 🔑 Required API Keys

### Get These Now (Phase 2):
1. **Google Maps Platform**: https://console.cloud.google.com
   - Enable: Maps JavaScript API, Geocoding API, Routes API, Places API
   - $200/month free credit (enough for 28,000 map loads)

2. **LibreTranslate**: https://libretranslate.com
   - Self-hosted, open-source, FREE
   - Or use hosted version ($free tier)

### Get These Soon (Phase 3-4):
3. **Stripe**: https://dashboard.stripe.com
   - Payment processing (2.9% + 30¢ per transaction)
   - Stripe Connect for courier payouts

4. **Twilio**: https://www.twilio.com/console
   - SMS notifications ($15/month for 1,000 SMS)

5. **SendGrid**: https://app.sendgrid.com
   - Email notifications (100/day FREE)

6. **Pusher**: https://dashboard.pusher.com
   - Real-time tracking (100 connections FREE)

---

## 🚀 Next Steps (Do These In Order)

### Step 1: Install Dependencies
```bash
npm install next-intl
npm install @react-google-maps/api
npm install stripe
npm install twilio
npm install @sendgrid/mail
npm install pusher pusher-js
```

### Step 2: Set Up Environment Variables
Create `.env.local`:
```env
# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here

# Database
DATABASE_URL=postgresql://...

# Stripe (later)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Twilio (later)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890

# SendGrid (later)
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=noreply@hostilian.org

# Pusher (later)
NEXT_PUBLIC_PUSHER_APP_KEY=...
PUSHER_APP_ID=...
PUSHER_SECRET=...
PUSHER_CLUSTER=eu
```

### Step 3: Create Multi-Language Structure
```bash
# Create translation files
mkdir messages
touch messages/cs.json messages/en.json messages/uk.json messages/vi.json messages/tr.json
```

### Step 4: Update Database Schema
Edit `prisma/schema.prisma` to add Courier Connect models

### Step 5: Start Building
```bash
npm run dev
# Visit http://localhost:3000
```

---

## 🎯 20-Task Roadmap

Track progress with the TODO list:

1. ✅ **GitHub Setup** - Done!
2. 🔄 **Branding** - In progress
3. ⚪ **Multi-Language** - Next
4. ⚪ **Customer Form**
5. ⚪ **Google Maps**
6. ⚪ **Pricing Algorithm**
7. ⚪ **Courier Dashboard**
8. ⚪ **Job Board**
9. ⚪ **Stripe Payments**
10. ⚪ **Notifications**
11. ⚪ **Database Schema**
12. ⚪ **Norm Style Rewrite**
13. ⚪ **Mobile Polish**
14. ⚪ **Location Selection**
15. ⚪ **Cultural Themes**
16. ⚪ **Real-Time Tracking**
17. ⚪ **Performance**
18. ⚪ **Testing**
19. ⚪ **Deploy to hostilian.org**
20. ⚪ **Launch!**

---

## 💡 Core Principles

1. **Keep It Simple** - "If I were smarter, I'd have written it shorter"
2. **Mobile-First** - 95% of traffic is phones
3. **70/30 Split** - Never change this ratio
4. **No Customer Registration** - Make it as easy as possible
5. **Cultural Respect** - Full localization, not just translation
6. **Fast & Lightweight** - < 2s load time on 3G
7. **Norm Style Code** - Conversational, witty, self-explanatory

---

## 🎉 Ready to Build?

You have:
- ✅ Comprehensive plan (COURIER_CONNECT_PLAN.md)
- ✅ Coding guidelines (.github/copilot-instructions.md)
- ✅ Tech stack defined
- ✅ API list ready
- ✅ Design philosophy clear
- ✅ 20-task roadmap

**Let's make Courier Connect the simplest, best courier service on the planet!** 🚚

---

**Questions?** Read the code comments. They're written in plain English (Norm style).

**Stuck?** Check COURIER_CONNECT_PLAN.md for detailed technical specs.

**Ready?** Run `npm run dev` and start building! 🚀
