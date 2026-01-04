"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { canCreateTicket, canUpdateTicket, canViewAllTickets } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const CreateTicketSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(5000).optional(),
});

export const createTicketAction = async (formData: FormData) => {
  const user = await requireUser();
  if (!canCreateTicket(user.role)) throw new Error("Forbidden");

  const parsed = CreateTicketSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) throw new Error("Invalid input");

  await prisma.ticket.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      ownerId: user.id,
    },
  });

  revalidatePath("/app/tickets");
  redirect("/app/tickets");
}

const UpdateTicketSchema = z.object({
  ticketId: z.string().min(1),
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "BLOCKED"]).optional(),
  assignedToId: z.string().nullable().optional(),
});

export const updateTicketAction = async (formData: FormData) => {
  const user = await requireUser();
  if (!canUpdateTicket(user.role)) throw new Error("Forbidden");

  const parsed = UpdateTicketSchema.safeParse({
    ticketId: formData.get("ticketId"),
    status: formData.get("status") || undefined,
    assignedToId: (formData.get("assignedToId") as string) || null,
  });
  if (!parsed.success) throw new Error("Invalid input");

  // optional: ensure ticket exists
  const ticket = await prisma.ticket.findUnique({ where: { id: parsed.data.ticketId } });
  if (!ticket) throw new Error("Not found");
  console.log("ticket", ticket.assignedToId);
  await prisma.ticket.update({
    where: { id: parsed.data.ticketId },
    data: {
      ...(parsed.data.status ? { status: parsed.data.status as any } : {}),
      ...(parsed.data.assignedToId !== undefined ? { assignedToId: parsed.data.assignedToId } : {}),
    },
  });

  revalidatePath("/app/tickets");
  revalidatePath(`/app/tickets/${parsed.data.ticketId}`);
}

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
    },
  });

  if (!ticket) throw new Error("Not found");

  const allowed = canViewAllTickets(user.role) || ticket.ownerId === user.id;
  if (!allowed) throw new Error("Forbidden");

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
