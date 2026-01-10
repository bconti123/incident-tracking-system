import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { canViewTicket } from "@/lib/rbac";
import { redirect } from "next/navigation";

export type TimelineItem =
  | { type: "comment"; id: string; createdAt: Date; authorEmail: string; body: string }
  | { type: "status"; id: string; createdAt: Date; from?: string; to: string; actorEmail: string }
  | { type: "audit"; id: string; createdAt: Date; action: string; actorEmail: string };

export const getTicketTimeline = async (ticketId: string): Promise<TimelineItem[]> => {
  const user = await requireUser();

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { ownerId: true },
  });

  if (!ticket || !canViewTicket(user, ticket)) {
    console.warn("Forbidden ticket timeline view: user role", user.role);
    redirect("/app/forbidden");
  }

  const [comments, statusHistory, audits] = await Promise.all([
    prisma.ticketComment.findMany({
      where: { ticketId, isDeleted: false }, // keep deleted out of timeline
      orderBy: { createdAt: "asc" },
      include: { author: { select: { email: true } } },
    }),

    prisma.ticketStatusHistory.findMany({
      where: { ticketId },
      orderBy: { createdAt: "asc" },
      include: { changedBy: { select: { email: true } } },
    }),

    prisma.auditLog.findMany({
      where: {
        ticketId,
        // exclude duplicates already represented as richer items
        action: {
          notIn: ["STATUS_CHANGED", "COMMENT_ADDED", "COMMENT_EDITED", "COMMENT_DELETED"],
        },
      },
      orderBy: { createdAt: "asc" },
      include: { actor: { select: { email: true } } },
    }),
  ]);

  const timeline: TimelineItem[] = [
    ...comments.map((c) => ({
      type: "comment" as const,
      id: c.id,
      createdAt: c.createdAt,
      authorEmail: c.author.email,
      body: c.body,
    })),
    ...statusHistory.map((s) => ({
      type: "status" as const,
      id: s.id,
      createdAt: s.createdAt,
      from: s.fromStatus ?? undefined,
      to: s.toStatus,
      actorEmail: s.changedBy.email,
    })),
    ...audits.map((a) => ({
      type: "audit" as const,
      id: a.id,
      createdAt: a.createdAt,
      action: a.action,
      actorEmail: a.actor.email,
    })),
  ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  return timeline;
}
