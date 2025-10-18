# Testing Strategy

## 🎯 Overview

Comprehensive testing strategy for Collab-Connect covering unit, integration, E2E, performance, and accessibility testing.

---

## 📊 Testing Pyramid

```
                    /\
                   /  \
                  / E2E \
                 /--------\
                /          \
               / Integration\
              /--------------\
             /                \
            /    Unit Tests    \
           /--------------------\
```

### Distribution
- **70%** Unit Tests
- **20%** Integration Tests
- **10%** E2E Tests

---

## 🧪 Unit Testing

### Framework: Vitest

**What to Test:**
- Pure functions and utilities
- React component logic
- Custom hooks
- Type guards and validators

**Example:**

```typescript
// src/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate, validateEmail } from './utils';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('Jan 15, 2024');
  });
});

describe('validateEmail', () => {
  it('should validate correct email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('should reject invalid email', () => {
    expect(validateEmail('invalid')).toBe(false);
  });
});
```

### Running Unit Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test -- utils.test.ts
```

### Coverage Requirements
- **Statements:** 80%
- **Branches:** 80%
- **Functions:** 80%
- **Lines:** 80%

---

## 🔗 Integration Testing

### What to Test
- API routes with database
- Authentication flows
- External service integrations
- Component interactions

**Example:**

```typescript
// test/integration/api.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { POST } from '@/app/api/auth/register/route';

describe('POST /api/auth/register', () => {
  beforeEach(async () => {
    // Clean database
    await prisma.user.deleteMany();
  });

  it('should register new user', async () => {
    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.user.email).toBe('test@example.com');
  });
});
```

### Test Database Setup

```bash
# Create test database
DATABASE_URL="postgresql://user:pass@localhost:5432/test_db" npm run prisma:push

# Run integration tests
DATABASE_URL="postgresql://user:pass@localhost:5432/test_db" npm test -- integration
```

---

## 🌐 End-to-End Testing

### Framework: Playwright

**What to Test:**
- Critical user journeys
- Authentication flows
- Form submissions
- Page navigation
- Multi-step processes

**Example:**

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should sign up new user', async ({ page }) => {
    await page.goto('/auth/signup');

    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('should sign in existing user', async ({ page }) => {
    await page.goto('/auth/signin');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
  });
});
```

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run in UI mode
npm run test:e2e:ui

# Run in headed mode
npm run test:e2e:headed

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

---

## ♿ Accessibility Testing

### Automated Testing

```typescript
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('should not have accessibility violations', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```

### Manual Testing Checklist

- [ ] Keyboard navigation works
- [ ] Screen reader announces content correctly
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] Images have alt text
- [ ] Forms have labels

---

## 🚀 Performance Testing

### Lighthouse CI

```bash
# Run Lighthouse
npm run test:perf

# View results
cat .lighthouseci/lhr-*.json | jq '.categories.performance.score'
```

### Performance Budgets

| Metric | Target |
|--------|--------|
| Performance | ≥ 80 |
| FCP | ≤ 2.0s |
| LCP | ≤ 2.5s |
| CLS | ≤ 0.1 |
| TBT | ≤ 300ms |

---

## 🔐 Security Testing

### Automated Security Checks

1. **Dependabot**: Weekly dependency updates
2. **CodeQL**: Weekly code scanning
3. **npm audit**: Daily vulnerability checks

### Manual Security Testing

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check outdated packages
npm outdated
```

---

## 📈 Test Coverage Goals

### Current Coverage

```bash
npm run test:coverage
```

### Goals

| Category | Current | Target |
|----------|---------|--------|
| Unit Tests | 70% | 90% |
| Integration Tests | 50% | 80% |
| E2E Tests | 30% | 60% |
| Overall | 60% | 80% |

---

## 🔄 CI/CD Integration

### GitHub Actions Workflows

1. **CI Pipeline** (`.github/workflows/ci.yml`)
   - Runs on every PR
   - Linting, type-checking, unit tests
   - Coverage reporting

2. **E2E Tests** (`.github/workflows/e2e.yml`)
   - Runs on PR to main
   - Multi-browser testing
   - Screenshot/video artifacts

3. **Performance Tests** (`.github/workflows/performance.yml`)
   - Weekly scheduled runs
   - Lighthouse audits
   - Bundle size checks

### Pre-commit Hooks

```bash
# Runs automatically before commit
# - ESLint
# - Prettier
# - Type checking (optional)
```

---

## 🧰 Testing Tools

### Installed Dependencies

```json
{
  "vitest": "Unit testing framework",
  "@playwright/test": "E2E testing",
  "@testing-library/react": "React component testing",
  "@axe-core/playwright": "Accessibility testing",
  "@lhci/cli": "Lighthouse CI",
  "jsdom": "DOM environment for tests"
}
```

---

## 📝 Writing Good Tests

### Best Practices

1. **Follow AAA Pattern**
   ```typescript
   test('should do something', () => {
     // Arrange
     const input = 'test';
     
     // Act
     const result = doSomething(input);
     
     // Assert
     expect(result).toBe('expected');
   });
   ```

2. **Test Behavior, Not Implementation**
   ```typescript
   // Good
   test('should display welcome message after login', async ({ page }) => {
     await login(page);
     await expect(page.locator('text=Welcome')).toBeVisible();
   });

   // Bad
   test('should call setUser function', () => {
     // Testing implementation details
   });
   ```

3. **Use Descriptive Names**
   ```typescript
   // Good
   test('should return 400 when email is invalid');
   
   // Bad
   test('test1');
   ```

4. **Keep Tests Independent**
   ```typescript
   beforeEach(() => {
     // Reset state before each test
     cleanup();
   });
   ```

5. **Avoid Test Interdependence**
   ```typescript
   // Bad - tests depend on order
   test('should create user');
   test('should update user'); // Assumes previous test ran
   
   // Good - each test is independent
   test('should update user', () => {
     const user = createTestUser(); // Create data needed for this test
     // ...
   });
   ```

---

## 🐛 Debugging Tests

### Vitest

```bash
# Run with debug output
DEBUG=* npm test

# Run specific test file
npm test -- --reporter=verbose auth.test.ts
```

### Playwright

```bash
# Run with browser visible
npm run test:e2e:headed

# Open UI mode
npm run test:e2e:ui

# Generate trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

---

## 📊 Test Reports

### Coverage Report

```bash
npm run test:coverage
open coverage/index.html
```

### E2E Test Report

```bash
npx playwright test --reporter=html
npx playwright show-report
```

---

## 🎯 Testing Checklist

Before merging to main:

- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] Coverage ≥ 80%
- [ ] No accessibility violations
- [ ] Performance score ≥ 80
- [ ] No security vulnerabilities
- [ ] Manual testing completed

---

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [Axe Accessibility](https://www.deque.com/axe/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

*Last Updated: October 2025*
