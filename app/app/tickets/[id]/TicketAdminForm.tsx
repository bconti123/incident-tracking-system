"use client";

import { useState } from "react";
import { updateTicketAction } from "../actions";

type UserOption = { id: string; email: string; role: string };

export default function TicketAdminForm({
  ticketId,
  initialStatus,
  initialAssignedToId,
  users,
}: {
  ticketId: string;
  initialStatus: "OPEN" | "IN_PROGRESS" | "BLOCKED" | "RESOLVED";
  initialAssignedToId: string | null;
  users: UserOption[];
}) {
  const [status, setStatus] = useState(initialStatus);
  const [assignedToId, setAssignedToId] = useState<string>(initialAssignedToId ?? "");
  console.log("assignedToId", assignedToId);
  return (
    <form action={updateTicketAction} style={{ marginTop: 16 }}>
      <input type="hidden" name="ticketId" value={ticketId} />

      <div style={{ marginTop: 8 }}>
        <label>Status</label>
        <br />
        <select name="status" value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="BLOCKED">BLOCKED</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Assign to</label>
        <br />
        <select
          name="assignedToId"
          value={assignedToId}
          onChange={(e) => setAssignedToId(e.target.value)}
        >
          <option value="">Unassigned</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.email} ({u.role})
            </option>
          ))}
        </select>
      </div>

      <button type="submit" style={{ marginTop: 16 }}>
        Save
      </button>
    </form>
  );
}
