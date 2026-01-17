import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { canViewAllTickets } from "@/lib/rbac";
import { listAssignableUsers } from "./actions";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

export default async function TicketsPage({ searchParams, } :
  { searchParams? : {
    q?: string;
    status?: string;
    priority?: string;
    assignedToId?: string;
    page?: string;
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

  if (sp.q) {
    where.OR = [
      { title: { contains: sp.q, mode: "insensitive" } },
      { description: { contains: sp.q, mode: "insensitive" } },
    ];
  }

  const PAGE_SIZE = 20;
  const page = Math.max(1, Number(sp.page || 1));

  const tickets = await prisma.ticket.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { email: true } },
      assignedTo: { select: { email: true } },
    },
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  const total = await prisma.ticket.count({ where });
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const canEdit = user.role === "ADMIN" || user.role === "SUPPORT";
  const users = canEdit ? await listAssignableUsers() : [];

  const errorCodes = canEdit ? await prisma.errorCode.findMany({
    orderBy: { code: "asc" },
    select: { id: true, code: true, label: true },
  }) : [];
  

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
        <p className="mt-1 text-sm text-gray-600">
          <Link href="/app/tickets/new" className="font-medium text-blue-600 hover:text-blue-900">
            Create ticket
          </Link>
        </p>
      </div>

      <form method="get" className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Input
            type="search"
            name="q"
            placeholder="Search tickets..."
            defaultValue={sp.q ?? ""}
          />
          <Select name="status" defaultValue={sp?.status ?? ""}>
            <option value="">All statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="BLOCKED">BLOCKED</option>
            <option value="RESOLVED">RESOLVED</option>
          </Select>

          <Select name="priority" defaultValue={sp?.priority ?? ""}>
            <option value="">All priorities</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </Select>

          {canEdit && (
            <Select name="assignedToId" defaultValue={sp?.assignedToId ?? ""}>
              <option value="">All assignees</option>
              <option value="null">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.email} ({u.role})
                </option>
              ))}
            </Select>
          )}

          <Button type="submit" variant="primary">
            Filter
          </Button>
        </div>
      </form>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Page {page} of {totalPages} ({total} tickets)
        </p>
        <div className="flex gap-2">
          {page > 1 && (
            <Link
              href={`/app/tickets?status=${sp.status ?? ""}&priority=${sp.priority ?? ""}&assignedToId=${sp.assignedToId ?? ""}&q=${sp.q ?? ""}&page=${page - 1}`}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 transition-colors"
            >
              ← Previous
            </Link>
          )}
          {page < totalPages && (
            <Link
              href={`/app/tickets?status=${sp.status ?? ""}&priority=${sp.priority ?? ""}&assignedToId=${sp.assignedToId ?? ""}&q=${sp.q ?? ""}&page=${page + 1}`}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 transition-colors"
            >
              Next →
            </Link>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Assigned To</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {tickets.map((t) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
