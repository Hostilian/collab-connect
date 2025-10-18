# 🚀 QUICK START GUIDE - GET RUNNING IN 5 MINUTES

Listen, you don't have Docker installed. That's fine. Let's get this thing running with cloud services. **No BS, just execution.**

---

## 🎯 **What You Already Have**
✅ Node.js installed
✅ Prisma configured  
✅ All API integrations coded
✅ Next.js app structure ready

---

## 🔥 **Step 1: Database Setup (2 minutes)**

### Option A: Railway (RECOMMENDED)
1. Go to: **https://railway.app**
2. Click "Start a New Project" → "Provision PostgreSQL"
3. Click your PostgreSQL → "Connect" tab
4. Copy the `DATABASE_URL` (looks like `postgresql://postgres:...`)
5. Done!

### Option B: Supabase
1. Go to: **https://supabase.com**
2. Create new project
3. Settings → Database → Connection String → Copy it
4. Done!

---

## 🔐 **Step 2: Environment Variables (1 minute)**

```cmd
cd C:\Users\Hostilian\collab-connect
copy .env.example .env.local
```

Edit `.env.local` and add:

```bash
# REQUIRED - Your database from Step 1
DATABASE_URL="postgresql://your-connection-string-here"

# REQUIRED - Generate these secrets
NEXTAUTH_SECRET="run: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\""
AUTH_SECRET="same-as-above"

# OPTIONAL - Get free API keys later
NEXT_PUBLIC_MAPTILER_KEY="get-free-at-maptiler.com"
```

Generate secrets quickly:
```cmd
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 📦 **Step 3: Initialize Database (1 minute)**

```cmd
npm run prisma:push
npm run prisma:generate
```

This creates all your tables. Watch it work its magic.

---

## 🎬 **Step 4: RUN THE DAMN THING**

```cmd
npm run dev
```

Open: **http://localhost:3000**

**That's it. You're live.**

---

## 🗺️ **Step 5: Add Free API Keys (Optional but Recommended)**

All these are **FREE** for personal/small use:

### **Maps** (Makes it beautiful)
- **MapTiler**: https://cloud.maptiler.com/
  - Sign up → Get key → Add to `.env.local`
  - `NEXT_PUBLIC_MAPTILER_KEY="your-key"`

### **Geocoding** (Better location search)
- **LocationIQ**: https://locationiq.com/
  - Free: 5,000 requests/day
  - `LOCATIONIQ_API_KEY="your-key"`

### **Images** (Pretty backgrounds)
- **Unsplash**: https://unsplash.com/developers
  - Free: 50 requests/hour
  - `UNSPLASH_ACCESS_KEY="your-key"`

### **Translation** (Multi-language)
- **Already works!** LibreTranslate is free and needs no key
- Optional: Add your email for MyMemory higher limits
  - `MYMEMORY_EMAIL="your@email.com"`

---

## 🎯 **What Works Right Now**

| Feature | Status | Route |
|---------|--------|-------|
| User Profiles | ✅ Ready | `/profile` |
| Interactive Map | ✅ Ready | `/map` |
| Location Search | ✅ Ready | `/api/location` |
| Property Search | ✅ Ready | `/api/properties` |
| Translation | ✅ Ready | `/api/translate` |
| Gravatar Images | ✅ Ready | Auto |
| IP Geolocation | ✅ Ready | Auto |

---

## 🐛 **Troubleshooting**

### "Cannot connect to database"
- Check `DATABASE_URL` in `.env.local`
- Make sure it starts with `postgresql://`
- Run `npm run prisma:push` again

### "Module not found"
```cmd
npm install
npm run prisma:generate
```

### "Port 3000 already in use"
```cmd
# Kill the process
taskkill /F /IM node.exe
# Or use different port
npm run dev -- -p 3001
```

### Still stuck?
```cmd
# Nuclear option - fresh start
rm -rf node_modules .next
npm install
npm run prisma:generate
npm run dev
```

---

## 📊 **Current Architecture**

```
CollabConnect
├── Next.js 15 (App Router)
├── PostgreSQL (Railway/Supabase)
├── Prisma ORM
├── MapLibre GL (Apple Maps style)
├── Tailwind CSS v4
└── 12+ Free APIs integrated
```

---

## 🎨 **What You're Building**

**Phase 1** (NOW):
- ✅ User profiles with full transparency
- ✅ Beautiful interactive map
- ✅ Multi-language support
- ✅ Location-based connections
- ✅ Property search

**Phase 2** (NEXT):
- Real-time chat (Socket.io)
- Group collaboration spaces
- Insurance fight mode
- Property bidding system

**Phase 3** (LATER):
- AI-powered matching
- Auto property alerts
- Legal resource hub
- Success rate analytics

---

## 💡 **Key Commands**

```cmd
npm run dev              # Start development
npm run build            # Production build
npm run lint             # Check code quality
npm run typecheck        # TypeScript checks
npm run prisma:studio    # Visual database editor
npm run test             # Run tests
```

---

## 🚀 **Next Steps**

1. **Get it running** (Steps 1-4 above)
2. **Add MapTiler key** for beautiful maps
3. **Create your first user** at http://localhost:3000
4. **Test the map** at http://localhost:3000/map
5. **Start building features** from `TODO_MASTER.md`

---

## 🔥 **The Philosophy**

This isn't just another app. This is about **connecting real people to fight real problems**.

- Insurance denying your claim? **Find 10 others with the same issue.**
- Can't afford that house? **Collaborate with friends to buy it together.**
- Language barrier? **Connect anyway - we translate automatically.**

**Transparency first. Collaboration always. Fight the system together.**

Now stop reading and **run those commands**. Let's build this thing.

---

## 📞 **Resources**

- **API Documentation**: `API_INTEGRATIONS_COMPLETE.md`
- **Database Schema**: `prisma/schema.prisma`
- **Project Status**: `TODO_MASTER.md`
- **Development Docs**: `DEVELOPMENT.md`

All APIs are free/open source. All services have free tiers. **No excuses, just execution.**

**Let's go. 🚀**
