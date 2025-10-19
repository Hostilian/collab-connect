@echo off
echo ============================================
echo CollabConnect - Service Configuration Helper
echo ============================================
echo.

REM Create .env.template with all required variables
echo Creating .env.template file...
(
echo # Database
echo DATABASE_URL=postgresql://user:password@host:5432/collab_connect
echo.
echo # NextAuth
echo NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
echo NEXTAUTH_URL=https://hostilian.org
echo.
echo # Twilio ^(Phone Verification^)
echo TWILIO_ACCOUNT_SID=your-twilio-account-sid
echo TWILIO_AUTH_TOKEN=your-twilio-auth-token
echo TWILIO_PHONE_NUMBER=+1234567890
echo.
echo # AWS S3 ^(Document Storage^)
echo AWS_ACCESS_KEY_ID=your-aws-access-key
echo AWS_SECRET_ACCESS_KEY=your-aws-secret-key
echo AWS_S3_BUCKET=collab-connect-documents
echo AWS_REGION=us-east-1
echo.
echo # Pusher ^(Real-time Messaging^)
echo PUSHER_APP_ID=your-pusher-app-id
echo PUSHER_KEY=your-pusher-key
echo PUSHER_SECRET=your-pusher-secret
echo PUSHER_CLUSTER=us2
echo NEXT_PUBLIC_PUSHER_KEY=your-pusher-key
echo NEXT_PUBLIC_PUSHER_CLUSTER=us2
echo.
echo # Web Push Notifications
echo VAPID_PUBLIC_KEY=your-vapid-public-key
echo VAPID_PRIVATE_KEY=your-vapid-private-key
echo NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
echo.
echo # Upstash Redis ^(Rate Limiting^)
echo UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
echo UPSTASH_REDIS_REST_TOKEN=your-redis-token
echo.
echo # Sentry ^(Optional - Error Tracking^)
echo SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
echo NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
echo.
echo # OAuth Providers ^(Optional^)
echo GOOGLE_CLIENT_ID=your-google-client-id
echo GOOGLE_CLIENT_SECRET=your-google-client-secret
echo GITHUB_ID=your-github-oauth-id
echo GITHUB_SECRET=your-github-oauth-secret
) > .env.template
echo ✓ .env.template created
echo.

REM Generate VAPID keys
echo Generating VAPID keys for Web Push notifications...
call npx web-push generate-vapid-keys > vapid-keys.txt
if errorlevel 1 (
    echo ✗ Failed to generate VAPID keys
) else (
    echo ✓ VAPID keys generated and saved to vapid-keys.txt
    echo.
    echo IMPORTANT: Add these keys to your .env.local and Vercel environment variables!
    type vapid-keys.txt
    echo.
)

REM Generate NextAuth secret
echo Generating NextAuth secret...
for /f "tokens=*" %%i in ('powershell -command "[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))"') do set NEXTAUTH_SECRET=%%i
echo ✓ NextAuth secret generated: %NEXTAUTH_SECRET%
echo.

echo ============================================
echo Configuration Guide
echo ============================================
echo.
echo 1. COPY .env.template to .env.local
echo    - Replace all placeholder values with real credentials
echo.
echo 2. SET UP REQUIRED SERVICES:
echo.
echo    a. DATABASE (Choose one):
echo       • Vercel Postgres: https://vercel.com/dashboard/stores
echo       • Supabase: https://supabase.com/
echo       • Railway: https://railway.app/
echo       • Neon: https://neon.tech/
echo.
echo    b. TWILIO (Phone Verification):
echo       • Sign up: https://www.twilio.com/try-twilio
echo       • Get Account SID ^& Auth Token
echo       • Buy a phone number with SMS capability
echo.
echo    c. AWS S3 (Document Storage):
echo       • Sign up: https://aws.amazon.com/
echo       • Create S3 bucket: collab-connect-documents
echo       • Create IAM user with S3 permissions
echo       • Generate access keys
echo.
echo    d. PUSHER (Real-time Messaging):
echo       • Sign up: https://pusher.com/
echo       • Create Channels app
echo       • Copy App ID, Key, Secret, Cluster
echo.
echo    e. UPSTASH REDIS (Rate Limiting):
echo       • Sign up: https://upstash.com/
echo       • Create Redis database
echo       • Copy REST URL and Token
echo.
echo    f. VAPID KEYS (Already generated!):
echo       • Keys saved in: vapid-keys.txt
echo       • Copy both public and private keys
echo.
echo 3. ADD TO VERCEL:
echo    • Go to: https://vercel.com/hostiliann/projects
echo    • Select your project
echo    • Settings → Environment Variables
echo    • Add all variables from .env.local
echo    • Set environment: Production, Preview, Development
echo.
echo 4. DEPLOY:
echo    • Option A: Push to GitHub (auto-deploy)
echo    • Option B: Run: vercel --prod
echo.
echo ============================================
echo Quick Setup Links:
echo ============================================
echo.
echo Vercel Dashboard: https://vercel.com/dashboard
echo Vercel Postgres: https://vercel.com/dashboard/stores
echo GitHub Actions: https://github.com/Hostilian/collab-connect/actions
echo Domain Settings: https://vercel.com/hostiliann/domains/hostilian.org
echo.
echo For detailed instructions, see: VERCEL_DEPLOYMENT_GUIDE.md
echo.
pause
