-- DropIndex
DROP INDEX "Ticket_assignedToId_idx";

-- DropIndex
DROP INDEX "Ticket_status_priority_idx";

-- CreateIndex
CREATE INDEX "Ticket_status_priority_assignedToId_idx" ON "Ticket"("status", "priority", "assignedToId");

-- CreateIndex
CREATE INDEX "Ticket_updatedAt_idx" ON "Ticket"("updatedAt");
