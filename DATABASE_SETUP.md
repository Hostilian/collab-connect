# 🚀 DATABASE SETUP - DO THIS NOW!

Listen, this is where the rubber meets the road. You've got beautiful code, but it's useless without a database. Let's fix that in the next 10 minutes.

## Option 1: Railway (RECOMMENDED - It's free and fast)

1. **Go to:** https://railway.app
2. **Sign up** with GitHub (literally 2 clicks)
3. **Create New Project** → **Provision PostgreSQL**
4. **Copy the connection string:**
   - Click on your PostgreSQL service
   - Go to "Connect" tab
   - Copy the "DATABASE_URL"
   - It looks like: `postgresql://postgres:password@containers.railway.app:7891/railway`

5. **Skip to "Create .env File" below**

---

## Option 2: Supabase (Also great)

1. **Go to:** https://supabase.com
2. **Sign up** (free tier is generous)
3. **New Project** → Name it "collabconnect"
4. **Get connection string:**
   - Project Settings → Database
   - Connection String → Session Mode
   - Copy it (looks like: `postgresql://postgres.xxx:password@aws-0-us-east-1.pooler.supabase.com:5432/postgres`)

5. **Skip to "Create .env File" below**

---

## Option 3: Local PostgreSQL (For the brave)

```cmd
# Install PostgreSQL from: https://www.postgresql.org/download/windows/
# Or with Chocolatey:
choco install postgresql

# Create database:
psql -U postgres
CREATE DATABASE collabconnect;
\q

# Your connection string:
postgresql://postgres:your_password@localhost:5432/collabconnect
```

---

## Create .env File (CRITICAL STEP)

Once you have your DATABASE_URL:

1. **Copy the example:**
   ```cmd
   copy .env.example .env
   ```

2. **Edit .env** and replace these values:

   ```env
   DATABASE_URL="your-connection-string-here"
   
   NEXTAUTH_SECRET="paste-generated-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Generate NEXTAUTH_SECRET:**
   
   Run this command:
   ```cmd
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
   
   Copy the output and paste it as your NEXTAUTH_SECRET value.

---

## Run Prisma Migrations

This creates all your database tables. It's like magic, but real.

```cmd
npx prisma generate
npx prisma migrate dev --name init
```

You'll see output like:
```
✔ Generated Prisma Client
✔ Applied migration(s):
  - 20251017_init
```

That's 15+ tables being created. Beautiful.

---

## Start the Dev Server

```cmd
npm run dev
```

Wait for:
```
✓ Ready in 2.3s
○ Local: http://localhost:3000
```

---

## Test It!

1. Open: http://localhost:3000
2. Click "Join the Movement"
3. Create an account
4. Sign in
5. See your dashboard

**If you see the dashboard with your name → YOU DID IT!** 🎉

---

## Troubleshooting

### "Can't connect to database"
- Check your DATABASE_URL in .env
- Make sure it has no quotes at the start/end
- Verify the database is running (Railway/Supabase should always be running)

### "Prisma Client not generated"
```cmd
npx prisma generate
```

### "Module not found: @prisma/client"
```cmd
npm install
```

### "Port 3000 already in use"
```cmd
netstat -ano | findstr :3000
# Then kill the process or use different port:
npm run dev -- -p 3001
```

---

## Quick Command Reference

```cmd
# Setup (run once)
copy .env.example .env
# Edit .env with your values
npx prisma generate
npx prisma migrate dev --name init

# Start dev server (run every time)
npm run dev

# Browse database
npx prisma studio

# Reset database (careful!)
npx prisma migrate reset
```

---

## What Happens Next

Once you're running:
- ✅ Create accounts
- ✅ Test sign-in/sign-out
- ✅ Browse your data with `npx prisma studio`
- ✅ Start building features

Then we move to:
- **Step 6:** Test authentication thoroughly
- **Step 7:** Build profile editing
- **Step 8:** Add verification system
- **Step 9:** Create the beautiful map
- **Step 10:** Connect people and change the world

---

## The Moment of Truth

Everything you've built so far - the beautiful schema, the auth system, the landing page - it all comes alive when that database connects.

This is the moment where code becomes reality.

**Now go. Set up that database. Run those migrations. See it work.**

I'll be here when you're ready for the next step. 🚀
