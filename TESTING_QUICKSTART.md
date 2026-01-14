# Testing Quick Start Guide

## Installation Complete ✓

Your project is now set up with a complete testing framework including Jest and React Testing Library.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## What's Been Set Up

### Test Configuration Files
- **jest.config.js** - Jest configuration with TypeScript support
- **jest.setup.js** - Test environment setup with testing-library utilities

### Test Files (5 test suites, 39 tests)
1. **`__tests__/lib/rbac.test.ts`** - RBAC authorization logic tests
2. **`__tests__/lib/guards.test.ts`** - Authentication guard tests
3. **`__tests__/app/tickets/actions.test.ts`** - Server action integration tests
4. **`__tests__/components/LogoutButton.test.tsx`** - React component tests
5. **`__tests__/example-factories.test.ts`** - Example using test factories

### Test Utilities
- **`__tests__/test-utils.ts`** - Reusable factories and test data helpers

### Documentation
- **TESTING.md** - Comprehensive testing guide with examples and best practices

## Current Test Coverage

```
lib/          56.75% statements | 58.82% branches | 83.33% functions
├── rbac.ts   100% (fully tested)
├── guards.ts 100% (fully tested)
└── prisma.ts 0% (integration, not needed for unit tests)

components/   33.33% statements | 0% branches | 66.66% functions
└── LogoutButton.tsx 100% (fully tested)
```

## Write Your First Test

### 1. Create a test file
Create a file matching the pattern: `**/__tests__/**/*.test.ts(x)` or `**/*.spec.ts(x)`

### 2. Import utilities
```typescript
import { createMockUser, createMockTicket, TEST_USERS } from '@/__tests__/test-utils'
```

### 3. Write your test
```typescript
describe('My Feature', () => {
  it('should do something', () => {
    const user = createMockUser({ role: 'ADMIN' })
    expect(user.role).toBe('ADMIN')
  })
})
```

### 4. Run it
```bash
npm test -- --testNamePattern="My Feature"
```

## Next Steps

1. **Expand coverage** - Add tests for the remaining components and utilities
2. **API routes** - Test your API endpoints in `app/api/`
3. **Server actions** - Add more integration tests for server actions
4. **E2E tests** - Consider adding Playwright or Cypress for end-to-end testing

## Useful Test Patterns

### Testing Async Functions
```typescript
it('should handle async operations', async () => {
  const result = await asyncFunction()
  expect(result).toBeDefined()
})
```

### Testing Error Cases
```typescript
it('should throw on invalid input', () => {
  expect(() => myFunction(invalid)).toThrow()
})
```

### Mocking External Dependencies
```typescript
jest.mock('@/lib/auth')
const { getCurrentUser } = require('@/lib/auth')
// Then: getCurrentUser.mockResolvedValue(mockUser)
```

### Testing Components
```typescript
it('should render button', () => {
  render(<MyButton />)
  expect(screen.getByRole('button')).toBeInTheDocument()
})
```

## Debugging Tests

```bash
# Run a single test file
npm test -- __tests__/lib/rbac.test.ts

# Run tests matching a pattern
npm test -- --testNamePattern="canViewTicket"

# Run with verbose output
npm test -- --verbose

# Stop on first test failure
npm test -- --bail
```

## Resources

- [Jest Docs](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://testingjavascript.com/)

---

Happy testing! 🧪
