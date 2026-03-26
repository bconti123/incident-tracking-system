import { config as loadEnv } from "dotenv";

loadEnv({ override: true });

export async function getTicketIdByTitle(title: string) {
  // Playwright compiles test helpers in a CommonJS context.
  const { prisma } = require("../lib/prisma") as typeof import("../lib/prisma");

  const ticket = await prisma.ticket.findFirst({
    where: { title },
    select: { id: true },
  });

  if (!ticket) {
    throw new Error(`Seed ticket not found: ${title}`);
  }

  return ticket.id;
}
