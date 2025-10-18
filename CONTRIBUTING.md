# Contributing to CollabConnect

Thank you for your interest in contributing to CollabConnect! This document provides guidelines and instructions for contributing.

## Code of Conduct

We're building a platform to bring people together. Be respectful, inclusive, and collaborative in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/collab-connect.git`
3. Follow the setup instructions in [DEVELOPMENT.md](./DEVELOPMENT.md)
4. Create a new branch: `git checkout -b feature/your-feature-name`

## Development Workflow

### Before You Start

- Check existing [issues](https://github.com/Hostilian/collab-connect/issues) and [pull requests](https://github.com/Hostilian/collab-connect/pulls)
- If fixing a bug, ensure there's an issue describing it
- For new features, open an issue to discuss before implementing

### Making Changes

1. **Write Clean Code**
   - Follow TypeScript best practices
   - Use existing patterns and conventions
   - Keep functions small and focused
   - Add comments for complex logic

2. **Type Safety**
   - Avoid `any` types
   - Define proper interfaces and types
   - Use Prisma types where applicable

3. **Testing**
   - Add unit tests for new utilities/functions
   - Add integration tests for components
   - Add E2E tests for user flows
   - Ensure all tests pass: `npm run ci`

4. **Documentation**
   - Update README if adding user-facing features
   - Add JSDoc comments for public APIs
   - Update DEVELOPMENT.md for setup changes

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

**Examples:**
```
feat(map): add clustering for user markers
fix(auth): resolve session timeout issue
docs(readme): add deployment instructions
test(api): add tests for user registration endpoint
```

### Pull Request Process

1. **Before Submitting**
   - Run all checks locally: `npm run ci`
   - Ensure all tests pass
   - Update documentation
   - Resolve merge conflicts

2. **PR Description**
   - Use the PR template
   - Clearly describe what and why
   - Reference related issues
   - Add screenshots for UI changes

3. **Review Process**
   - Address review feedback promptly
   - Keep discussions respectful and constructive
   - Mark conversations as resolved after addressing

4. **After Approval**
   - Squash commits if requested
   - Ensure CI passes
   - Maintainers will merge when ready

## Project Structure

```
collab-connect/
├── src/
│   ├── app/              # Next.js app router (pages)
│   │   ├── api/          # API routes
│   │   ├── auth/         # Authentication pages
│   │   ├── dashboard/    # User dashboard
│   │   └── map/          # Map interface
│   ├── components/       # React components
│   │   └── map/          # Map-specific components
│   ├── lib/              # Utilities and helpers
│   │   ├── auth.ts       # Authentication logic
│   │   ├── email.ts      # Email utilities
│   │   └── prisma.ts     # Database client
│   └── types/            # TypeScript type definitions
├── prisma/               # Database schema and migrations
├── test/                 # Unit tests
├── e2e/                  # End-to-end tests
└── public/               # Static assets
```

## What to Contribute

### Good First Issues

Look for issues labeled `good first issue` - these are beginner-friendly.

### High Priority Areas

- **Testing**: Increase test coverage
- **Documentation**: Improve guides and examples
- **Accessibility**: Ensure WCAG compliance
- **Performance**: Optimize slow operations
- **Internationalization**: Add language translations

### Feature Requests

Before implementing a feature:
1. Open an issue with the `enhancement` label
2. Discuss the approach
3. Get approval from maintainers
4. Implement and submit PR

## Style Guidelines

### TypeScript

- Use functional components with hooks
- Prefer `const` over `let`
- Use arrow functions for callbacks
- Destructure props and state

### React

- Keep components focused and reusable
- Use composition over inheritance
- Avoid prop drilling (use context or Zustand)
- Handle loading and error states

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Ensure responsive design
- Test on multiple screen sizes

### API Routes

- Validate input data
- Return consistent error formats
- Use proper HTTP status codes
- Add error logging

## Testing Guidelines

### Unit Tests

- Test business logic in isolation
- Mock external dependencies
- Cover edge cases
- Run: `npm test`

### Integration Tests

- Test component interactions
- Mock API calls
- Test user interactions
- Run: `npm test`

### E2E Tests

- Test critical user flows
- Test on multiple browsers
- Keep tests independent
- Run: `npm run test:e2e`

## Database Changes

### Prisma Migrations

1. Update `prisma/schema.prisma`
2. Generate migration: `npx prisma migrate dev --name your_migration_name`
3. Test locally
4. Include migration files in PR

### Seeding

If adding seed data:
- Update `prisma/seed.ts`
- Keep seed data minimal and relevant
- Document seed data purpose

## Questions?

- Check [DEVELOPMENT.md](./DEVELOPMENT.md) for setup help
- Review [existing issues](https://github.com/Hostilian/collab-connect/issues)
- Open a new issue with the `question` label

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to CollabConnect! 🤝
