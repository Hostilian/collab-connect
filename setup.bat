@echo off
REM CollabConnect - Quick Setup Script for Windows
REM This script helps you get your database running quickly

echo.
echo ========================================
echo   CollabConnect - Quick Setup
echo ========================================
echo.

REM Check if .env exists
if exist .env (
    echo [OK] .env file found
) else (
    echo [!] .env file not found
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo [IMPORTANT] Please edit .env and add your DATABASE_URL
    echo Then run this script again.
    echo.
    pause
    exit /b 1
)

REM Check if DATABASE_URL is set
findstr /C:"DATABASE_URL=\"postgresql://" .env >nul
if %errorlevel% equ 0 (
    echo [OK] DATABASE_URL is configured
) else (
    echo [!] DATABASE_URL not configured properly
    echo Please edit .env and set your database connection string
    echo.
    pause
    exit /b 1
)

REM Check if NEXTAUTH_SECRET is set
findstr /C:"NEXTAUTH_SECRET=\"your-secret" .env >nul
if %errorlevel% equ 0 (
    echo [!] NEXTAUTH_SECRET needs to be generated
    echo.
    echo Generating random secret...
    node -e "console.log('NEXTAUTH_SECRET=\"' + require('crypto').randomBytes(32).toString('base64') + '\"')"
    echo.
    echo Copy the line above and replace NEXTAUTH_SECRET in .env
    echo Then run this script again.
    echo.
    pause
    exit /b 1
) else (
    echo [OK] NEXTAUTH_SECRET is configured
)

echo.
echo ========================================
echo   Running Prisma Setup
echo ========================================
echo.

echo Step 1: Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo [ERROR] Prisma generate failed
    pause
    exit /b 1
)

echo.
echo Step 2: Creating database tables...
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo [ERROR] Prisma migrate failed
    echo.
    echo Common issues:
    echo - Check your DATABASE_URL is correct
    echo - Make sure the database is running
    echo - Verify your database credentials
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! Database is ready!
echo ========================================
echo.
echo Your database tables have been created.
echo.
echo Next steps:
echo   1. Run: npm run dev
echo   2. Open: http://localhost:3000
echo   3. Click "Join the Movement"
echo   4. Create your account
echo.
echo To browse your database:
echo   Run: npx prisma studio
echo.
pause
