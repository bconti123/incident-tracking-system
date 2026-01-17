"use client";

import { useState } from "react";
import { deleteCommentAction, editCommentAction } from "./comments.actions";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export default function CommentItem({
  comment,
  currentUserId,
  currentUserRole,
}: {
  comment: any;
  currentUserId: string;
  currentUserRole: "ADMIN" | "SUPPORT" | "USER";
}) {
  const canModify = currentUserRole === "ADMIN" || comment.authorId === currentUserId;

  const [isEditing, setIsEditing] = useState(false);
  const [body, setBody] = useState(comment.body ?? "");

  if (comment.isDeleted) {
    return (
      <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-600">
            {comment.author.email} • {new Date(comment.createdAt).toLocaleString()}
          </div>
        </div>
        <p className="mt-2 italic text-gray-500">Comment deleted</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs text-gray-600">
          {comment.author.email} • {new Date(comment.createdAt).toLocaleString()}
          {comment.editedAt ? <span className="ml-2 text-gray-500">(edited)</span> : ""}
        </div>
      </div>

      {!isEditing ? (
        <div className="whitespace-pre-wrap text-sm text-gray-900">{comment.body}</div>
      ) : (
        <form action={editCommentAction} onSubmit={() => setIsEditing(false)} className="space-y-2">
          <input type="hidden" name="commentId" value={comment.id} />
          <Textarea
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Save
            </Button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {canModify && !isEditing && (
        <div className="mt-3 flex gap-2 border-t border-gray-200 pt-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-xs font-medium text-blue-600 hover:text-blue-900"
          >
            Edit
          </button>
          <form action={deleteCommentAction} className="inline">
            <input type="hidden" name="commentId" value={comment.id} />
            <button
              type="submit"
              className="text-xs font-medium text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
