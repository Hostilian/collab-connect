# 🌍 CollabConnect - The People's Platform

> "Because the system's rigged, but we're not out of the game yet."

## What Is This?

A collaboration platform that actually gives a damn. We're building a tool to help people:

1. **Fight back against predatory insurance companies** - collective action works
2. **Pool resources to bid on housing together** - because the market is broken
3. **Find real allies across languages and cultures** - transparency first, always
4. **See who's verified and who's not** - trust through transparency

---

## 🎯 Core Philosophy

### 1. **Transparency Is Everything**
- See when profiles were created
- See verification status (verified/pending/unverified)
- See collaboration history
- No hidden algorithms, no dark patterns

### 2. **Connect People First**
- By hobbies and interests
- By location (interactive maps)
- By causes (insurance fights, housing bids)
- Across all languages (built-in translation)

### 3. **The Platform Is a Tool, Not a Master**
- Open source approach
- User data belongs to users
- Clear GDPR compliance
- Export your data anytime

---

## 🗺️ Phase 1: The Map (CURRENT)

An interactive, Apple Maps-style interface showing:

- **Verified users** (green pulse) - verified email, phone, or ID
- **Pending verification** (amber pulse) - account created, verification in progress
- **Clusters** - groups of users in the same area
- **Collaboration heatmap** - see where people are organizing

### Tech Stack (Map)
- **MapLibre GL** - Open source mapping
- **OpenStreetMap** - Free, community-driven map data
- **Nominatim API** - Free geocoding (address ↔ coordinates)
- **Supercluster** - Efficient marker clustering

---

## 🔗 API Integrations

### Location & Mapping
| API | Purpose | Status |
|-----|---------|--------|
| **Nominatim** (OSM) | Address → Coordinates | ✅ Integrated |
| **ipapi.co** | IP-based location detection | ✅ Integrated |
| **Overpass API** | Building/property data | ✅ Integrated |
| **LocationIQ** | Enhanced geocoding | 🔄 Planned |

### Translation & Localization
| API | Purpose | Status |
|-----|---------|--------|
| **LibreTranslate** | Free, open-source translation | ✅ Integrated |
| **MyMemory API** | Backup translation | 🔄 Planned |

### Identity & Verification
| API | Purpose | Status |
|-----|---------|--------|
| **Gravatar** | Profile pictures by email | ✅ Integrated |
| **Auth0/Firebase** | Authentication & verification | ✅ NextAuth |
| **Email verification** | Built-in system | ✅ Complete |

### Transparency & Data
| API | Purpose | Status |
|-----|---------|--------|
| **OpenCorporates** | Company lookup & transparency | ✅ Integrated |
| **Open Data Portal (EU)** | Government transparency data | 🔄 Planned |

### Real Estate & Housing
| API | Purpose | Status |
|-----|---------|--------|
| **OpenStreetMap Buildings** | Property location data | ✅ Integrated |
| **Land Registry (UK)** | Property sales history | 🔄 Planned |
| **Zillow API** | US listings (RapidAPI) | 🔄 Planned |

### Utilities
| API | Purpose | Status |
|-----|---------|--------|
| **IPify** | Public IP detection | ✅ Integrated |
| **QR Code Generator** | Profile sharing | ✅ Integrated |
| **Unsplash** | Free high-quality images | 🔄 Planned |

---

## 📋 Current Features

### ✅ Working Now
- Interactive map with real-time user locations
- User authentication (email/password, OAuth)
- Profile creation with verification badges
- Email verification system
- Collaboration tracking
- Webhook system for integrations
- Notification system
- GDPR compliance (data export, account deletion)
- Rate limiting & security headers
- Comprehensive audit logging

### 🔄 In Progress
- Real-time chat/messaging
- Group collaboration rooms
- House bidding system
- Insurance company database
- Multi-language support UI

### 🎯 Coming Soon (Phase 2)
- Real estate listing integration
- Insurance claim filing assistance
- Legal document templates
- Collective bargaining tools
- Community voting systems

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18+
PostgreSQL database
```

### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and API keys

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Email (Resend)
RESEND_API_KEY="your-resend-key"

# Sentry (optional)
SENTRY_DSN="your-sentry-dsn"

# Maps (optional - has fallback)
NEXT_PUBLIC_MAPTILER_KEY="your-maptiler-key"

# Rate Limiting (Upstash)
UPSTASH_REDIS_REST_URL="your-upstash-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"
```

---

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js 15 app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── map/          # Map data endpoints
│   │   ├── webhooks/     # Webhook management
│   │   ├── notifications/ # Notification system
│   │   └── gdpr/         # Data export/deletion
│   ├── dashboard/        # User dashboard
│   ├── map/              # Interactive map page
│   └── profile/          # Profile management
├── components/            # React components
│   ├── map/              # Map-related components
│   └── admin/            # Admin dashboard
├── lib/                   # Utilities & services
│   ├── api-integrations.ts  # External API wrappers
│   ├── auth.ts           # Authentication logic
│   ├── email.ts          # Email service
│   ├── notifications.ts  # Notification system
│   ├── webhooks.ts       # Webhook delivery
│   └── prisma.ts         # Database client
└── types/                 # TypeScript definitions

prisma/
├── schema.prisma         # Database schema
└── seed.ts               # Sample data

e2e/                       # Playwright tests
tests/                     # Integration & load tests
```

---

## 🎨 Design Principles

### The Map
- **Apple Maps aesthetic** - Clean, modern, intuitive
- **Pulsing markers** - Show life and activity
- **Clustering** - Performance at scale
- **Search & filters** - Find specific people/groups

### Profile Pages
- **Verification badge front and center**
- **Collaboration history visible**
- **Account age visible** (created date)
- **Transparent stats** - no hiding participation

### Collaboration Tools
- **Group chat with translation**
- **Document sharing**
- **Vote/decision systems**
- **Resource pooling trackers**

---

## 🔒 Security & Privacy

- ✅ HTTPS only (enforced)
- ✅ CSRF protection
- ✅ Rate limiting (per IP and per user)
- ✅ Content Security Policy headers
- ✅ XSS protection
- ✅ SQL injection prevention (Prisma ORM)
- ✅ Password hashing (bcrypt)
- ✅ Email verification required
- ✅ Optional 2FA support
- ✅ Session management
- ✅ GDPR compliance tools

---

## 🤝 How to Contribute

This is a platform FOR people, BY people. We need:

1. **Developers** - Frontend, backend, DevOps
2. **Designers** - Make it beautiful AND functional
3. **Translators** - Help us reach more people
4. **Testers** - Break things before users do
5. **Documentation writers** - Explain the magic
6. **Legal experts** - Keep us compliant and safe
7. **Community organizers** - Spread the word

### Contribution Guidelines
- Write clean, commented code
- Test your changes
- Update documentation
- Follow the existing code style
- Be kind, be transparent

---

## 📊 Roadmap

### Phase 1: Connect (CURRENT)
- [x] User authentication
- [x] Profile system with verification
- [x] Interactive map
- [x] Basic search & filters
- [ ] Multi-language UI
- [ ] Real-time chat

### Phase 2: Organize
- [ ] Group collaboration rooms
- [ ] Document sharing
- [ ] Voting/decision tools
- [ ] Event scheduling
- [ ] Resource tracking

### Phase 3: Act
- [ ] House bidding system
- [ ] Insurance claim filing
- [ ] Legal template library
- [ ] Collective bargaining tools
- [ ] Success story showcase

### Phase 4: Scale
- [ ] Mobile apps (React Native)
- [ ] Desktop app (Electron)
- [ ] Offline-first features
- [ ] Federation/decentralization
- [ ] API for third-party integrations

---

## 🎭 The Vibe

This isn't corporate software. This isn't move-fast-break-things tech bro nonsense.

This is:
- **Transparent** - You see everything we see
- **Empowering** - Tools for real people, not metrics
- **Rebellious** - Fighting systems that need fighting
- **Practical** - Beauty matters, but function matters more
- **Open** - Open source, open data, open hearts

---

## 📞 Contact & Support

- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: General questions and ideas
- **Email**: contact@collabconnect.com
- **Discord**: [Coming soon]

---

## 📜 License

MIT License - Because tools for the people should be free

---

## 🙏 Thanks

To everyone who believes that technology can be a force for good, not just profit. To everyone organizing, resisting, and building a better world.

**Let's connect. Let's fight. Let's win.**

---

*"The system isn't broken. It's working exactly as designed. Time to redesign it."*
