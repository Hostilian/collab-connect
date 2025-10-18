# ☑️ CollabConnect - Setup Checklist

Copy this checklist and check off items as you complete them.

---
## ✅ COMPLETED SO FAR

- ✅ Next.js project initialized
- ✅ Core dependencies installed (React, Next.js, Tailwind)
- ✅ NextAuth & Prisma packages installed
- ✅ Database schema designed (15+ tables with full transparency)
- ✅ Authentication system built (sign-up/sign-in pages)
- ✅ Landing page created with mission statement
- ✅ Dashboard page created
- ✅ 50-item master todo list created

---
## 🎯 YOU ARE HERE: Setting Up the Database

Follow QUICKSTART.md for detailed instructions!

## Pre-Setup (Prerequisites)

- [x] Node.js 20+ installed (`node --version` to check)
- [x] npm installed (`npm --version` to check)
- [x] Git installed (for version control)
- [x] Code editor ready (VS Code recommended)
- [ ] PostgreSQL access (local or cloud) ⬅️ DO THIS NEXT!

## Step 1: Project Setup

- [ ] Navigate to project folder: `cd c:\Users\Hostilian\collab-connect`
- [ ] Check if node_modules exists
- [ ] If not, run: `npm install`
- [ ] Wait for installation to complete (may take a few minutes)

## Step 2: Database Setup

Choose ONE option:

### Option A: Local PostgreSQL
- [ ] PostgreSQL installed and running
- [ ] Create database: `createdb collab_connect`
- [ ] Copy connection string for .env

### Option B: Supabase (Recommended for beginners)
- [ ] Go to https://supabase.com
- [ ] Create free account
- [ ] Create new project
- [ ] Go to Settings > Database
- [ ] Copy connection string (Connection Pooling, Session mode)
- [ ] Save connection string for next step

### Option C: Neon
- [ ] Go to https://neon.tech
- [ ] Create free account
- [ ] Create new project
- [ ] Copy connection string
- [ ] Save connection string for next step

## Step 3: Environment Variables

- [ ] Copy example file: `copy .env.example .env`
- [ ] Open `.env` in your editor
- [ ] Set `DATABASE_URL` to your PostgreSQL connection string
- [ ] Generate secret: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- [ ] Set `NEXTAUTH_SECRET` to the generated string
- [ ] Set `AUTH_SECRET` to the same value as NEXTAUTH_SECRET
- [ ] Verify `NEXTAUTH_URL` is set to `http://localhost:3000`
- [ ] Save the `.env` file

## Step 4: Prisma Setup

- [ ] Run: `npx prisma generate`
- [ ] Wait for Prisma client to generate
- [ ] Run: `npx prisma db push`
- [ ] Confirm with `y` if prompted
- [ ] Wait for tables to be created
- [ ] Success message should appear

## Step 5: First Run

- [ ] Run: `npm run dev`
- [ ] Wait for "Ready" message
- [ ] Open browser to http://localhost:3000
- [ ] Landing page should load
- [ ] Click "Join the Movement" button
- [ ] Sign up page should load

## Step 6: Test Authentication

- [ ] Fill out sign up form:
  - [ ] Name: (your name)
  - [ ] Email: (your email)
  - [ ] Password: (8+ characters)
  - [ ] Confirm password
- [ ] Click "Create account"
- [ ] Should redirect to dashboard
- [ ] Dashboard should show:
  - [ ] Welcome message with your name
  - [ ] Stats showing 0 collaborations
  - [ ] Verification status "Pending"
  - [ ] Quick action cards
  - [ ] Profile creation date

## Step 7: Verify Database

- [ ] Open new terminal (keep dev server running)
- [ ] Run: `npx prisma studio`
- [ ] Browser should open with Prisma Studio
- [ ] Click on "User" table
- [ ] Your user should be listed
- [ ] Click on "Profile" table
- [ ] Your profile should be listed
- [ ] Check the timestamps (createdAt)

## Step 8: Test Sign Out & Sign In

- [ ] In the app, click "Sign Out" button
- [ ] Should redirect to landing page
- [ ] Click "Sign In"
- [ ] Enter your email and password
- [ ] Click "Sign in"
- [ ] Should redirect back to dashboard
- [ ] lastLoginAt should update in database

## Optional: Google OAuth Setup

- [ ] Go to https://console.cloud.google.com
- [ ] Create new project
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 credentials
- [ ] Add redirect URI: `http://localhost:3000/api/auth/callback/google`
- [ ] Copy Client ID to .env as `GOOGLE_CLIENT_ID`
- [ ] Copy Client Secret to .env as `GOOGLE_CLIENT_SECRET`
- [ ] Restart dev server (`Ctrl+C`, then `npm run dev`)
- [ ] Try "Sign in with Google" button
- [ ] Should redirect to Google login
- [ ] After login, should create account and redirect to dashboard

## Optional: Map Setup

- [ ] Go to https://mapbox.com (or https://maptiler.com)
- [ ] Create free account
- [ ] Get API token
- [ ] Add to .env as `NEXT_PUBLIC_MAPBOX_TOKEN` (or `NEXT_PUBLIC_MAPTILER_KEY`)
- [ ] Restart dev server
- [ ] Map features will work when implemented

## Troubleshooting Checklist

If something doesn't work:

- [ ] Check terminal for error messages
- [ ] Verify DATABASE_URL is correct in .env
- [ ] Verify NEXTAUTH_SECRET is set in .env
- [ ] Try `npm install` again
- [ ] Try `npx prisma generate` again
- [ ] Try deleting node_modules and reinstalling
- [ ] Try deleting .next folder
- [ ] Check REFERENCE.md for common errors
- [ ] Check browser console for errors (F12)

## Success Criteria

You know it's working when:

- ✅ Landing page loads without errors
- ✅ Can create an account
- ✅ Dashboard loads after signup
- ✅ Can see your user in Prisma Studio
- ✅ Can sign out and sign back in
- ✅ No TypeScript errors in terminal
- ✅ No console errors in browser

## Next Steps After Setup

Once everything is working:

- [ ] Read SUMMARY.md to understand what's built
- [ ] Read PROGRESS.md to see what's next
- [ ] Check out the code in src/app
- [ ] Look at the database schema in prisma/schema.prisma
- [ ] Try customizing the landing page
- [ ] Start building the profile editing page
- [ ] Plan the map component
- [ ] Think about the matching algorithm

## Quick Commands Reference

```bash
# Start dev server
npm run dev

# View database
npx prisma studio

# Regenerate Prisma after schema changes
npx prisma generate && npx prisma db push

# Restart everything fresh
# 1. Stop dev server (Ctrl+C)
# 2. Delete .next folder
# 3. Run: npm run dev
```

## Status Check

Mark your current status:

- [ ] ✅ Setup complete, everything working
- [ ] ⏳ Setup in progress, almost there
- [ ] ❌ Stuck on a step (check troubleshooting)

---

**Once you've checked all the boxes above, you're ready to start building features!**

**Next file to read**: PROGRESS.md to see the development roadmap.

**Remember**: This is a platform about transparency and organizing. What we're building matters. Take your time and do it right.
