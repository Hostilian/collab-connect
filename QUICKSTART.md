# 🚀 QUICK START - Get Running in 5 Minutes

## You're here: Todo #5 - Setting up the database

Listen, this is the moment where the code becomes REAL. You've got all the pieces, now let's bring this beast to life.

### Step 1: Install PostgreSQL (if you haven't already)

**Windows:**
```cmd
# Download from: https://www.postgresql.org/download/windows/
# Or use Chocolatey:
choco install postgresql
```

**Or use a cloud database (easier!):**
- Go to https://railway.app or https://supabase.com
- Create a free PostgreSQL database
- Copy the connection string

### Step 2: Create your .env fileeeee

```cmd
copy .env.example .env
```

Now edit `.env` and set:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/collabconnect"
NEXTAUTH_SECRET="run-this-command-to-generate"
```

**Generate a secure NEXTAUTH_SECRET:**
```cmd
# In Git Bash or WSL:
openssl rand -base64 32

# Or in PowerShell:
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### Step 3: Run Prisma migrations

This creates all your database tables:

```cmd
npx prisma migrate dev --name init
```

You'll see magic happen - all those beautiful tables being created.

### Step 4: Generate Prisma Client

```cmd
npx prisma generate
```

### Step 5: Fire it up!

```cmd
npm run dev
```

Go to: http://localhost:3000

### Step 6: Create your first account

1. Click "Join the Movement"
2. Create an account
3. Sign in
4. You're in the revolution, baby!

---

## 🎯 What You Can Do Right Now

- ✅ Create an account
- ✅ Sign in/out
- ✅ View the landing page
- ✅ Access the dashboard

## 🔧 Troubleshooting

**"Can't connect to database"**
- Check your DATABASE_URL in .env
- Make sure PostgreSQL is running
- Try: `psql -U postgres` to test connection

**"Module not found"**
- Run: `npm install`
- Delete node_modules and run `npm install` again

**"Prisma Client not generated"**
- Run: `npx prisma generate`

**Port 3000 already in use**
- Kill the process or use: `npm run dev -- -p 3001`

---

## 🎨 Next Steps (From the Todo List)

After you've got it running, you'll tackle:

6. **Test authentication flow** - Make sure sign-up/sign-in works perfectly
7. **Build profile system** - Let users customize their profiles
8. **Add verification** - The transparency feature that makes this special
9. **Create the MAP** - The beautiful Apple Maps-style interface

Remember: Every great revolution starts with a working database connection. Let's make yours work.

---

## 📊 Database Explorer

Want to see your data?

```cmd
npx prisma studio
```

This opens a web UI at http://localhost:5555 where you can browse all your tables.

---

## Need Help?

Check:
- REFERENCE.md for detailed technical docs
- SUMMARY.md for project overview
- The massive todo list (50 glorious steps!)

Now go. Build. Fight the system. Connect people. Change the world.

Or at least get the database running first. That's a good start.
