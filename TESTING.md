# Testing Guide

This project uses Jest for unit and integration-style tests and Playwright for end-to-end browser coverage.

## What Exists

### Jest

Related setup files:

```text
jest.config.js
jest.setup.ts
```

### Playwright

Current Playwright files:

```text
e2e/auth.setup.ts
e2e/auth.spec.ts
e2e/admin-ticket-management.spec.ts
e2e/comments.spec.ts
e2e/ticket-filters.spec.ts
e2e/user-rbac.spec.ts
e2e/db.ts
e2e/test-data.ts
```

Current E2E coverage includes:
- Login success and failure flows
- Stored-auth setup for seeded users
- User RBAC ticket visibility
- Admin ticket creation and ticket update flow
- Comment add, edit, and delete flow
- Ticket search and filter flow for support users

## Commands

```bash
# Jest
npm test
npm run test:watch
npm run test:coverage

# Playwright
npm run test:e2e
npm run test:e2e:headed
npm run test:e2e:ui
```

## Local Setup

Install dependencies and start PostgreSQL (Recommended: run Postgres with Docker):

```bash
npm install
docker compose up -d
```

Apply migrations and seed the database:

```bash
npx prisma migrate deploy
npm run seed
```

Start the app locally:

```bash
npm run dev
```

Seeded credentials:
- `admin@test.com` / `Password123!`
- `support@test.com` / `Password123!`
- `user@test.com` / `Password123!`

## Running Jest

Useful Jest commands:

```bash
# Single file
npm test -- __tests__/lib/rbac.test.ts

# Match by test name
npm test -- --testNamePattern="RBAC"
```

## Running Playwright

Playwright starts `npm run dev` automatically through [`playwright.config.ts`](./playwright.config.ts). By default it uses:
- `PLAYWRIGHT_BASE_URL` or `http://127.0.0.1:3000`
- `DATABASE_URL`

Recommended local runbook:

```bash
# Install browser once
npx playwright install chromium

# Run the suite
npm run test:e2e
```

Optional:

```bash
# Visible browser
npm run test:e2e:headed

# Playwright UI
npm run test:e2e:ui
```

## Playwright Notes

- The `setup` project runs [`e2e/auth.setup.ts`](./e2e/auth.setup.ts) first.
- Auth state is written to `e2e/.auth/`.
- The E2E specs assume seeded users and seeded tickets from [`prisma/seed.ts`](./prisma/seed.ts) and [`e2e/test-data.ts`](./e2e/test-data.ts).
- The suite creates unique ticket titles for mutation tests to avoid collisions.
- Locally, Playwright reuses an existing dev server when one is already running.

## Writing More Tests

Use Jest for:
- Pure business logic in `lib/`
- Guard behavior and server-side validation
- Small component interactions
- Server action behavior with mocked dependencies

Use Playwright for:
- Auth flows
- RBAC behavior across roles
- Multi-step user workflows
- Full-page interactions that depend on the real app and database
