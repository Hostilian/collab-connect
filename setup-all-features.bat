@echo off
echo ============================================
echo CollabConnect - Complete Setup Script
echo ============================================
echo.

echo [1/5] Installing dependencies...
call npm install twilio pusher @aws-sdk/client-s3 @aws-sdk/s3-request-presigner supercluster @types/supercluster

echo.
echo [2/5] Generating Prisma Client...
call npx prisma generate

echo.
echo [3/5] Pushing database schema...
call npx prisma db push

echo.
echo [4/5] Running linter...
call npm run lint

echo.
echo [5/5] Building project...
call npm run build

echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Configure environment variables in .env
echo 2. Add Twilio credentials (phone verification)
echo 3. Add AWS S3 credentials (ID verification)
echo 4. Add Pusher credentials (real-time messaging)
echo 5. Run: npm run dev
echo.
echo See COMPREHENSIVE_IMPLEMENTATION.md for details
echo ============================================

pause
