/*
  Warnings:

  - You are about to drop the column `createdById` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_createdById_fkey";

-- DropIndex
DROP INDEX "Ticket_createdById_idx";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "createdById",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Ticket_ownerId_idx" ON "Ticket"("ownerId");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
