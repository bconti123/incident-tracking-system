import { config as loadEnv } from "dotenv";
import { prisma } from "../lib/prisma";

loadEnv({ override: true, quiet: true });

async function main() {
  const title = process.argv[2];

  if (!title) {
    throw new Error("A ticket title argument is required.");
  }

  const ticket = await prisma.ticket.findFirst({
    where: { title },
    select: { id: true },
  });

  if (!ticket) {
    throw new Error(`Seed ticket not found: ${title}`);
  }

  process.stdout.write(ticket.id);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
