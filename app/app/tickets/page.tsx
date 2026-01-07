import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { canViewAllTickets } from "@/lib/rbac";
import { listAssignableUsers } from "./actions";

export default async function TicketsPage({ searchParams, } :
  { searchParams? : {
    status?: string;
    priority?: string;
    assignedToId?: string;
  }}
 ) {
  const sp = await searchParams ?? {};
  const user = await requireUser();

  const where: any = {};

  if (!canViewAllTickets(user.role)) {
    where.ownerId = user.id;
  }

  if (sp?.status) where.status = sp.status;
  if (sp?.priority) where.priority = sp.priority;
  if (sp?.assignedToId) {
    if (sp.assignedToId === "null") {
      where.assignedToId = null;       // ✅ unassigned only
    } else {
      where.assignedToId = sp.assignedToId; // ✅ specific user
    }
  }

  const tickets = await prisma.ticket.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { email: true } },
      assignedTo: { select: { email: true } },
    },
  });

  const canEdit = user.role === "ADMIN" || user.role === "SUPPORT";
  const users = canEdit ? await listAssignableUsers() : [];

  return (
    <div style={{ padding: 24 }}>
      <form method="get" style={{ marginBottom: 16 }}>
      <select name="status" defaultValue={sp?.status ?? ""}>
        <option value="">All statuses</option>
        <option value="OPEN">OPEN</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="BLOCKED">BLOCKED</option>
        <option value="RESOLVED">RESOLVED</option>
      </select>

      <select name="priority" defaultValue={sp?.priority ?? ""}>
        <option value="">All priorities</option>
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
        <option value="URGENT">URGENT</option>
      </select>
      { canEdit && (
      <select name="assignedToId" defaultValue={sp?.assignedToId ?? ""}>
        <option value="">All assignees</option>
        <option value="null">Unassigned</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>{u.email} ({u.role})</option>
        ))}
      </select>
      )}
      <button type="submit">Filter</button>
    </form>
      <h1>Tickets</h1>
      <p><Link href="/app/tickets/new">Create ticket</Link></p>

      <table style={{ width: "100%", marginTop: 12 }}>
        <thead>
          <tr>
            <th align="left">Title</th>
            <th align="left">Status</th>
            <th align="left">Priority</th>
            <th align="left">Owner</th>
            <th align="left">Assigned To</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(t => (
            <tr key={t.id}>
              <td><Link href={`/app/tickets/${t.id}`}>{t.title}</Link></td>
              <td>{t.status}</td>
              <td>{t.priority}</td>
              <td>{t.owner.email}</td>
              <td>{t.assignedTo?.email ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
