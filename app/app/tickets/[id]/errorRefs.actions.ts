"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { canUpdateTicket } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@/app/generated/prisma/client";

const AddErrorRefSchema = z.object({
  ticketId: z.string().min(1),
  errorCodeId: z.string().min(1),
  note: z.string().max(500).optional().nullable(),
});

const RemoveErrorRefSchema = z.object({
  ticketId: z.string().min(1),
  errorRefId: z.string().min(1),
});

export async function addErrorRefAction(formData: FormData) {
  const user = await requireUser();
  if (!canUpdateTicket(user.role)) redirect("/app/forbidden");

  const parsed = AddErrorRefSchema.safeParse({
    ticketId: formData.get("ticketId"),
    errorCodeId: formData.get("errorCodeId"),
    note: (formData.get("note") as string) || null,
  });
  if (!parsed.success) throw new Error("Invalid input");

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const ref = await tx.ticketErrorRef.create({
      data: {
        ticketId: parsed.data.ticketId,
        errorCodeId: parsed.data.errorCodeId,
        addedById: user.id,
        note: parsed.data.note ?? null,
      },
      include: { errorCode: true },
    });

    await tx.auditLog.create({
      data: {
        action: "ERROR_REF_ADDED",
        actorId: user.id,
        ticketId: parsed.data.ticketId,
        entityType: "TicketErrorRef",
        entityId: ref.id,
        beforeJson: Prisma.JsonNull,
        afterJson: {
          errorCodeId: ref.errorCodeId,
          code: ref.errorCode.code,
          label: ref.errorCode.label,
          note: ref.note,
        },
      },
    });
  });

  revalidatePath(`/app/tickets/${parsed.data.ticketId}`);
}

export async function removeErrorRefAction(formData: FormData) {
  const user = await requireUser();
  if (!canUpdateTicket(user.role)) redirect("/app/forbidden");

  const parsed = RemoveErrorRefSchema.safeParse({
    ticketId: formData.get("ticketId"),
    errorRefId: formData.get("errorRefId"),
  });
  if (!parsed.success) throw new Error("Invalid input");

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const before = await tx.ticketErrorRef.findUnique({
      where: { id: parsed.data.errorRefId },
      include: { errorCode: true },
    });
    if (!before) throw new Error("Not found");

    await tx.ticketErrorRef.delete({ where: { id: parsed.data.errorRefId } });

    await tx.auditLog.create({
      data: {
        action: "ERROR_REF_REMOVED",
        actorId: user.id,
        ticketId: parsed.data.ticketId,
        entityType: "TicketErrorRef",
        entityId: parsed.data.errorRefId,
        beforeJson: {
          errorCodeId: before.errorCodeId,
          code: before.errorCode.code,
          label: before.errorCode.label,
          note: before.note,
        },
        afterJson: Prisma.JsonNull,
      },
    });
  });

  revalidatePath(`/app/tickets/${parsed.data.ticketId}`);
}
