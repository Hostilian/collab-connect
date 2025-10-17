@echo off
echo Adding all files...
git add .

echo Committing merge...
git commit -m "Merge: Add all CollabConnect foundation files"

echo Pushing to GitHub...
git push -u origin main

echo.
echo Done! Check https://github.com/hostilian/collab-connect
pause
