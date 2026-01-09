import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { canViewAllTickets } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const viewAll = canViewAllTickets(user.role);

  const baseWhere: any = {};
  if (!viewAll) baseWhere.ownerId = user.id;

  const [
    // status counts
    total,
    open,
    inProgress,
    blocked,
    resolved,
    unassigned,

    // priority counts
    low,
    medium,
    high,
    urgent,

    // "assigned to me" (support/admin)
    assignedToMe,

    // recent tickets
    recent,
  ] = await Promise.all([
    prisma.ticket.count({ where: baseWhere }),
    prisma.ticket.count({ where: { ...baseWhere, status: "OPEN" } }),
    prisma.ticket.count({ where: { ...baseWhere, status: "IN_PROGRESS" } }),
    prisma.ticket.count({ where: { ...baseWhere, status: "BLOCKED" } }),
    prisma.ticket.count({ where: { ...baseWhere, status: "RESOLVED" } }),
    prisma.ticket.count({ where: { ...baseWhere, assignedToId: null } }),

    prisma.ticket.count({ where: { ...baseWhere, priority: "LOW" } }),
    prisma.ticket.count({ where: { ...baseWhere, priority: "MEDIUM" } }),
    prisma.ticket.count({ where: { ...baseWhere, priority: "HIGH" } }),
    prisma.ticket.count({ where: { ...baseWhere, priority: "URGENT" } }),

    viewAll ? prisma.ticket.count({ where: { assignedToId: user.id } }) : Promise.resolve(0),

    prisma.ticket.findMany({
      where: baseWhere,
      orderBy: { updatedAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        updatedAt: true,
        owner: { select: { email: true } },
        assignedTo: { select: { email: true } },
      },
    }),
  ]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p style={{ opacity: 0.8 }}>
        Signed in as {user.email} ({user.role})
      </p>

      <h3 style={{ marginTop: 16 }}>Status</h3>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 8 }}>
        <Card title="Total" value={total} href="/app/tickets" />
        <Card title="Open" value={open} href="/app/tickets?status=OPEN" />
        <Card title="In Progress" value={inProgress} href="/app/tickets?status=IN_PROGRESS" />
        <Card title="Blocked" value={blocked} href="/app/tickets?status=BLOCKED" />
        <Card title="Resolved" value={resolved} href="/app/tickets?status=RESOLVED" />
        {viewAll && (
          <Card title="Unassigned" value={unassigned} href="/app/tickets?assignedToId=null" />
        )}
        {viewAll && (
          <Card title="Assigned to me" value={assignedToMe} href={`/app/tickets?assignedToId=${user.id}`} />
        )}
      </div>

      <h3 style={{ marginTop: 24 }}>Priority</h3>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 8 }}>
        <Card title="Low" value={low} href="/app/tickets?priority=LOW" />
        <Card title="Medium" value={medium} href="/app/tickets?priority=MEDIUM" />
        <Card title="High" value={high} href="/app/tickets?priority=HIGH" />
        <Card title="Urgent" value={urgent} href="/app/tickets?priority=URGENT" />
      </div>

      <h3 style={{ marginTop: 24 }}>Recently updated</h3>
      {recent.length === 0 ? (
        <p style={{ opacity: 0.8 }}>No tickets yet.</p>
      ) : (
        <table style={{ width: "100%", marginTop: 8 }}>
          <thead>
            <tr>
              <th align="left">Title</th>
              <th align="left">Status</th>
              <th align="left">Priority</th>
              <th align="left">Owner</th>
              <th align="left">Assigned To</th>
              <th align="left">Updated</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((t) => (
              <tr key={t.id}>
                <td>
                  <Link href={`/app/tickets/${t.id}`}>{t.title}</Link>
                </td>
                <td>{t.status}</td>
                <td>{t.priority}</td>
                <td>{t.owner.email}</td>
                <td>{t.assignedTo?.email ?? "-"}</td>
                <td>{new Date(t.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p style={{ marginTop: 24 }}>
        <Link href="/app/tickets">Go to Tickets →</Link>
      </p>
    </div>
  );
}

const Card = ({ title, value, href }: { title: string; value: number; href: string }) => {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        width: 190,
        padding: 16,
        border: "1px solid #ddd",
        borderRadius: 8,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.8 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{value}</div>
    </Link>
  );
}
