import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

const main = async () => {
  const password = await bcrypt.hash("Password123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: { email: "admin@test.com", name: "Admin", role: "ADMIN", passwordHash: password },
  });

  await prisma.user.upsert({
    where: { email: "support@test.com" },
    update: {},
    create: { email: "support@test.com", name: "Support", role: "SUPPORT", passwordHash: password },
  });

  await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: { email: "user@test.com", name: "User", role: "USER", passwordHash: password },
  });

  console.log("Seeded users: admin/support/user with Password123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
