# CollabConnect - Quick Reference Card

## 🚀 First Time Setup (Do Once)

```bash
# 1. Install everything
npm install

# 2. Copy environment file
copy .env.example .env

# 3. Edit .env and add:
#    - DATABASE_URL (your PostgreSQL URL)
#    - NEXTAUTH_SECRET (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
#    - AUTH_SECRET (same as NEXTAUTH_SECRET)

# 4. Generate Prisma client
npx prisma generate

# 5. Create database tables
npx prisma db push

# 6. Run the app
npm run dev

# 7. Visit http://localhost:3000
```

## 📝 Daily Development Commands

```bash
# Start development server
npm run dev

# View database in browser
npx prisma studio

# Regenerate Prisma client (after schema changes)
npx prisma generate

# Push schema changes to database
npx prisma db push

# Build for production
npm run build

# Start production server
npm start
```

## 🗄️ Database Quick Reference

```bash
# View all data in browser UI
npx prisma studio

# Reset database (⚠️ deletes all data!)
npx prisma db push --force-reset

# Create a migration
npx prisma migrate dev --name your_migration_name

# See database schema
type prisma\schema.prisma
```

## 🔧 Troubleshooting

```bash
# Prisma client errors?
npx prisma generate

# Database connection errors?
# Check your DATABASE_URL in .env

# Module not found errors?
npm install

# Auth not working?
# Make sure NEXTAUTH_SECRET and AUTH_SECRET are set in .env

# Windows bcrypt errors?
npm rebuild bcrypt --build-from-source
```

## 📂 Important Files

```
.env                          # Your secret environment variables (create from .env.example)
.env.example                  # Template for environment variables
prisma/schema.prisma          # Database structure
src/lib/auth.ts              # Authentication configuration
src/lib/prisma.ts            # Database client
src/app/page.tsx             # Landing page
src/app/dashboard/page.tsx   # User dashboard
src/app/auth/signin/page.tsx # Login page
src/app/auth/signup/page.tsx # Registration page
```

## 🎯 Current Feature Status

✅ = Working  
⏳ = In Progress  
📝 = Not Started

- ✅ Authentication (email/password + Google OAuth)
- ✅ Sign in/Sign up pages
- ✅ Dashboard with stats
- ✅ Database schema (all tables created)
- ✅ Landing page
- ✅ User profiles (basic)
- ⏳ Package installation
- 📝 Profile editing
- 📝 Interactive map
- 📝 Group creation
- 📝 Messaging
- 📝 User discovery/matching
- 📝 Multi-language support
- 📝 Property listings

## 🌐 URLs (when running locally)

```
http://localhost:3000          # Landing page
http://localhost:3000/auth/signin    # Sign in
http://localhost:3000/auth/signup    # Sign up
http://localhost:3000/dashboard      # Dashboard (requires login)
http://localhost:3000/profile        # Profile (coming soon)
http://localhost:3000/map            # Map (coming soon)
http://localhost:3000/groups         # Groups (coming soon)
```

## 🔐 Environment Variables You Need

**Required (minimum to run)**:
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/collab_connect"
NEXTAUTH_SECRET="your-32-character-random-string"
AUTH_SECRET="same-as-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

**Optional (for extra features)**:
```env
GOOGLE_CLIENT_ID="your-google-oauth-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-secret"
NEXT_PUBLIC_MAPBOX_TOKEN="your-mapbox-token"
```

## 📚 Documentation Files

- `README.md` - Full project vision and overview
- `SETUP.md` - Detailed setup instructions
- `PROGRESS.md` - Development progress tracker
- `SUMMARY.md` - What we've built and why
- `REFERENCE.md` - This file (quick commands)

## 💡 Quick Tips

1. **Database URL Format**: `postgresql://username:password@host:port/database`
2. **Generate Secret**: Run `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
3. **Free Database**: Use Supabase or Neon for free PostgreSQL hosting
4. **View Logs**: Check the terminal where you ran `npm run dev`
5. **Clear Cache**: Delete `.next` folder if you see weird errors

## 🎨 Tech Stack at a Glance

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth v5 (Auth.js)
- **Maps**: MapLibre GL (ready for API key)
- **i18n**: next-intl (installed, needs configuration)
- **State**: Zustand (installed, ready to use)

## 🐛 Common Errors & Solutions

| Error | Solution |
|-------|----------|
| `Module not found: '@prisma/client'` | Run `npm install @prisma/client && npx prisma generate` |
| `Module not found: 'next-auth'` | Run `npm install next-auth@beta @auth/prisma-adapter` |
| `Can't reach database server` | Check DATABASE_URL in .env, ensure PostgreSQL is running |
| `Invalid token` | Set NEXTAUTH_SECRET in .env |
| `Session not working` | Make sure SessionProvider is in layout.tsx |

## 🚀 Getting Help

1. Check the error message carefully
2. Look at `SETUP.md` for detailed instructions
3. Check `PROGRESS.md` to see what's implemented
4. Read `SUMMARY.md` for the big picture
5. Check the terminal where you ran `npm run dev` for detailed logs

---

**Remember**: This platform is about transparency and collaboration. Every profile shows when it was created. Every collaboration is tracked. That's how we build trust.

**Let's organize. Let's collaborate. Let's win.**
