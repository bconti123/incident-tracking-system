# Incident Tracking System

#### Features

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

#### Tech Stack

- Next.js
- Auth.js / NextAuth (Credentials)
- Prisma + PostgreSQL
- Zod validation
- Docker (Postgres)

#### Roles and Permissions (table)

- **ADMIN**: manage everything
- **SUPPORT**: view all tickets, update status/priority/assignee
- **USER**: create tickets, view own tickets, comment on own tickets

#### Architecture notes

- **Object-level authorization** via `canViewTicket(user, ticket)` to prevent ID guessing
- **Server actions** for mutations (no thin API routes)
- **Prisma transactions** for "write + audit log" consistency
- **Soft delete** for comments to preserve history
- **Timeline view model**: normalized `TimelineItem[]` for rendering

#### Getting started

```bash
npm install
docker compose up -d
npm run prisma:migrate
npm run prisma:seed
npm run dev
```
Seed users (example):
- admin@test.com / Password123!
- support@test.com / Password123!
- user@test.com / Password123!

#### Next steps

- Improve the UI and more features
- Screenshots for demo
- Dockerize app
- CI/CD pipeline