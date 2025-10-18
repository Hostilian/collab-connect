# Development Guide

## Prerequisites

- Node.js 18+ (recommended: Node 20 LTS)
- npm 9+
- PostgreSQL 14+ (or Docker)
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Hostilian/collab-connect.git
cd collab-connect
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your local configuration (see [Environment Variables](#environment-variables) below).

### 4. Database Setup

Set up your database with Prisma:

```bash
npx prisma generate
npx prisma db push
```

For seed data (optional):

```bash
npx prisma db seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm test` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run ci` - Run all CI checks locally (lint + typecheck + tests)

## Environment Variables

See `.env.example` for all required variables. Key variables:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for NextAuth.js sessions
- `NEXTAUTH_URL` - Base URL for authentication callbacks
- `RESEND_API_KEY` - API key for email service (Resend)
- `MAPBOX_TOKEN` - Token for map services (if using Mapbox)

## Docker Development (Optional)

Start the development environment with Docker Compose:

```bash
docker-compose up -d
```

This starts:
- PostgreSQL database on port 5432
- Redis (if configured) on port 6379

## Testing

### Unit Tests

```bash
npm test
```

### E2E Tests (when implemented)

```bash
npm run test:e2e
```

### Coverage

```bash
npm run test:coverage
```

Coverage reports are generated in `./coverage/`.

## Code Style

This project uses:
- **ESLint** for linting
- **Prettier** for formatting
- **TypeScript** for type safety

Run checks before committing:

```bash
npm run lint
npm run typecheck
```

## Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run tests and linting: `npm run ci`
4. Commit with conventional commits: `git commit -m "feat: add new feature"`
5. Push and create a PR

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `test:` - Test changes
- `ci:` - CI/CD changes

## Troubleshooting

### Port Already in Use

If port 3000 is in use:

```bash
npm run dev -- -p 3001
```

### Database Connection Issues

Ensure PostgreSQL is running and `DATABASE_URL` is correct:

```bash
npx prisma studio
```

### Type Errors

Regenerate Prisma client:

```bash
npx prisma generate
```

### Clear Next.js Cache

```bash
rm -rf .next
npm run dev
```

## Project Structure

```
collab-connect/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── lib/              # Utility libraries
│   ├── types/            # TypeScript type definitions
│   └── middleware.ts     # Next.js middleware
├── prisma/
│   └── schema.prisma     # Database schema
├── test/                 # Test files
├── public/               # Static assets
└── .github/              # CI/CD workflows
```

## Need Help?

- Check existing [Issues](https://github.com/Hostilian/collab-connect/issues)
- Create a new issue with the bug report or feature request template
- Review the [README](../README.md)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.
