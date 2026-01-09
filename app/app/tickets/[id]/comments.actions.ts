'use server'

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const AddCommentSchema = z.object({
  ticketId: z.string().min(1),
  body: z.string().min(1).max(2000),
});

export const addCommentAction = async (formData: FormData) => {
    const user = await requireUser();

    const parsed = AddCommentSchema.safeParse({
        ticketId: formData.get("ticketId"),
        body: formData.get("body"),
    });

    if (!parsed.success) throw new Error("Invalid input");

    const ticket = await prisma.ticket.findUnique({
        where: { id: parsed.data.ticketId },
        select: { id: true, ownerId: true },
    });

    if (!ticket) throw new Error("Ticket not found");

    const canComment = user.role === "ADMIN" || user.role === "SUPPORT" || ticket.ownerId === user.id;
    if (!canComment) {
        console.error("Forbidden: user role", user.role);
        revalidatePath("/app/forbidden");
        redirect("/app/forbidden");
    }

    await prisma.$transaction(async (tx) => {
        const comment = await tx.ticketComment.create({
            data: {
                ticketId: ticket.id,
                authorId: user.id,
                body: parsed.data.body,
            },
        });

        await tx.auditLog.create({
            data: {
                action: "COMMENT_ADDED",
                actorId: user.id,
                ticketId: ticket.id,
                entityType: "TicketComment",
                entityId: comment.id,
                afterJson: {
                    body: comment.body,
                    authorId: comment.authorId,
                },
            },
        });
    });

    revalidatePath(`/app/tickets/${ticket.id}`);
}

const EditCommentSchema = z.object({
    commentId: z.string().min(1),
    body: z.string().min(1).max(2000),
});

export const editCommentAction = async (formData: FormData) => {
    const user = await requireUser();

    const parsed = EditCommentSchema.safeParse({
        commentId: formData.get("commentId"),
        body: formData.get("body"),
    });

    if (!parsed.success) throw new Error("Invalid input");

    const comment = await prisma.ticketComment.findUnique({
        where: { id: parsed.data.commentId },
        select: { id: true, ticketId: true, authorId: true, body: true, isDeleted: true },
    });

    if (!comment) throw new Error("Not found");
    if (comment.isDeleted) throw new Error("Comment Deleted");

    const canEdit = user.role === "ADMIN" || comment.authorId === user.id;
    if (!canEdit) {
        console.error("Forbidden: user role", user.role);
        revalidatePath("/app/forbidden");
        redirect("/app/forbidden");
    }

    await prisma.$transaction(async (tx) => {
        await tx.ticketComment.update({
            where: { id: comment.id },
            data: { body: parsed.data.body, editedAt: new Date() },
        });

        await tx.auditLog.create({
            data: {
                action: "COMMENT_EDITED",
                actorId: user.id,
                ticketId: comment.ticketId,
                entityType: "TicketComment",
                entityId: comment.id,
                beforeJson: {
                    body: comment.body,
                },
                afterJson: {
                    body: parsed.data.body,
                },
            },
        });
    });

    revalidatePath(`/app/tickets/${comment.ticketId}`);
}

const DeletedCommentSchema = z.object({
    commentId: z.string().min(1),
});

export const deleteCommentAction = async (formData: FormData) => {
    const user = await requireUser();

    const parsed = DeletedCommentSchema.safeParse({
        commentId: formData.get("commentId"),
    });

    if (!parsed.success) throw new Error("Invalid input");

    const comment = await prisma.ticketComment.findUnique({
        where: { id: parsed.data.commentId },
        select: { id: true, ticketId: true, authorId: true, body: true, isDeleted: true },
    });

    if (!comment) throw new Error("Not found");
    if (comment.isDeleted) return; // Already deleted

    const canDelete = user.role === "ADMIN" || comment.authorId === user.id;
    if (!canDelete) {
        console.error("Forbidden: user role", user.role);
        revalidatePath("/app/forbidden");
        redirect("/app/forbidden");
    }

    await prisma.$transaction(async (tx) => {
        await tx.ticketComment.update({
            where: { id: comment.id },
            data: { isDeleted: true, deletedAt: new Date() },
        });

        await tx.auditLog.create({
            data: {
                action: "COMMENT_DELETED",
                actorId: user.id,
                ticketId: comment.ticketId,
                entityType: "TicketComment",
                entityId: comment.id,
                beforeJson: {
                    body: comment.body,
                },
            },
        });
    });

    revalidatePath(`/app/tickets/${comment.ticketId}`);
}