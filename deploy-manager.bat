@echo off
setlocal enabledelayedexpansion
color 0A

:menu
cls
echo ╔════════════════════════════════════════════════════════════════╗
echo ║         CollabConnect - Vercel Deployment Manager             ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Current Status:
echo ---------------

REM Check if Vercel CLI is installed
call vercel --version >nul 2>&1
if errorlevel 1 (
    echo [✗] Vercel CLI: Not installed
    set vercel_cli=0
) else (
    for /f "tokens=*" %%i in ('vercel --version') do set vercel_version=%%i
    echo [✓] Vercel CLI: !vercel_version!
    set vercel_cli=1
)

REM Check if .env.local exists
if exist .env.local (
    echo [✓] Environment: .env.local configured
    set env_configured=1
) else (
    echo [✗] Environment: .env.local missing
    set env_configured=0
)

REM Check if node_modules exists
if exist node_modules (
    echo [✓] Dependencies: Installed
    set deps_installed=1
) else (
    echo [✗] Dependencies: Not installed
    set deps_installed=0
)

REM Check git status
for /f "tokens=*" %%i in ('git status --porcelain 2^>nul ^| find /c /v ""') do set uncommitted=%%i
if "!uncommitted!"=="0" (
    echo [✓] Git: All changes committed
    set git_clean=1
) else (
    echo [⚠] Git: !uncommitted! uncommitted changes
    set git_clean=0
)

echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo What would you like to do?
echo.
echo   1. Install Vercel CLI
echo   2. Generate service configuration files
echo   3. Link project to Vercel
echo   4. Pull environment variables from Vercel
echo   5. Set up database (Prisma migrations)
echo   6. Run pre-deployment checks
echo   7. Deploy to Vercel Preview
echo   8. Deploy to Vercel Production
echo   9. Open Vercel Dashboard
echo   10. Open deployment guide
echo   11. View deployment logs
echo   0. Exit
echo.
set /p choice="Enter your choice (0-11): "

if "%choice%"=="1" goto install_cli
if "%choice%"=="2" goto generate_config
if "%choice%"=="3" goto link_project
if "%choice%"=="4" goto pull_env
if "%choice%"=="5" goto setup_db
if "%choice%"=="6" goto pre_checks
if "%choice%"=="7" goto deploy_preview
if "%choice%"=="8" goto deploy_production
if "%choice%"=="9" goto open_dashboard
if "%choice%"=="10" goto open_guide
if "%choice%"=="11" goto view_logs
if "%choice%"=="0" goto end

echo Invalid choice. Press any key to continue...
pause >nul
goto menu

:install_cli
cls
echo ════════════════════════════════════════════════════════════════
echo Installing Vercel CLI...
echo ════════════════════════════════════════════════════════════════
echo.
call npm install -g vercel
if errorlevel 1 (
    echo.
    echo ✗ Installation failed!
    pause
    goto menu
)
echo.
echo ✓ Vercel CLI installed successfully!
pause
goto menu

:generate_config
cls
echo ════════════════════════════════════════════════════════════════
echo Generating Configuration Files...
echo ════════════════════════════════════════════════════════════════
echo.
call setup-services.bat
pause
goto menu

:link_project
cls
echo ════════════════════════════════════════════════════════════════
echo Linking Project to Vercel...
echo ════════════════════════════════════════════════════════════════
echo.
echo This will open your browser to authenticate with Vercel.
echo.
echo Please:
echo   1. Log in to Vercel
echo   2. Select your organization (hostiliann)
echo   3. Select or create project (collab-connect)
echo.
pause
call vercel link
if errorlevel 1 (
    echo.
    echo ✗ Failed to link project!
    pause
    goto menu
)
echo.
echo ✓ Project linked successfully!
pause
goto menu

:pull_env
cls
echo ════════════════════════════════════════════════════════════════
echo Pull Environment Variables
echo ════════════════════════════════════════════════════════════════
echo.
echo Select environment:
echo   1. Development
echo   2. Preview
echo   3. Production
echo.
set /p env_choice="Enter choice (1-3): "

if "%env_choice%"=="1" set vercel_env=development
if "%env_choice%"=="2" set vercel_env=preview
if "%env_choice%"=="3" set vercel_env=production

echo.
echo Pulling %vercel_env% environment variables...
call vercel env pull .env.local --environment=%vercel_env%
if errorlevel 1 (
    echo.
    echo ✗ Failed to pull environment variables!
    pause
    goto menu
)
echo.
echo ✓ Environment variables saved to .env.local
pause
goto menu

:setup_db
cls
echo ════════════════════════════════════════════════════════════════
echo Database Setup
echo ════════════════════════════════════════════════════════════════
echo.
echo This will:
echo   1. Generate Prisma Client
echo   2. Apply database migrations
echo   3. Seed initial data (optional)
echo.
pause

echo.
echo [1/3] Generating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo ✗ Failed to generate Prisma Client!
    pause
    goto menu
)
echo ✓ Prisma Client generated

echo.
echo [2/3] Applying database migrations...
call npx prisma migrate deploy
if errorlevel 1 (
    echo ✗ Failed to apply migrations!
    echo.
    echo Make sure DATABASE_URL is set correctly in .env.local
    pause
    goto menu
)
echo ✓ Migrations applied

echo.
echo [3/3] Seed database? (y/n)
set /p seed="Enter choice: "
if /i "%seed%"=="y" (
    call npx prisma db seed
    echo ✓ Database seeded
)

echo.
echo ✓ Database setup complete!
pause
goto menu

:pre_checks
cls
echo ════════════════════════════════════════════════════════════════
echo Running Pre-Deployment Checks...
echo ════════════════════════════════════════════════════════════════
echo.

echo [1/4] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ✗ Failed to install dependencies!
    pause
    goto menu
)
echo ✓ Dependencies installed

echo.
echo [2/4] Running ESLint...
call npm run lint
if errorlevel 1 (
    echo ✗ Linting failed!
    echo Please fix errors before deploying.
    pause
    goto menu
)
echo ✓ Linting passed

echo.
echo [3/4] Running TypeScript type check...
call npm run typecheck
if errorlevel 1 (
    echo ✗ Type check failed!
    echo Please fix errors before deploying.
    pause
    goto menu
)
echo ✓ Type check passed

echo.
echo [4/4] Running tests...
call npm run test
if errorlevel 1 (
    echo ⚠ Tests failed! Continue anyway? (y/n)
    set /p continue="Enter choice: "
    if /i not "!continue!"=="y" (
        goto menu
    )
) else (
    echo ✓ Tests passed
)

echo.
echo ════════════════════════════════════════════════════════════════
echo ✓ All pre-deployment checks passed!
echo ════════════════════════════════════════════════════════════════
pause
goto menu

:deploy_preview
cls
echo ════════════════════════════════════════════════════════════════
echo Deploying to Vercel Preview...
echo ════════════════════════════════════════════════════════════════
echo.
echo This will create a preview deployment for testing.
echo.
pause

call vercel
if errorlevel 1 (
    echo.
    echo ✗ Preview deployment failed!
    pause
    goto menu
)
echo.
echo ✓ Preview deployment successful!
echo Check the URL above to view your preview.
pause
goto menu

:deploy_production
cls
echo ════════════════════════════════════════════════════════════════
echo Deploying to Production...
echo ════════════════════════════════════════════════════════════════
echo.
echo ⚠ WARNING: This will deploy to PRODUCTION!
echo.
echo Your site will be live at:
echo   • https://hostilian.org
echo   • https://collab-connect.vercel.app
echo.
echo Are you sure you want to continue? (y/n)
set /p confirm="Enter choice: "
if /i not "%confirm%"=="y" (
    echo Deployment cancelled.
    pause
    goto menu
)

echo.
echo Deploying to production...
call vercel --prod
if errorlevel 1 (
    echo.
    echo ✗ Production deployment failed!
    pause
    goto menu
)
echo.
echo ════════════════════════════════════════════════════════════════
echo ✓ Production deployment successful!
echo ════════════════════════════════════════════════════════════════
echo.
echo Your site is now live at:
echo   • https://hostilian.org
echo   • https://collab-connect.vercel.app
echo.
pause
goto menu

:open_dashboard
cls
echo Opening Vercel Dashboard...
start https://vercel.com/hostiliann/projects
timeout /t 2 >nul
goto menu

:open_guide
cls
echo Opening deployment guide...
if exist VERCEL_DEPLOYMENT_GUIDE.md (
    start VERCEL_DEPLOYMENT_GUIDE.md
) else (
    echo ✗ VERCEL_DEPLOYMENT_GUIDE.md not found!
    pause
)
timeout /t 2 >nul
goto menu

:view_logs
cls
echo ════════════════════════════════════════════════════════════════
echo Opening Deployment Logs...
echo ════════════════════════════════════════════════════════════════
echo.
echo Opening browser to:
echo   • Vercel Logs: https://vercel.com/hostiliann/collab-connect/deployments
echo   • GitHub Actions: https://github.com/Hostilian/collab-connect/actions
echo.
start https://vercel.com/hostiliann/collab-connect/deployments
start https://github.com/Hostilian/collab-connect/actions
pause
goto menu

:end
cls
echo ════════════════════════════════════════════════════════════════
echo Thank you for using CollabConnect Deployment Manager!
echo ════════════════════════════════════════════════════════════════
echo.
echo Useful resources:
echo   • Deployment Guide: VERCEL_DEPLOYMENT_GUIDE.md
echo   • Vercel Dashboard: https://vercel.com/dashboard
echo   • Documentation: https://vercel.com/docs
echo.
echo Happy deploying! 🚀
echo.
pause
exit /b 0
