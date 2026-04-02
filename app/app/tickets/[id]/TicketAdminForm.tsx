"use client";

import { useState } from "react";
import { updateTicketAction } from "../actions";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { Priority, Role, TicketStatus } from "@/app/generated/prisma/enums";

type UserOption = { id: string; email: string; role: Role };

export default function TicketAdminForm({
  ticketId,
  initialStatus,
  initialAssignedToId,
  initialPriority,
  users,
}: {
  ticketId: string;
  initialStatus: TicketStatus;
  initialPriority: Priority;
  initialAssignedToId: string | null;
  users: UserOption[];
}) {
  const [status, setStatus] = useState(initialStatus);
  const [assignedToId, setAssignedToId] = useState<string>(initialAssignedToId ?? "");
  const [priority, setPriority] = useState<Priority>(initialPriority);

  return (
    <form action={updateTicketAction} className="space-y-4">
      <input type="hidden" name="ticketId" value={ticketId} />

      <Select
        name="status"
        label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value as TicketStatus)}
      >
        <option value="OPEN">OPEN</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="BLOCKED">BLOCKED</option>
        <option value="RESOLVED">RESOLVED</option>
      </Select>

      <Select
        name="priority"
        label="Priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
      >
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
        <option value="URGENT">URGENT</option>
      </Select>

      <Select
        name="assignedToId"
        label="Assign To"
        value={assignedToId}
        onChange={(e) => setAssignedToId(e.target.value)}
      >
        <option value="">Unassigned</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.email} ({u.role})
          </option>
        ))}
      </Select>

      <Button type="submit" variant="primary">
        Save
      </Button>
    </form>
  );
}
