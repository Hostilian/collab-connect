@echo off
REM Vercel Deployment Setup Script for Windows
REM This script helps you set up Vercel deployment for collab-connect

echo 🚀 Vercel Deployment Setup for Collab-Connect
echo ==============================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Installing Vercel CLI...
    call npm install -g vercel
) else (
    echo ✅ Vercel CLI is already installed
)

echo.
echo 📋 Step 1: Login to Vercel
echo ==========================
call vercel login

echo.
echo 📋 Step 2: Link Project
echo =======================
call vercel link

echo.
echo 📋 Step 3: Get Project Information
echo ===================================
if exist ".vercel\project.json" (
    echo ✅ Project linked successfully!
    echo.
    echo Your Vercel Project Details:
    echo ----------------------------
    type .vercel\project.json
    echo.
    echo 📝 Please add these to your GitHub Secrets:
    echo 1. VERCEL_ORG_ID ^(from project.json above^)
    echo 2. VERCEL_PROJECT_ID ^(from project.json above^)
    echo 3. VERCEL_TOKEN ^(get from https://vercel.com/account/tokens^)
) else (
    echo ❌ Project linking failed. Please try again.
    exit /b 1
)

echo.
echo 📋 Step 4: Set Environment Variables in Vercel
echo ==============================================
echo Go to: https://vercel.com/dashboard
echo Navigate to: Your Project -^> Settings -^> Environment Variables
echo.
echo Required environment variables:
echo - DATABASE_URL
echo - NEXTAUTH_SECRET
echo - NEXTAUTH_URL
echo - RESEND_API_KEY
echo - UPSTASH_REDIS_REST_URL
echo - UPSTASH_REDIS_REST_TOKEN
echo.

echo 📋 Step 5: Add GitHub Secrets
echo =============================
echo Go to: https://github.com/Hostilian/collab-connect/settings/secrets/actions
echo.
echo Add these secrets:
echo - VERCEL_TOKEN ^(from https://vercel.com/account/tokens^)
echo - VERCEL_ORG_ID ^(from .vercel\project.json^)
echo - VERCEL_PROJECT_ID ^(from .vercel\project.json^)
echo - CODECOV_TOKEN ^(optional, from https://codecov.io^)
echo.

echo 📋 Step 6: Test Deployment
echo ==========================
echo Run: vercel --prod
echo.

echo ✅ Setup complete! Your next push to 'main' will trigger automatic deployment.
echo.
echo 📚 For more information, see VERCEL_DEPLOYMENT.md
pause
