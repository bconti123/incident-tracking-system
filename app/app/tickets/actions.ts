"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { canCreateTicket, canUpdateTicket, canViewAllTickets } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

const CreateTicketSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(5000).optional(),
});

export const createTicketAction = async (formData: FormData) => {
  const user = await requireUser();
  if (!canCreateTicket(user.role)) {
    console.error("Forbidden: user role", user.role);
    revalidatePath("/app/forbidden");
    redirect("/app/forbidden");
  };

  const parsed = CreateTicketSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) throw new Error("Invalid input");

  const ticket = await prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        ownerId: user.id,
      },
    });

    await tx.auditLog.create({
      data: {
        action: "TICKET_CREATED",
        actorId: user.id,
        ticketId: ticket.id,
        entityType: "Ticket",
        entityId: ticket.id,
        beforeJson: Prisma.JsonNull,
        afterJson: {
          title: ticket.title,
          description: ticket.description,
          status: ticket.status,
          priority: ticket.priority,
          ownerId: ticket.ownerId,
          assignedToId: ticket.assignedToId,
        },
      },
    });

    return ticket;
  });

  revalidatePath("/app/tickets");
  redirect(`/app/tickets/${ticket.id}`);
};


const UpdateTicketSchema = z.object({
  ticketId: z.string().min(1),
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "BLOCKED"]).optional(),
  assignedToId: z.string().nullable().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
});

export const updateTicketAction = async (formData: FormData) => {
  const user = await requireUser();
  if (!canUpdateTicket(user.role)) {
    console.error("Forbidden: user role", user.role);
    revalidatePath("/app/forbidden");
    redirect("/app/forbidden");
  };

  const parsed = UpdateTicketSchema.safeParse({
    ticketId: formData.get("ticketId"),
    status: (formData.get("status") as string) || undefined,
    assignedToId: (formData.get("assignedToId") as string) || null,
    priority: (formData.get("priority") as string) || undefined,
  });
  if (!parsed.success) throw new Error("Invalid input");

  const before = await prisma.ticket.findUnique({
    where: { id: parsed.data.ticketId },
    select: {
      id: true,
      status: true,
      assignedToId: true,
      priority: true,
      ownerId: true,
      title: true,
      description: true,
    },
  });

  if (!before) throw new Error("Not found");

  // If assignee is provided, ensure user exists
  if (parsed.data.assignedToId) {
    const assignee = await prisma.user.findUnique({ where: { id: parsed.data.assignedToId } });
    if (!assignee) throw new Error("Assignee not found");
  }

  const nextStatus = parsed.data.status ?? undefined;
  const nextAssignedToId =
    parsed.data.assignedToId !== undefined ? parsed.data.assignedToId : undefined;
  const nextPriority = parsed.data.priority ?? undefined;

  const statusChanged = nextStatus !== undefined && nextStatus !== before.status;
  const assigneeChanged =
    nextAssignedToId !== undefined && nextAssignedToId !== before.assignedToId;
  const priorityChanged = nextPriority !== undefined && nextPriority !== before.priority;

  await prisma.$transaction(async (tx) => {
    const updated = await tx.ticket.update({
      where: { id: before.id },
      data: {
        ...(nextStatus ? { status: nextStatus as any } : {}),
        ...(nextAssignedToId !== undefined ? { assignedToId: nextAssignedToId } : {}),
        ...(nextPriority ? { priority: nextPriority as any } : {}),
      },
      select: {
        id: true,
        status: true,
        assignedToId: true,
        priority: true,
        ownerId: true,
      },
    });

    // Status history row (only when status changes)
    if (statusChanged) {
      await tx.ticketStatusHistory.create({
        data: {
          ticketId: updated.id,
          fromStatus: before.status,
          toStatus: updated.status,
          changedById: user.id,
          reason: null,
        },
      });

      await tx.auditLog.create({
        data: {
          action: "STATUS_CHANGED",
          actorId: user.id,
          ticketId: updated.id,
          entityType: "Ticket",
          entityId: updated.id,
          beforeJson: { status: before.status },
          afterJson: { status: updated.status },
        },
      });
    }

    if (assigneeChanged) {
      await tx.auditLog.create({
        data: {
          action: "ASSIGNEE_CHANGED",
          actorId: user.id,
          ticketId: updated.id,
          entityType: "Ticket",
          entityId: updated.id,
          beforeJson: { assignedToId: before.assignedToId },
          afterJson: { assignedToId: updated.assignedToId },
        },
      });
    }

    if (priorityChanged) {
      await tx.auditLog.create({
        data: {
          action: "PRIORITY_CHANGED",
          actorId: user.id,
          ticketId: updated.id,
          entityType: "Ticket",
          entityId: updated.id,
          beforeJson: { priority: before.priority },
          afterJson: { priority: updated.priority },
        },
      });
    }

    // Optional catch-all audit entry when anything changes
    if (statusChanged || assigneeChanged || priorityChanged) {
      await tx.auditLog.create({
        data: {
          action: "TICKET_UPDATED",
          actorId: user.id,
          ticketId: updated.id,
          entityType: "Ticket",
          entityId: updated.id,
          beforeJson: {
            status: before.status,
            assignedToId: before.assignedToId,
            priority: before.priority,
          },
          afterJson: {
            status: updated.status,
            assignedToId: updated.assignedToId,
            priority: updated.priority,
          },
        },
      });
    }
  });

  revalidatePath("/app/tickets");
  revalidatePath(`/app/tickets/${before.id}`);
};


export const listTicketsForCurrentUser = async () => {
  const user = await requireUser();

  const where = canViewAllTickets(user.role) ? {} : { ownerId: user.id };

  return prisma.ticket.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { id: true, email: true } },
      assignedTo: { select: { id: true, email: true } },
    },
  });
}

export const getTicketForCurrentUser = async (ticketId: string) => {
  if (!ticketId) throw new Error("Invalid ticket ID");

  const user = await requireUser();

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      owner: { select: { id: true, email: true } },
      assignedTo: { select: { id: true, email: true } },
      statusHistory: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { changedBy: { select: { email: true } } },
      },
      audits: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { actor: { select: { email: true } } },
      },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { id: true, email: true } } },
      },
    },
  });

  if (!ticket) throw new Error("Not found");

  const allowed = canViewAllTickets(user.role) || ticket.ownerId === user.id;
  if (!allowed) {
    console.error("Forbidden: user", user.id, "ticket owner", ticket.ownerId)
    revalidatePath("/app/forbidden");
    redirect("/app/forbidden");
  }

  return { ticket, user };
}

export const listAssignableUsers = async () => {
  const user = await requireUser();
  if (user.role !== "SUPPORT" && user.role !== "ADMIN") return [];

  return prisma.user.findMany({
    orderBy: { email: "asc" },
    select: { id: true, email: true, role: true },
  });
}

