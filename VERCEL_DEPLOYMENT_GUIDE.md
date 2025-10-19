# 🚀 Vercel Deployment Guide for CollabConnect

## ✅ Prerequisites Completed

Your project is **ready for deployment**! All code has been:
- ✅ Committed to GitHub (commit: `8990c35`)
- ✅ Pushed to main branch
- ✅ GitHub Actions pipeline configured
- ✅ All TypeScript errors fixed
- ✅ All ESLint warnings resolved
- ✅ Dependencies installed

---

## 📋 Step-by-Step Deployment Process

### **Step 1: Import Project to Vercel**

1. **Go to Vercel Dashboard**: https://vercel.com/new
2. **Import Git Repository**:
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Choose your GitHub account: **Hostilian**
   - Select repository: **collab-connect**
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

---

### **Step 2: Set Environment Variables**

In the Vercel project settings, add these environment variables:

#### **🔐 Required - Authentication & Database**
```env
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://hostilian.org
```

#### **📱 Required - Phone Verification (Twilio)**
```env
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

#### **☁️ Required - File Storage (AWS S3)**
```env
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=collab-connect-documents
AWS_REGION=us-east-1
```

#### **💬 Required - Real-time Messaging (Pusher)**
```env
PUSHER_APP_ID=your-pusher-app-id
PUSHER_KEY=your-pusher-key
PUSHER_SECRET=your-pusher-secret
PUSHER_CLUSTER=us2
NEXT_PUBLIC_PUSHER_KEY=your-pusher-key
NEXT_PUBLIC_PUSHER_CLUSTER=us2
```

#### **🔔 Required - Push Notifications (VAPID)**
```env
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
```

#### **⚡ Required - Rate Limiting (Upstash Redis)**
```env
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

#### **🐛 Optional - Error Tracking (Sentry)**
```env
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
```

#### **🔍 OAuth Providers (Optional)**
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-oauth-id
GITHUB_SECRET=your-github-oauth-secret
```

---

### **Step 3: Set Up Required Services**

#### **1. PostgreSQL Database (Vercel Postgres or External)**

**Option A: Vercel Postgres** (Recommended)
1. Go to your Vercel project → "Storage" tab
2. Create a new Postgres database
3. Database credentials will auto-populate in environment variables

**Option B: External Database** (Supabase, Railway, etc.)
1. Get your PostgreSQL connection string
2. Add as `DATABASE_URL` environment variable

#### **2. Twilio (Phone Verification)**
1. Sign up at https://www.twilio.com/
2. Get your Account SID and Auth Token from Console
3. Purchase a phone number with SMS capabilities
4. Add credentials to Vercel environment variables

#### **3. AWS S3 (Document Storage)**
1. Create AWS account: https://aws.amazon.com/
2. Create an S3 bucket: `collab-connect-documents`
3. Create IAM user with S3 access
4. Generate access keys
5. Add credentials to Vercel environment variables

#### **4. Pusher (Real-time Messaging)**
1. Sign up at https://pusher.com/
2. Create a new Channels app
3. Get App ID, Key, Secret, and Cluster
4. Add credentials to Vercel environment variables

#### **5. Web Push (Push Notifications)**
Generate VAPID keys locally:
```bash
npx web-push generate-vapid-keys
```
Add both public and private keys to environment variables.

#### **6. Upstash Redis (Rate Limiting)**
1. Sign up at https://upstash.com/
2. Create a new Redis database
3. Copy REST URL and Token
4. Add to Vercel environment variables

---

### **Step 4: Configure Domain**

Your domain **hostilian.org** is already set up in Vercel! ✅

**Verify DNS Settings**:
1. In Vercel Dashboard → Domains → hostilian.org
2. Confirm nameservers are set:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
3. DNS records should show:
   - `ALIAS` record pointing to `cname.vercel-dns-017.com`
   - SSL certificate auto-issued (valid until Jan 14, 2026)

---

### **Step 5: Deploy Database Schema**

After the first deployment, run database migrations:

**Option A: Using Vercel CLI locally**
```bash
# Install Vercel CLI
npm install -g vercel

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
```

**Option B: From Vercel Dashboard**
1. Go to Project → Settings → General
2. Add a "Deploy Hook"
3. Trigger deployment
4. SSH into Vercel deployment or use Vercel CLI

---

### **Step 6: Set Up GitHub Actions Secrets**

Add these secrets to your GitHub repository:

1. Go to: `https://github.com/Hostilian/collab-connect/settings/secrets/actions`
2. Click "New repository secret"
3. Add the following:

```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
```

**Get Vercel Token**:
1. Go to https://vercel.com/account/tokens
2. Create new token with name "GitHub Actions"
3. Copy token

**Get Org ID and Project ID**:
1. Go to your Vercel project settings
2. Copy from URL: `vercel.com/[ORG_ID]/[PROJECT_ID]`

---

### **Step 7: Trigger Deployment**

Your deployment will auto-trigger on push to main! 

To manually trigger:
```bash
# Make a small change
echo "# Deployment trigger" >> README.md

# Commit and push
git add .
git commit -m "chore: trigger Vercel deployment"
git push origin main
```

Or click "Deploy" in Vercel Dashboard.

---

## 🔍 Deployment Pipeline Stages

Your GitHub Actions workflow will:

1. ✅ **Pre-Deploy Checks**
   - Install dependencies
   - Run ESLint
   - Run TypeScript type checking
   - Run unit tests

2. 🚀 **Deploy to Vercel**
   - Pull Vercel environment config
   - Build project artifacts
   - Deploy to production
   - Get deployment URL

3. ✅ **Post-Deploy Validation**
   - Run smoke tests
   - Run E2E tests with Playwright
   - Run Lighthouse performance tests
   - Upload test results

---

## 📊 Monitoring Deployment

### **Vercel Dashboard**
- URL: https://vercel.com/hostiliann/collab-connect
- View build logs, analytics, and performance

### **GitHub Actions**
- URL: https://github.com/Hostilian/collab-connect/actions
- View pipeline status and logs

### **Your Production Site**
- URL: https://hostilian.org
- URL: https://collab-connect.vercel.app (Vercel subdomain)

---

## 🐛 Troubleshooting

### **Build Fails**
1. Check Vercel build logs
2. Verify all environment variables are set
3. Ensure `NODE_VERSION` is 20 or higher
4. Check for TypeScript errors: `npm run typecheck`

### **Database Connection Issues**
1. Verify `DATABASE_URL` is correctly formatted
2. Check database is accessible from Vercel's region
3. Ensure SSL is configured if required
4. Test connection: `npx prisma db push`

### **Environment Variables Not Loading**
1. Restart deployment after adding variables
2. Check variable names match exactly (case-sensitive)
3. Ensure variables are set for "Production" environment
4. Use `NEXT_PUBLIC_` prefix for client-side variables

### **Domain Not Working**
1. Verify nameservers in your registrar
2. Wait 24-48 hours for DNS propagation
3. Check SSL certificate status in Vercel
4. Clear browser cache and try incognito mode

---

## 🎯 Next Steps After Deployment

1. **Test All Features**:
   - Phone verification flow
   - ID document upload
   - Reputation system
   - Real-time messaging
   - Map clustering
   - Onboarding flow

2. **Set Up Monitoring**:
   - Configure Sentry alerts
   - Set up Vercel Analytics
   - Enable Vercel Speed Insights

3. **Performance Optimization**:
   - Review Lighthouse scores
   - Optimize images with Vercel Image Optimization
   - Enable ISR for static pages

4. **Security Checklist**:
   - Review Content Security Policy
   - Enable rate limiting
   - Configure CORS properly
   - Set up API authentication

---

## 📞 Quick Reference

**Vercel Project**: https://vercel.com/hostiliann/projects
**Domain**: https://hostilian.org
**GitHub Repo**: https://github.com/Hostilian/collab-connect
**Documentation**: See `COMPREHENSIVE_IMPLEMENTATION.md`

---

## 🎉 You're Ready!

Your project is fully configured and ready to deploy. Just follow the steps above to:
1. Import project to Vercel
2. Set environment variables
3. Connect domain
4. Deploy! 🚀

**Estimated deployment time**: 5-10 minutes
**First build time**: 3-5 minutes

Good luck! 🍀
