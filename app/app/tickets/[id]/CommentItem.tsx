"use client";

import { useState } from "react";
import { deleteCommentAction, editCommentAction } from "./comments.actions";

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
      <li style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          {comment.author.email} • {new Date(comment.createdAt).toLocaleString()}
        </div>
        <i>Comment deleted</i>
      </li>
    );
  }

  return (
    <li style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, opacity: 0.8 }}>
        {comment.author.email} • {new Date(comment.createdAt).toLocaleString()}
        {comment.editedAt ? " (edited)" : ""}
      </div>

      {!isEditing ? (
        <div style={{ whiteSpace: "pre-wrap" }}>{comment.body}</div>
      ) : (
        <form action={editCommentAction} onSubmit={() => setIsEditing(false)}>
          <input type="hidden" name="commentId" value={comment.id} />
          <textarea
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={{ width: "100%", height: 90 }}
          />
          <div style={{ marginTop: 8 }}>
            <button type="submit">Save</button>{" "}
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {canModify && !isEditing && (
        <div style={{ marginTop: 6 }}>
          <button type="button" onClick={() => setIsEditing(true)}>
            Edit
          </button>{" "}
          <form action={deleteCommentAction} style={{ display: "inline" }}>
            <input type="hidden" name="commentId" value={comment.id} />
            <button type="submit">Delete</button>
          </form>
        </div>
      )}
    </li>
  );
}
