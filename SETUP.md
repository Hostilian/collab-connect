# Quick Setup Guide for CollabConnect

## Prerequisites

1. **Node.js 20+** installed
2. **PostgreSQL** installed and running
3. **Git** installed

## Step 1: Database Setup

### Option A: Local PostgreSQL

```bash
# Create database
createdb collab_connect

# Update .env with connection string
DATABASE_URL="postgresql://username:password@localhost:5432/collab_connect?schema=public"
```

### Option B: Cloud Database (Recommended for quick start)

**Supabase** (Free tier available):
1. Go to https://supabase.com
2. Create new project
3. Copy database URL from Settings > Database
4. Paste into .env

**Neon** (Also free tier):
1. Go to https://neon.tech
2. Create new project
3. Copy connection string
4. Paste into .env

## Step 2: Environment Variables

```bash
# Copy example file
copy .env.example .env

# Edit .env and add these REQUIRED values:
DATABASE_URL="your-postgresql-url-here"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
AUTH_SECRET="same-as-nextauth-secret"
```

To generate NEXTAUTH_SECRET on Windows:
```bash
# Option 1: OpenSSL (if installed)
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Use any 32+ character random string
```

## Step 3: Optional OAuth Setup

### Google OAuth (for "Sign in with Google")

1. Go to https://console.cloud.google.com
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to .env:

```env
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

## Step 4: Install & Run

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Push database schema (creates all tables)
npx prisma db push

# Run development server
npm run dev
```

Visit: http://localhost:3000

## Step 5: Test It Out!

1. **Sign Up**: Go to http://localhost:3000/auth/signup
2. **Create Account**: Use any email/password
3. **Dashboard**: You'll be redirected to /dashboard
4. **Check Database**: Run `npx prisma studio` to see your data

## Troubleshooting

### "Can't reach database server"
- Make sure PostgreSQL is running
- Check DATABASE_URL is correct
- Try connecting with a database client first

### "Module not found: next-auth"
```bash
npm install next-auth@beta @auth/prisma-adapter
```

### "Prisma Client not found"
```bash
npx prisma generate
```

### "bcrypt error on Windows"
```bash
npm rebuild bcrypt --build-from-source
```

## Next Steps After Setup

1. **Complete Your Profile**: Go to /profile/edit (coming soon)
2. **Explore Map**: Go to /map (needs map API key)
3. **Create a Group**: Go to /groups/create (coming soon)
4. **Invite Friends**: Share the platform!

## Database Commands

```bash
# View database in browser
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset

# Create migration (for production)
npx prisma migrate dev --name init
```

## Development Commands

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Map API Setup (Optional - for later)

The map feature is ready but needs an API key:

**Mapbox** (recommended):
1. Sign up at https://mapbox.com
2. Get free API token
3. Add to .env:
```env
NEXT_PUBLIC_MAPBOX_TOKEN="your-token-here"
```

**Maptiler** (alternative):
1. Sign up at https://maptiler.com
2. Get free API key
3. Add to .env:
```env
NEXT_PUBLIC_MAPTILER_KEY="your-key-here"
```

## Need Help?

- Check PROGRESS.md for what's built
- Check README.md for project vision
- Check prisma/schema.prisma for database structure

---

**Remember**: This platform is about transparency. When you create your profile, that timestamp is visible to everyone. That's by design. That's how we build trust.
