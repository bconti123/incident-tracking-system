# Incident Tracking System

### Demo Website Link: https://incident-tracking-system.vercel.app/

### Features

- **Auth + RBAC** (ADMIN / SUPPORT / USER)
- **Ticket CRUD** (create, view, update status/priority/assignee)
- **Comments**
    - Add comment
    - Edit (author/admin only)
    - Soft delete
- **Audit logging** for key actions (ticket + comment + assign/priority)
- **Unified ticket timeline**
    - Merge comments + status history + audits
    - Day grouping (Today/Yesterday)
    - "Show system events" toggle
- **Filters + dashboard**
    - Status / Priority / Assignee / Unassigned filters (URL-driven)
    - Dashboard metrics + recent activity
- **Server-side validation** (Zod) and **transactions** (Prisma)
- **Error code reference** (link common error codes to tickets with note+ audit trail)

### Screenshot

**Ticket Dashboard**
- Status and priority counts, unassigned and "assigned to me" views, and recent updated tickets
<img width="1623" height="1235" alt="Dashboard" src="https://github.com/user-attachments/assets/6f3b829e-8f7e-42b7-88fe-d54ff692712e" />

**Ticket List**
- Search, filters, pagination, and role-aware visibility
<img width="1293" height="931" alt="TicketList" src="https://github.com/user-attachments/assets/e830fd65-6d49-4f7e-9d79-29373c04d894" />

**Ticket Detail** (Admin / Support Control)
- Status, priority, and assignment management with RBAC enforcement
  
**Ticket Timeline**
- Comments, status history, and audit events in a unified timeline
  
<img width="1366" height="878" alt="TicketTimeLine+Detail" src="https://github.com/user-attachments/assets/195e0d8a-f442-438b-ac86-b13c079da066" />


**Error Code Classification**
- Link error codes with notes and suggested recommendations
<img width="738" height="875" alt="Error+Comment" src="https://github.com/user-attachments/assets/ee1be56e-2794-4047-8bed-5b8a124586fe" />

### Tech Stack

- Next.js
- Auth.js / NextAuth (Credentials)
- Prisma + PostgreSQL
- Zod validation
- Docker (Postgres)
- Jest + React Testing Library
- Playwright E2E

### Roles and Permissions

- **ADMIN**: manage everything
- **SUPPORT**: view all tickets, update status/priority/assignee
- **USER**: create tickets, view own tickets, comment on own tickets

### Architecture notes

- **Object-level authorization** via `canViewTicket(user, ticket)` to prevent ID guessing
- **Server actions** for mutations (no thin API routes)
- **Prisma transactions** for "write + audit log" consistency
- **Soft delete** for comments to preserve history
- **Timeline view model**: normalized `TimelineItem[]` for rendering

### Getting started

#### Prerequisites

- Node.js
- Docker
- Docker Compose

#### Environment setup

```bash
cp .example_env .env
```

#### Local setup

```bash
npm install
docker compose up -d
npx prisma migrate deploy
npm run seed
npm run dev
```
Seed users (example):
- admin@test.com / Password123!
- support@test.com / Password123!
- user@test.com / Password123!

### Testing

The project includes both unit/integration coverage with Jest and end-to-end coverage with Playwright.

```bash.
npm test
```

For full Jest and Playwright setup, runbook, and E2E coverage details, see [`TESTING.md`](TESTING.md).

### Next steps

- Improve the UI and expand feature coverage
- Dockerize the application for consistent local and deployment environments
- Add a CI/CD pipeline for automated testing and deployments
- Expand the Playwright E2E suite for timeline and broader regression coverage
