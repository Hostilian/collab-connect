# 🚀 CollabConnect - Quick Start Guide

## What This Is

A platform to help people collaborate against big institutions:
- 🏥 Fight insurance companies together
- 🏡 Pool resources to buy homes
- 🤝 Find trusted allies on an interactive map
- 💪 Organize collective action

## Current Status: Foundation Complete (~20%)

### ✅ What Works Right Now

1. **Interactive Map** at http://localhost:3001/map
   - Beautiful MapTiler streets tiles
   - Click markers to see user details
   - Verification status colors (green/yellow/grey)
   - Mission overlay card
   - *Currently showing 3 placeholder users*

2. **Authentication System**
   - Sign up at `/auth/signup`
   - Sign in at `/auth/signin`
   - Protected dashboard route
   - *Note: Waiting for database connection*

3. **Landing Page** at http://localhost:3001
   - Explains the mission
   - Links to map and sign up
   - Beautiful gradient design

4. **Dashboard** at `/dashboard`
   - Welcome message
   - Navigation to all features
   - *Will show real stats once DB connected*

### 🔴 Main Blocker: Database Not Connected

The app works, but data isn't persisted because PostgreSQL needs to be set up.

## How to Get Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```
Opens at http://localhost:3001 (or 3000)

### 3. View the Map
Navigate to http://localhost:3001/map

You'll see:
- Interactive world map
- 3 placeholder users (NYC, LA, Chicago)
- Click markers for details
- Try the controls!

### 4. Set Up Database (Next Step)

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL from postgresql.org
# Create database
createdb collab_connect

# Update .env
DATABASE_URL="postgresql://username:password@localhost:5432/collab_connect"

# Run migrations
npx prisma db push
npx prisma generate
```

#### Option B: Docker PostgreSQL
```bash
# Start PostgreSQL container
docker run --name collab-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=collab_connect \
  -p 5432:5432 \
  -d postgres

# Update .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/collab_connect"

# Run migrations
npx prisma db push
npx prisma generate
```

### 5. Verify Database
```bash
# Open Prisma Studio to view tables
npx prisma studio
```
Opens at http://localhost:5555

### 6. Seed Test Users (Manual)
Use Prisma Studio to create users with:
- Name, email, password
- Profile with bio
- **Important**: Add latitude and longitude for map display

Example coordinates:
- NYC: lat 40.7128, lng -74.0060
- LA: lat 34.0522, lng -118.2437
- Chicago: lat 41.8781, lng -87.6298

### 7. Test the Map with Real Data
- Restart dev server
- Navigate to `/map`
- Should now show real users from database!

## File Structure (Important Ones)

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── map/page.tsx                # Map view
│   ├── dashboard/page.tsx          # User dashboard
│   ├── api/map/users/route.ts      # Map data API
│   └── auth/
│       ├── signin/page.tsx         # Sign in
│       └── signup/page.tsx         # Sign up
├── components/
│   └── map/
│       └── InteractiveMap.tsx      # Map component
└── lib/
    ├── auth.ts                     # NextAuth config
    └── prisma.ts                   # Database client

prisma/
└── schema.prisma                   # Database schema

.env                                # Environment variables (don't commit!)
.env.example                        # Example env file (safe to commit)
```

## Environment Variables

Current `.env` file has:
```env
# Database (UPDATE THIS)
DATABASE_URL="postgresql://username:password@localhost:5432/collab_connect"

# Auth (Already set)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[generated]"

# Map (Already set)
NEXT_PUBLIC_MAPTILER_KEY="qHemRvjMeCCEsqBofN3u"

# Optional OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

## Key Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Run production build

# Database
npx prisma studio        # Visual database editor
npx prisma db push       # Apply schema changes
npx prisma generate      # Generate Prisma Client
npx prisma db seed       # Run seed script (when created)

# Git
git status               # Check changes
git add .                # Stage all files
git commit -m "message"  # Commit changes
git push                 # Push to GitHub
```

## Common Issues

### "Port 3000 is in use"
Server automatically uses 3001. Check terminal for actual port.

### "Cannot connect to database"
Make sure PostgreSQL is running and DATABASE_URL is correct.

### "Map doesn't load"
Check that `NEXT_PUBLIC_MAPTILER_KEY` is in `.env` file.

### "No users on map"
Database isn't connected or no users have lat/long coordinates.

## Next Steps After Database Setup

1. ✅ Test authentication (create account, sign in/out)
2. ✅ Add test users with coordinates
3. ✅ Verify map shows real data
4. 📧 Build email verification system
5. 🔍 Add map search and filters
6. 👥 Implement marker clustering
7. 📊 Create transparency dashboard
8. 💬 Build messaging system
9. 🏘️ Add property listings
10. 🚀 Continue with 250+ remaining tasks!

## Documentation

- **README.md** - Project vision and overview
- **TODO_MASTER.md** - Complete task list (250+ items)
- **DEVELOPMENT_STATUS.md** - Current progress report
- **SESSION_SUMMARY.md** - Today's accomplishments
- **QUICKSTART.md** - Detailed setup guide
- **SETUP.md** - Step-by-step instructions
- **CHECKLIST.md** - Verification checklist

## The Mission

This isn't just another app. This is about fighting back:

- **Insurance companies** deny claims and expect you to give up alone
- **Real estate monopolies** exploit isolated buyers
- **Big institutions** thrive when people can't organize

This platform changes that. Beautiful maps show:
- ✅ Who's verified and trustworthy
- ✅ Where people are organizing
- ✅ How to collaborate on any challenge
- ✅ Transparent history of every account

**"The powerful don't want you to organize. So let's organize."**

## Getting Help

- Check `REFERENCE.md` for common errors
- Read `PROGRESS.md` for feature status
- View `ACTION_PLAN.md` for roadmap
- See `TODO_MASTER.md` for complete backlog

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth v5
- **Maps**: MapLibre GL + MapTiler
- **Deployment**: Vercel (when ready)

## Current Statistics

- **Files**: 50+ source files
- **Lines of Code**: ~3,500+
- **Components**: 15+
- **API Routes**: 3
- **Database Tables**: 10
- **Features Complete**: ~20%
- **Tasks Remaining**: 250+

## Success Criteria

You know it's working when:
- ✅ Landing page loads without errors
- ✅ Map displays with tiles and markers
- ✅ Can click markers to see popups
- ✅ Map controls work (zoom, pan, fullscreen)
- ⏳ Can create an account (needs DB)
- ⏳ Can sign in and see dashboard (needs DB)
- ⏳ Map shows real users (needs DB + seed data)

## Support the Mission

This is open source and free forever. If you believe in the mission:
- ⭐ Star the repo on GitHub
- 🐛 Report bugs and issues
- 💡 Suggest features
- 🤝 Contribute code
- 📣 Spread the word

Together, we build power.

---

**Built with transparency and hope. Licensed under MIT.**
