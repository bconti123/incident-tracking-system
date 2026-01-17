import Link from "next/link";
import { getTicketForCurrentUser, listAssignableUsers } from "../actions";
import TicketAdminForm from "./TicketAdminForm";
import { addCommentAction } from "./comments.actions";
import CommentItem from "./CommentItem";
import { getTicketTimeline } from "./timeline.actions";
import Timeline from "./Timeline";
import { prisma } from "@/lib/prisma";
import { ErrorCodeItem } from "./ErrorCodeItem";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

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
  
  const errorCodes = canEdit
  ? await prisma.errorCode.findMany({
      orderBy: { code: "asc" },
      select: { id: true, code: true, label: true },
    })
  : [];


  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/app/tickets"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-900 mb-4"
        >
          ← Back to Tickets
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{ticket.title}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">Status</p>
                <p className="mt-1 text-lg font-medium text-gray-900">{ticket.status}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">Priority</p>
                <p className="mt-1 text-lg font-medium text-gray-900">{ticket.priority ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">Owner</p>
                <p className="mt-1 text-sm text-gray-900">{ticket.owner.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-600">Assigned To</p>
                <p className="mt-1 text-sm text-gray-900">{ticket.assignedTo?.email ?? "-"}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
              <p className="whitespace-pre-wrap text-sm text-gray-600">{ticket.description}</p>
            </div>
          </div>

          {canEdit && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Support/Admin Controls</h3>
              <TicketAdminForm
                ticketId={ticket.id}
                initialStatus={ticket.status}
                initialPriority={ticket.priority}
                initialAssignedToId={ticket.assignedToId ?? null}
                users={users}
              />
            </div>
          )}

          <ErrorCodeItem canEdit={canEdit} ticket={ticket} errorCodes={errorCodes} />

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>

            <form action={addCommentAction} className="mb-6 space-y-3">
              <input type="hidden" name="ticketId" value={ticket.id} />
              <Textarea
                name="body"
                rows={4}
                placeholder="Add a comment..."
              />
              <Button type="submit" variant="primary">
                Add Comment
              </Button>
            </form>

            <div className="space-y-4 border-t border-gray-200 pt-4">
              {ticket.comments.map((c: any) => (
                <CommentItem
                  key={c.id}
                  comment={c}
                  currentUserId={user.id}
                  currentUserRole={user.role}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            {!showSystem ? (
              <Link
                href={`/app/tickets/${id}?system=1`}
                className="text-sm font-medium text-blue-600 hover:text-blue-900"
              >
                Show system events
              </Link>
            ) : (
              <Link
                href={`/app/tickets/${id}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-900"
              >
                Hide system events
              </Link>
            )}
          </div>
          <Timeline items={timeline} />
        </div>
      </div>
    </div>
  );
}

