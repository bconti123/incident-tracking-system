import Link from "next/link";
import { getTicketForCurrentUser, listAssignableUsers } from "../actions";
import TicketAdminForm from "./TicketAdminForm";
import { addCommentAction } from "./comments.actions";
import CommentItem from "./CommentItem";
import { getTicketTimeline } from "./timeline.actions";
import Timeline from "./Timeline";

export default async function TicketDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ system?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams ?? {};
  const showSystem = sp.system === "1";
  const timeline = await getTicketTimeline(id, showSystem);

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
        <CommentItem
          key={c.id}
          comment={c}
          currentUserId={user.id}
          currentUserRole={user.role}
        />
      ))}
    </ul>
    <div style={{ marginTop: 16 }}>
      {!showSystem ? (
        <Link href={`/app/tickets/${id}?system=1`}>Show system events</Link>
      ) : (
        <Link href={`/app/tickets/${id}`}>Hide system events</Link>
      )}
    </div>
    <Timeline items={timeline} />

    </div>
  );
}

