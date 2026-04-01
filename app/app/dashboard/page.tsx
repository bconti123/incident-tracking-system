import Link from "next/link";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { canViewAllTickets } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const viewAll = canViewAllTickets(user.role);

  const baseWhere: Prisma.TicketWhereInput = {};
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Signed in as <span className="font-medium">{user.email}</span> ({user.role})
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Status</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <DashboardCard title="Total" value={total} href="/app/tickets" />
            <DashboardCard title="Open" value={open} href="/app/tickets?status=OPEN" />
            <DashboardCard title="In Progress" value={inProgress} href="/app/tickets?status=IN_PROGRESS" />
            <DashboardCard title="Blocked" value={blocked} href="/app/tickets?status=BLOCKED" />
            <DashboardCard title="Resolved" value={resolved} href="/app/tickets?status=RESOLVED" />
            {viewAll && (
              <DashboardCard title="Unassigned" value={unassigned} href="/app/tickets?assignedToId=null" />
            )}
            {viewAll && (
              <DashboardCard title="Assigned to me" value={assignedToMe} href={`/app/tickets?assignedToId=${user.id}`} />
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Priority</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardCard title="Low" value={low} href="/app/tickets?priority=LOW" />
            <DashboardCard title="Medium" value={medium} href="/app/tickets?priority=MEDIUM" />
            <DashboardCard title="High" value={high} href="/app/tickets?priority=HIGH" />
            <DashboardCard title="Urgent" value={urgent} href="/app/tickets?priority=URGENT" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recently Updated</h2>
          {recent.length === 0 ? (
            <p className="text-sm text-gray-600">No tickets yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recent.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <Link href={`/app/tickets/${t.id}`} className="font-medium text-blue-600 hover:text-blue-900">
                          {t.title}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{t.status}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{t.priority}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{t.owner.email}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{t.assignedTo?.email ?? "-"}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{new Date(t.updatedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <Link href="/app/tickets" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            Go to Tickets →
          </Link>
        </div>
      </div>
    </div>
  );
}

const DashboardCard = ({ title, value, href }: { title: string; value: number; href: string }) => {
  return (
    <Link
      href={href}
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow hover:border-gray-300"
    >
      <div className="text-xs font-medium uppercase tracking-wider text-gray-600">{title}</div>
      <div className="mt-2 text-3xl font-bold text-gray-900">{value}</div>
    </Link>
  );
}
