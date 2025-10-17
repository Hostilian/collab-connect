# 🚀 Quick Command Reference

## Essential Commands (Use These All The Time)

### Development
```cmd
# Start the development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Database
```cmd
# Generate Prisma Client (run after schema changes)
npx prisma generate

# Create migration and apply to database
npx prisma migrate dev --name describe_your_change

# Apply migrations to production
npx prisma migrate deploy

# Open database GUI
npx prisma studio

# Reset database (DANGER: deletes all data)
npx prisma migrate reset

# Check database status
npx prisma migrate status
```

### Setup
```cmd
# Install all dependencies
npm install

# Copy environment variables template
copy .env.example .env

# Generate secret for NextAuth
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Run the setup script (Windows)
setup.bat
```

---

## Troubleshooting Commands

### Clear Everything and Start Fresh
```cmd
# Delete node_modules and reinstall
rmdir /s /q node_modules
npm install

# Clear Next.js cache
rmdir /s /q .next
npm run dev

# Reset database and migrations
npx prisma migrate reset
```

### Check What's Running
```cmd
# Check Node version
node --version

# Check npm version
npm --version

# Check if port 3000 is in use
netstat -ano | findstr :3000
```

### Kill Process on Port 3000 (if needed)
```cmd
# Find process ID
netstat -ano | findstr :3000

# Kill it (replace PID with actual process ID)
taskkill /PID <PID> /F
```

---

## Git Commands (For Version Control)

```cmd
# Check status
git status

# Add all files
git add .

# Commit with message
git commit -m "Your message here"

# Push to remote
git push origin main

# Create new branch
git checkout -b feature-name

# Switch branch
git checkout main

# See commit history
git log --oneline
```

---

## Package Management

```cmd
# Install a new package
npm install package-name

# Install as dev dependency
npm install -D package-name

# Remove a package
npm uninstall package-name

# Update all packages
npm update

# Check for outdated packages
npm outdated
```

---

## Useful One-Liners

```cmd
# Check all errors
npm run lint

# Format code (if prettier is configured)
npx prettier --write .

# Count lines of code
git ls-files | findstr /E .tsx .ts .css | xargs wc -l

# Find text in files
findstr /s /i "search-term" *.tsx *.ts

# See all npm scripts
npm run
```

---

## Database Inspection

```cmd
# Connect to PostgreSQL directly (if local)
psql -U postgres -d collab_connect

# Once connected to psql:
\dt           # List all tables
\d users      # Describe users table
\q            # Quit

# Export schema
npx prisma db pull

# Validate schema
npx prisma validate
```

---

## When Things Break

### "Module not found"
```cmd
npm install
```

### "Port 3000 already in use"
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### "Prisma Client not generated"
```cmd
npx prisma generate
```

### "Can't connect to database"
```cmd
# Check .env file has correct DATABASE_URL
# Test connection:
npx prisma db pull
```

### "Type errors everywhere"
```cmd
# Restart TypeScript server in VS Code:
# Press Ctrl+Shift+P
# Type: "TypeScript: Restart TS Server"
# Press Enter
```

### "Environment variables not loading"
```cmd
# Restart dev server
# Make sure .env is in root directory
# Check .env has no spaces around =
```

---

## Development Workflow

**Typical development session:**

```cmd
# 1. Start dev server
npm run dev

# 2. Make changes to code
# (files auto-reload)

# 3. If you changed Prisma schema:
npx prisma migrate dev --name your_change_name
npx prisma generate

# 4. If you want to see database:
npx prisma studio

# 5. Commit your work:
git add .
git commit -m "Added feature X"
git push
```

---

## Production Deployment

```cmd
# Build the app
npm run build

# Test production build locally
npm start

# Check build size
dir .next\static

# Deploy to Vercel (if using Vercel CLI)
vercel deploy

# Deploy to production
vercel --prod
```

---

## Keyboard Shortcuts in VS Code

```
Ctrl+`          Open terminal
Ctrl+P          Quick open file
Ctrl+Shift+P    Command palette
Ctrl+B          Toggle sidebar
Ctrl+/          Comment line
Alt+↑/↓         Move line up/down
Ctrl+D          Select next occurrence
F2              Rename symbol
Ctrl+Click      Go to definition
```

---

## Emergency Commands

### App won't start
```cmd
rmdir /s /q node_modules
rmdir /s /q .next
npm install
npm run dev
```

### Database is corrupted
```cmd
npx prisma migrate reset
npm run dev
# Create new test account
```

### Can't remember database password
```cmd
# If using Railway/Supabase: get new connection string from dashboard
# If using local: reset PostgreSQL password
```

### Accidentally committed secrets
```cmd
# Remove from Git history (DANGER)
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env" --prune-empty --tag-name-filter cat -- --all

# Better: Delete the commit and push new one
# Change secrets immediately!
```

---

## Monitoring & Logs

```cmd
# Watch files change
npm run dev

# See detailed build info
npm run build

# Check bundle size
npm run build
# Then check .next/static folder
```

---

Keep this file handy! Bookmark it. You'll use these commands constantly.

**Most important commands you'll actually use daily:**
1. `npm run dev` - Start server
2. `npx prisma studio` - View database
3. `npx prisma migrate dev` - Update database
4. `git add . && git commit -m "message"` - Save work

That's like 90% of your daily workflow right there.
