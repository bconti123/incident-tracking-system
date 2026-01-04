import Link from "next/link";
import { getTicketForCurrentUser, listAssignableUsers } from "../actions";
import TicketAdminForm from "./TicketAdminForm";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { ticket, user } = await getTicketForCurrentUser(id);

  const canEdit = user.role === "ADMIN" || user.role === "SUPPORT";
  const users = canEdit ? await listAssignableUsers() : [];
  
  return (
    <div style={{ padding: 24 }}>
      <p>
        <Link href="/app/tickets">← Back</Link>
      </p>

      <h1>{ticket.title}</h1>
      <p><b>Status:</b> {ticket.status}</p>
      <p><b>Owner:</b> {ticket.owner.email}</p>
      <p><b>Assigned to:</b> {ticket.assignedTo?.email ?? "-"}</p>

      {canEdit && (
        <div style={{ marginTop: 24 }}>
          <h3>Support/Admin Controls</h3>
          <TicketAdminForm
            ticketId={ticket.id}
            initialStatus={ticket.status}
            initialAssignedToId={ticket.assignedToId ?? null}
            users={users}
          />
        </div>
      )}
    </div>
  );
}

