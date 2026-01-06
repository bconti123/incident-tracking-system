import Link from "next/link";
import { getTicketForCurrentUser, listAssignableUsers } from "../actions";
import TicketAdminForm from "./TicketAdminForm";
import { addCommentAction } from "./comments.actions";

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
      <p><b>Priority:</b> {ticket.priority ?? "-"}</p>
      <p><b>Assigned to:</b> {ticket.assignedTo?.email ?? "-"}</p>

      {canEdit && (
        <div style={{ marginTop: 24 }}>
          <h3>Support/Admin Controls</h3>
          <TicketAdminForm
            ticketId={ticket.id}
            initialStatus={ticket.status}
            initialPriority={ticket.priority}
            initialAssignedToId={ticket.assignedToId ?? null}
            users={users}
          />
        </div>
      )}

    <h3 style={{ marginTop: 24 }}>Comments</h3>

    <form action={addCommentAction} style={{ marginTop: 8 }}>
      <input type="hidden" name="ticketId" value={ticket.id} />
      <textarea name="body" style={{ width: "100%", height: 100 }} />
      <button type="submit" style={{ marginTop: 8 }}>Add comment</button>
    </form>
    
    <ul style={{ marginTop: 16 }}>
      {ticket.comments.map((c: any) => (
        <li key={c.id} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, opacity: 0.8 }}>
            {c.author.email} • {new Date(c.createdAt).toLocaleString()}
            {c.editedAt ? " (edited)" : ""}
          </div>

          <div style={{ whiteSpace: "pre-wrap" }}>
            {c.isDeleted ? <i>Comment deleted</i> : c.body}
          </div>
        </li>
      ))}
    </ul>


      <h3 style={{ marginTop: 24 }}>Status History</h3>
      <ul>
        {ticket.statusHistory.map((h: any) => (
          <li key={h.id}>
            {h.fromStatus ?? "—"} → {h.toStatus} by {h.changedBy.email}
          </li>
        ))}
      </ul>

      <h3 style={{ marginTop: 24 }}>Audit Log</h3>
      <ul>
        {ticket.audits.map((a: any) => (
          <li key={a.id}>
            {a.action} by {a.actor.email}
          </li>
        ))}
      </ul>

    </div>
  );
}

