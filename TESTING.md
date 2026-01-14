# Testing Guide - Incident Tracking System

This guide explains how to write and run unit and integration tests for the incident tracking system.

## Setup

Tests are configured to run with Jest and React Testing Library. The configuration is already set up in:
- `jest.config.js` - Jest configuration
- `jest.setup.js` - Test environment setup

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

Tests are organized in the `__tests__` directory, mirroring the src directory structure:

```
__tests__/
├── lib/
│   ├── rbac.test.ts          # RBAC authorization tests
│   └── guards.test.ts        # Guard function tests
├── components/
│   └── LogoutButton.test.tsx # Component tests
└── app/
    └── tickets/
        └── actions.test.ts   # Server action tests
```

## Types of Tests

### 1. Unit Tests (lib/rbac.test.ts)

Test individual functions in isolation.

```typescript
describe('RBAC - canViewAllTickets', () => {
  it('should return true for ADMIN', () => {
    const result = canViewAllTickets('ADMIN')
    expect(result).toBe(true)
  })
})
```

**When to use:**
- Testing pure functions
- Testing business logic without side effects
- Testing authorization rules
- Testing validation

### 2. Guard Tests (lib/guards.test.ts)

Test authentication and authorization guards with mocked dependencies.

```typescript
it('should throw error when user is not authenticated', async () => {
  mockGetCurrentUser.mockResolvedValue(null)
  await expect(requireUser()).rejects.toThrow('Unauthorized')
})
```

**When to use:**
- Testing middleware/guard functions
- Testing error handling
- Using mocked dependencies

### 3. Integration Tests (app/tickets/actions.test.ts)

Test server actions and database interactions.

```typescript
it('should validate RBAC before creating ticket', () => {
  expect(canCreateTicket('USER')).toBe(true)
})
```

**When to use:**
- Testing server actions with mocked database
- Testing business logic with external dependencies
- Testing data validation and schema

### 4. Component Tests (components/LogoutButton.test.tsx)

Test React components with React Testing Library.

```typescript
it('should call signOut when button is clicked', () => {
  render(<LogoutButton />)
  const button = screen.getByRole('button', { name: /logout/i })
  fireEvent.click(button)
  expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/login' })
})
```

**When to use:**
- Testing component rendering
- Testing user interactions
- Testing component state changes

## Mocking

### Mocking Modules

```typescript
jest.mock('@/lib/auth')
const mockGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>
```

### Mocking Functions

```typescript
mockGetCurrentUser.mockResolvedValue({ id: '1', role: 'USER' })
```

### Clearing Mocks

```typescript
beforeEach(() => {
  jest.clearAllMocks()
})
```

## Common Testing Patterns

### Testing Async Functions

```typescript
it('should return user when authenticated', async () => {
  mockGetCurrentUser.mockResolvedValue(mockUser)
  const user = await requireUser()
  expect(user).toEqual(mockUser)
})
```

### Testing Error Cases

```typescript
it('should throw error on failure', async () => {
  mockGetCurrentUser.mockRejectedValue(new Error('Auth failed'))
  await expect(requireUser()).rejects.toThrow('Auth failed')
})
```

### Testing React Components

```typescript
it('should render button', () => {
  render(<LogoutButton />)
  expect(screen.getByRole('button')).toBeInTheDocument()
})
```

### Testing User Interactions

```typescript
it('should handle click events', () => {
  render(<LogoutButton />)
  fireEvent.click(screen.getByRole('button'))
  expect(mockSignOut).toHaveBeenCalled()
})
```

## Testing Checklist

- [ ] Unit tests for all utility functions (lib/)
- [ ] Guard tests for authentication/authorization
- [ ] Component tests for interactive components
- [ ] Integration tests for server actions
- [ ] Error handling tests
- [ ] Edge case tests
- [ ] RBAC permission tests

## Coverage Goals

Aim for:
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

Check coverage with:
```bash
npm run test:coverage
```

## Examples Added

This project includes example tests for:

1. **RBAC Functions** (`__tests__/lib/rbac.test.ts`)
   - Permission checking for different roles
   - Ticket visibility based on ownership

2. **Guard Functions** (`__tests__/lib/guards.test.ts`)
   - Authentication requirement
   - Error handling

3. **Server Actions** (`__tests__/app/tickets/actions.test.ts`)
   - RBAC validation
   - Input validation
   - Database operations (mocked)

4. **Components** (`__tests__/components/LogoutButton.test.tsx`)
   - Component rendering
   - User interactions
   - External function calls

## Next Steps

To expand test coverage:

1. Add tests for remaining components in `components/`
2. Add tests for API routes in `app/api/`
3. Add tests for remaining server actions
4. Set up integration tests with a real test database
5. Add E2E tests with Playwright or Cypress

## Troubleshooting

### Tests not running
- Ensure Jest config is correct in `jest.config.js`
- Check that test files have `.test.ts` or `.test.tsx` extension
- Verify `jest.setup.js` is in the root directory

### Module resolution errors
- Check path aliases in `jest.config.js` match `tsconfig.json`
- Ensure imports use `@/` prefix correctly

### Mocking issues
- Use `jest.mock()` at the top of the test file
- Call `jest.clearAllMocks()` in `beforeEach()`
- Use `mockReturnValue()` or `mockResolvedValue()` for function returns

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://testingjavascript.com/)
