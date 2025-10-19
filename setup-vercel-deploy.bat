@echo off
echo ============================================
echo CollabConnect - Vercel Deployment Setup
echo ============================================
echo.

REM Check if Vercel CLI is installed
echo [1/6] Checking Vercel CLI...
call vercel --version >nul 2>&1
if errorlevel 1 (
    echo Vercel CLI not found. Installing...
    call npm install -g vercel
) else (
    echo ✓ Vercel CLI already installed
)
echo.

REM Link project to Vercel
echo [2/6] Linking project to Vercel...
echo This will open your browser to authenticate.
echo Please select your organization and project when prompted.
echo.
call vercel link
if errorlevel 1 (
    echo ✗ Failed to link project
    pause
    exit /b 1
)
echo ✓ Project linked successfully
echo.

REM Pull environment variables
echo [3/6] Pulling environment variables...
echo Select which environment to pull:
echo 1. Development
echo 2. Preview
echo 3. Production
echo.
set /p env_choice="Enter choice (1-3): "

if "%env_choice%"=="1" set vercel_env=development
if "%env_choice%"=="2" set vercel_env=preview
if "%env_choice%"=="3" set vercel_env=production

call vercel env pull .env.local --environment=%vercel_env%
if errorlevel 1 (
    echo ✗ Failed to pull environment variables
    pause
    exit /b 1
)
echo ✓ Environment variables saved to .env.local
echo.

REM Install dependencies
echo [4/6] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ✗ Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

REM Generate Prisma Client
echo [5/6] Generating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo ✗ Failed to generate Prisma Client
    pause
    exit /b 1
)
echo ✓ Prisma Client generated
echo.

REM Run type check
echo [6/6] Running type check...
call npm run typecheck
if errorlevel 1 (
    echo ✗ Type check failed
    echo Please fix TypeScript errors before deploying
    pause
    exit /b 1
)
echo ✓ Type check passed
echo.

echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Review .env.local and add missing environment variables
echo 2. Set up database: npx prisma migrate deploy
echo 3. Deploy to Vercel: vercel --prod
echo.
echo Or push to GitHub to trigger automatic deployment:
echo   git add .
echo   git commit -m "chore: trigger deployment"
echo   git push origin main
echo.
pause
