@echo off
color 0C
cls
echo ╔════════════════════════════════════════════════════════════════╗
echo ║          FIX VERCEL DEPLOYMENT_DISABLED ERROR                  ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo This script will fix common deployment issues:
echo   1. Clean build cache
echo   2. Remove problematic files
echo   3. Reinstall dependencies
echo   4. Test build locally
echo.
pause
echo.

echo ════════════════════════════════════════════════════════════════
echo [1/7] Cleaning Next.js build cache...
echo ════════════════════════════════════════════════════════════════
if exist .next (
    rmdir /s /q .next
    echo ✓ Removed .next directory
) else (
    echo ✓ .next directory not found (already clean)
)
echo.

echo ════════════════════════════════════════════════════════════════
echo [2/7] Cleaning Vercel cache...
echo ════════════════════════════════════════════════════════════════
if exist .vercel (
    rmdir /s /q .vercel
    echo ✓ Removed .vercel directory
) else (
    echo ✓ .vercel directory not found (already clean)
)
echo.

echo ════════════════════════════════════════════════════════════════
echo [3/7] Backing up and removing problematic .env.production...
echo ════════════════════════════════════════════════════════════════
if exist .env.production (
    copy .env.production .env.production.backup >nul
    del .env.production
    echo ✓ Backed up to .env.production.backup
    echo ✓ Removed .env.production (Vercel will use environment variables instead)
) else (
    echo ✓ .env.production not found
)
echo.

echo ════════════════════════════════════════════════════════════════
echo [4/7] Removing duplicate lockfile...
echo ════════════════════════════════════════════════════════════════
if exist C:\Users\Hostilian\package-lock.json (
    del C:\Users\Hostilian\package-lock.json
    echo ✓ Removed C:\Users\Hostilian\package-lock.json
) else (
    echo ✓ No duplicate lockfile found
)
echo.

echo ════════════════════════════════════════════════════════════════
echo [5/7] Cleaning node_modules and reinstalling...
echo ════════════════════════════════════════════════════════════════
echo This may take a few minutes...
if exist node_modules (
    rmdir /s /q node_modules
    echo ✓ Removed node_modules
)
call npm install
if errorlevel 1 (
    echo ✗ npm install failed!
    pause
    exit /b 1
)
echo ✓ Dependencies reinstalled
echo.

echo ════════════════════════════════════════════════════════════════
echo [6/7] Running TypeScript type check...
echo ════════════════════════════════════════════════════════════════
call npm run typecheck
if errorlevel 1 (
    echo.
    echo ✗ TypeScript errors found!
    echo Please fix TypeScript errors before deploying.
    echo.
    pause
    exit /b 1
)
echo ✓ No TypeScript errors
echo.

echo ════════════════════════════════════════════════════════════════
echo [7/7] Testing production build...
echo ════════════════════════════════════════════════════════════════
call npm run build
if errorlevel 1 (
    color 0C
    echo.
    echo ╔════════════════════════════════════════════════════════════════╗
    echo ║                    ✗ BUILD FAILED                              ║
    echo ╚════════════════════════════════════════════════════════════════╝
    echo.
    echo The build failed. Check the error messages above.
    echo Common issues:
    echo   - Missing environment variables
    echo   - TypeScript errors
    echo   - Import errors
    echo.
    echo Fix the errors, then run this script again.
    echo.
    pause
    exit /b 1
)

color 0A
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    ✓ ALL CHECKS PASSED!                        ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Your local build is working! Now let's deploy to Vercel.
echo.
echo ════════════════════════════════════════════════════════════════
echo Next Steps:
echo ════════════════════════════════════════════════════════════════
echo.
echo 1. Commit and push changes to trigger deployment:
echo    git add .
echo    git commit -m "fix: resolve deployment issues"
echo    git push origin main
echo.
echo 2. Check deployment status:
echo    https://vercel.com/hostiliann/collab-connect/deployments
echo.
echo 3. If deployment is still disabled:
echo    a. Go to: https://vercel.com/hostiliann/collab-connect/settings
echo    b. Look for "Enable Deployments" toggle
echo    c. Enable it and save
echo.
echo 4. If still having issues:
echo    - Contact Vercel Support: https://vercel.com/help
echo    - Reference Error ID: fra1::gwhfv-1760867303956-bf0ee8688bae
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo Would you like to commit and push now? (y/n)
set /p push_now="Enter choice: "

if /i "%push_now%"=="y" (
    echo.
    echo Committing changes...
    git add .
    git commit -m "fix: resolve deployment issues and clean build"
    if errorlevel 1 (
        echo No changes to commit or git error
    ) else (
        echo ✓ Changes committed
        echo.
        echo Pushing to GitHub...
        git push origin main
        if errorlevel 1 (
            echo ✗ Push failed! Check your git credentials.
        ) else (
            echo ✓ Changes pushed!
            echo.
            echo Deployment should start automatically.
            echo Check: https://vercel.com/hostiliann/collab-connect/deployments
            echo.
            timeout /t 3 >nul
            start https://vercel.com/hostiliann/collab-connect/deployments
        )
    )
)

echo.
echo ════════════════════════════════════════════════════════════════
echo Script complete!
echo ════════════════════════════════════════════════════════════════
pause
