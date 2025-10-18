# Database Migrations Guide

## 🗄️ Overview

Complete guide for managing database migrations with Prisma, including development workflows, deployment procedures, and rollback strategies.

---

## 📋 Quick Reference

```bash
# Development
npm run prisma:migrate              # Create and apply migration
npm run prisma:generate             # Regenerate Prisma Client
npm run prisma:studio               # Open Prisma Studio

# Deployment
npm run prisma:migrate:deploy       # Apply migrations in production
npm run prisma:push                 # Push schema changes (dev only)

# Utilities
npx prisma migrate status           # Check migration status
npx prisma migrate diff             # Preview migration changes
npx prisma db pull                  # Pull schema from database
```

---

## 🚀 Development Workflow

### Creating a New Migration

1. **Modify your schema**
   ```prisma
   // prisma/schema.prisma
   model User {
     id        String   @id @default(cuid())
     email     String   @unique
     name      String
     // Add new field
     bio       String?  @db.Text
     @@index([email])
   }
   ```

2. **Create migration**
   ```bash
   npm run prisma:migrate
   # Enter a descriptive name: "add_user_bio_field"
   ```

3. **Review the migration**
   ```bash
   cat prisma/migrations/20241018120000_add_user_bio_field/migration.sql
   ```

4. **Test locally**
   ```bash
   npm run dev
   # Verify the changes work
   ```

### Migration Naming Conventions

Use descriptive, imperative names:

✅ **Good:**
- `add_user_bio_field`
- `create_collaboration_table`
- `add_index_on_user_email`
- `update_profile_constraints`

❌ **Bad:**
- `migration1`
- `changes`
- `update`
- `fix`

---

## 🔄 Migration Workflow

### Step 1: Development

```bash
# Make schema changes
code prisma/schema.prisma

# Create migration
npm run prisma:migrate

# Test the migration
npm run dev
npm test
```

### Step 2: Code Review

Before merging:
- [ ] Migration SQL reviewed
- [ ] No destructive operations without safety checks
- [ ] Indexes added for new queries
- [ ] Backward compatibility maintained
- [ ] Migration tested locally

### Step 3: CI Validation

Automated checks (see `.github/workflows/migrations.yml`):
- Schema validation
- Migration application test
- Rollback capability test
- Database integrity check

### Step 4: Deployment

```bash
# Production deployment
DATABASE_URL=$PRODUCTION_DB npm run prisma:migrate:deploy

# Verify migration
npx prisma migrate status
```

---

## 📊 Migration Patterns

### Adding a Column

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  // New column with default
  role      String   @default("user")
}
```

**Generated SQL:**
```sql
ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user';
```

### Adding an Index

```prisma
model User {
  email     String   @unique
  createdAt DateTime @default(now())
  
  @@index([createdAt])
  @@index([email, createdAt])
}
```

**Best Practice:** Add indexes concurrently in production
```sql
CREATE INDEX CONCURRENTLY "User_createdAt_idx" ON "User"("createdAt");
```

### Adding a Relation

```prisma
model User {
  id            String          @id @default(cuid())
  collaborations Collaboration[]
}

model Collaboration {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id])
  
  @@index([userId])
}
```

### Renaming a Column

```prisma
// BEFORE: Use custom migration
model User {
  userName String // Old name
}

// AFTER
model User {
  name String // New name
}
```

**Custom migration SQL:**
```sql
-- Migration: rename_username_to_name
ALTER TABLE "User" RENAME COLUMN "userName" TO "name";
```

### Making a Column Optional

```prisma
model User {
  bio String? // Was: bio String
}
```

**Generated SQL:**
```sql
ALTER TABLE "User" ALTER COLUMN "bio" DROP NOT NULL;
```

### Making a Column Required

⚠️ **Requires data migration!**

```prisma
model User {
  bio String @default("") // Was: bio String?
}
```

**Migration steps:**
1. Add default value
2. Backfill existing records
3. Make column required

---

## 🛡️ Safe Migration Practices

### 1. Always Create Backups

```bash
# Before migration
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Or use automated backup
npm run db:backup
```

### 2. Test Migrations Thoroughly

```bash
# Create test database
DATABASE_URL=$TEST_DB npm run prisma:migrate:deploy

# Run tests
DATABASE_URL=$TEST_DB npm test

# Cleanup
DATABASE_URL=$TEST_DB npm run db:reset
```

### 3. Use Transactions

Migrations are automatically wrapped in transactions, but for complex changes:

```sql
BEGIN;

-- Your migration SQL
ALTER TABLE "User" ADD COLUMN "role" TEXT;
UPDATE "User" SET "role" = 'user' WHERE "role" IS NULL;
ALTER TABLE "User" ALTER COLUMN "role" SET NOT NULL;

COMMIT;
```

### 4. Add Indexes Concurrently

```sql
-- For large tables, use CONCURRENTLY
CREATE INDEX CONCURRENTLY "User_email_idx" ON "User"("email");
```

### 5. Avoid Destructive Operations

```sql
-- ❌ Don't drop columns immediately
ALTER TABLE "User" DROP COLUMN "oldField";

-- ✅ Deprecate first, drop later
-- 1. Remove from application code
-- 2. Deploy
-- 3. Wait 1-2 weeks
-- 4. Then drop column
```

---

## 🔙 Rollback Procedures

### Automatic Rollback (Development)

```bash
# Reset database to clean state
npx prisma migrate reset

# Apply specific migration
npx prisma migrate resolve --rolled-back "20241018120000_migration_name"
```

### Manual Rollback (Production)

⚠️ **Production rollbacks require careful planning!**

1. **Create rollback SQL**
   ```sql
   -- If you added a column
   ALTER TABLE "User" DROP COLUMN "bio";
   
   -- If you added a table
   DROP TABLE "Collaboration";
   
   -- If you modified a column
   ALTER TABLE "User" ALTER COLUMN "email" TYPE VARCHAR(255);
   ```

2. **Test rollback**
   ```bash
   # Test on staging first!
   DATABASE_URL=$STAGING_DB psql < rollback.sql
   ```

3. **Apply to production**
   ```bash
   # Create backup first!
   pg_dump $PRODUCTION_DB > pre_rollback_backup.sql
   
   # Apply rollback
   DATABASE_URL=$PRODUCTION_DB psql < rollback.sql
   ```

4. **Mark migration as rolled back**
   ```bash
   npx prisma migrate resolve --rolled-back "20241018120000_migration_name"
   ```

---

## 📝 Data Migrations

### Example: Backfilling Data

```typescript
// prisma/migrations/20241018120000_backfill_user_roles/migration.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Backfill missing user roles
  await prisma.user.updateMany({
    where: { role: null },
    data: { role: 'user' },
  });
  
  console.log('✅ Backfill completed');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run with:
```bash
DATABASE_URL=$PRODUCTION_DB npx ts-node prisma/migrations/xxx/migration.ts
```

---

## 🌱 Seeding Database

### Create Seed Script

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: await bcrypt.hash('admin123', 10),
        emailVerified: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        name: 'Test User',
        password: await bcrypt.hash('user123', 10),
        emailVerified: new Date(),
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Configure in package.json

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  },
  "scripts": {
    "prisma:seed": "prisma db seed"
  }
}
```

### Run Seed

```bash
# Seed database
npm run prisma:seed

# Reset and seed
npx prisma migrate reset --skip-seed
npm run prisma:seed
```

---

## 🔍 Troubleshooting

### Migration Out of Sync

```bash
# Check status
npx prisma migrate status

# If migrations are out of sync
npx prisma migrate resolve --applied "20241018120000_migration_name"
```

### Schema Drift

```bash
# Compare schema to database
npx prisma db pull --print

# If database has changes not in schema
npx prisma db pull
npx prisma migrate dev --name sync_schema
```

### Failed Migration

```bash
# Mark as rolled back
npx prisma migrate resolve --rolled-back "20241018120000_failed_migration"

# Fix the migration
# Then apply again
npx prisma migrate dev
```

### Connection Issues

```bash
# Test database connection
npx prisma db execute --stdin <<< "SELECT 1;"

# Check DATABASE_URL
echo $DATABASE_URL
```

---

## 📋 Pre-Deployment Checklist

Before deploying migrations to production:

- [ ] Migration tested in development
- [ ] Migration tested in staging
- [ ] Database backup created
- [ ] Rollback plan documented
- [ ] Team notified (if breaking changes)
- [ ] Downtime scheduled (if required)
- [ ] Migration SQL reviewed
- [ ] Indexes will be created concurrently
- [ ] Data migrations tested
- [ ] Post-migration verification plan ready

---

## 🚨 Emergency Procedures

### Database Locked

```bash
# Check for long-running queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query 
FROM pg_stat_activity 
WHERE state = 'active' 
ORDER BY duration DESC;

# Kill blocking query (if safe)
SELECT pg_terminate_backend(pid);
```

### Migration Stuck

```bash
# Check migration status
npx prisma migrate status

# Force unlock (use with caution!)
DELETE FROM "_prisma_migrations" WHERE migration_name = 'stuck_migration';
```

### Restore from Backup

```bash
# Stop application
vercel --prod --force

# Restore backup
pg_restore -d $DATABASE_URL backup_file.sql

# Verify restoration
npx prisma migrate status

# Restart application
vercel --prod
```

---

## 📊 Migration Metrics

Track these metrics:

- Migration execution time
- Database size before/after
- Query performance impact
- Downtime duration (if any)
- Rollback success rate

### Example Monitoring Query

```sql
SELECT 
  migration_name,
  started_at,
  finished_at,
  finished_at - started_at AS duration,
  success
FROM "_prisma_migrations"
ORDER BY finished_at DESC
LIMIT 10;
```

---

## 📚 Resources

- [Prisma Migrate Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [PostgreSQL ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)
- [Database Migrations Best Practices](https://www.prisma.io/dataguide/database-workflows/database-migrations)

---

*Last Updated: October 2025*
