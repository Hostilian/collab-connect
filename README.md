# CollabConnect 🤝

**The platform that connects people to fight back against big institutions and collaborate on life's biggest challenges.**

## The Vision

You know what's crazy? Big insurance companies deny claims and people just... accept it. They're alone, they're scared, and they don't know their rights. But what if they weren't alone? What if ten people with similar denials could pool their knowledge, share lawyers, and fight back together?

And houses? Same thing. Your buddy can't afford that place, but what if five of you bought it together? Split it, flip it, whatever. The system's rigged for the wealthy, but collaboration levels the playing field.

**CollabConnect** is the platform that makes this possible.

## Core Features

### Phase 1: Connection (Current Focus)
- 🌍 **Universal Collaboration Platform** - Connect people across languages, locations, and interests
- 👤 **Profile System** - Create verified profiles with full transparency
  - See exactly when someone created their account
  - View their collaboration history
  - Know what's real and what's not - verified badges, activity logs
- 🗺️ **Beautiful Interactive Map** - Apple Maps-style interface showing:
  - Other users in your area
  - Available properties
  - Active collaboration groups
  - All pulled from trusted, verified APIs
- 🌐 **Multi-language Support** - Connect across all languages
- 🎯 **Smart Matching** - Find people by:
  - Shared hobbies and interests
  - Location proximity
  - Collaboration goals
  - Profile style preferences

### Phase 2: Collaboration Tools
- 💬 **Real-time Communication** - Chat with potential collaborators
- 👥 **Group Spaces** - Create collaboration rooms for specific goals
- 🏥 **Insurance Fight Mode** - Tools for groups fighting insurance denials
- 🏡 **House Bidding System** - Collaborative property purchasing and bidding

### Phase 3: Discovery & Automation
- 🔍 **Opportunity Finder** - Automatically find and alert:
  - Open property listings
  - Insurance cases worth fighting
  - Collaboration opportunities
- 🤖 **Smart Recommendations** - Connect users with similar goals
- 📊 **Full Transparency Dashboard** - Platform-wide metrics on success rates

## The Philosophy

**Transparency First**: You can see when a profile was created, if it's verified, and who they've worked with. No fake accounts, no hidden agendas. Just real people helping real people.

**Connection Before Commerce**: Before we help you find the perfect house to bid on, we help you find the perfect team to bid with.

**Power in Numbers**: One person vs. an insurance company? They lose. Ten people with the same problem? Now we're talking.

## Tech Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Maps**: MapLibre GL for beautiful, interactive mapping
- **Styling**: Tailwind CSS v4
- **i18n**: next-intl for multi-language support
- **State**: Zustand for client state management
- **Authentication**: (Coming soon - NextAuth.js)

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/collab-connect.git
cd collab-connect

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and API keys

# Set up the database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the platform.

## Environment Variables

See `.env.example` for required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Your app URL
- `NEXTAUTH_SECRET` - Auth secret key
- `MAPBOX_API_KEY` - For map functionality (or alternative map provider)

## Development Roadmap

- [x] Initial Next.js setup with TypeScript
- [x] Install core dependencies (maps, i18n, state management)
- [ ] Database schema design
- [ ] Authentication system
- [ ] User profiles with verification
- [ ] Interactive map interface
- [ ] User matching algorithm
- [ ] Collaboration groups
- [ ] Insurance fight tools
- [ ] House bidding system
- [ ] Property API integrations
- [ ] Opportunity finder

## Contributing

This platform is about bringing people together. If you want to contribute code, ideas, or just tell us we're crazy (we probably are), open an issue or PR.

## License

MIT - Because collaboration should be free.

---

*"The powerful don't want you to organize. So let's organize."*
