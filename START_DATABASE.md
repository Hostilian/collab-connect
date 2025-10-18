# Database Setup Guide

## Issue
Your PostgreSQL database server is not running at `localhost:5432`.

## Solutions

### Option 1: Install PostgreSQL (Recommended)
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and follow the wizard
3. Set password to `postgres` (or update your `.env` file)
4. Make sure port is `5432`
5. After installation, the service will auto-start

### Option 2: Use Docker (Easier for Development)
```bash
# Install Docker Desktop first: https://www.docker.com/products/docker-desktop/

# Then run PostgreSQL in a container
docker run --name collab-connect-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=collab_connect \
  -p 5432:5432 \
  -d postgres:17

# Start the container (after first run)
docker start collab-connect-db

# Stop the container
docker stop collab-connect-db
```

### Option 3: Use Supabase (Free Cloud PostgreSQL)
1. Sign up at https://supabase.com (free tier available)
2. Create a new project
3. Copy the connection string from Settings → Database
4. Update your `.env` file:
   ```
   DATABASE_URL="your-supabase-connection-string"
   ```

### Option 4: Use Neon (Free Serverless PostgreSQL)
1. Sign up at https://neon.tech (free tier with 500MB)
2. Create a new project
3. Copy the connection string
4. Update your `.env` file

## After Database is Running

Run these commands:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name initial_setup

# (Optional) Seed the database
npx prisma db seed
```

## Verify Database Connection

```bash
# Test connection
npx prisma db push
```

If you see "✔ Database synchronized", you're good to go!
