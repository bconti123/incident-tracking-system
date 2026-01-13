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
<img width="1802" height="770" alt="Screenshot 2026-01-11 203803" src="https://github.com/user-attachments/assets/7cd3ac22-b84f-4466-8c9a-3d81b1717ce7" />

**Ticket List**
- Search, filters, pagination, and role-aware visibility
<img width="1751" height="617" alt="Screenshot 2026-01-11 202311" src="https://github.com/user-attachments/assets/aa99e4a5-7e60-48a8-841b-707e12bd6caa" />

**Ticket Timeline**
- Comments, status history, and audit events in a unified timeline
<img width="1640" height="753" alt="Screenshot 2026-01-11 202539" src="https://github.com/user-attachments/assets/2214236d-8570-43c4-bc6c-ff68f2c1cad7" />

**Error Code Classification**
- Link error codes with notes and suggested remendations
<img width="502" height="262" alt="Screenshot 2026-01-11 202723" src="https://github.com/user-attachments/assets/d6f3db0a-978e-4809-b552-5f304b5e97c9" />

**Ticket Detail** (Admin / Support Control)
- Status, priority, and assignment management with RBAC enforcement
<img width="566" height="572" alt="Screenshot 2026-01-11 202747" src="https://github.com/user-attachments/assets/c0ee1949-6272-47c4-81b3-b493f77483c4" />





### Tech Stack

- Next.js
- Auth.js / NextAuth (Credentials)
- Prisma + PostgreSQL
- Zod validation
- Docker (Postgres)

### Roles and Permissions (table)

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

### Next steps

- Improve the UI and more features
- Dockerize app
- CI/CD pipeline
