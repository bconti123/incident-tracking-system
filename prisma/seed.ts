import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: { name: "Admin", role: "ADMIN", passwordHash },
    create: { email: "admin@test.com", name: "Admin", role: "ADMIN", passwordHash },
  });

  await prisma.user.upsert({
    where: { email: "support@test.com" },
    update: { name: "Support", role: "SUPPORT", passwordHash },
    create: { email: "support@test.com", name: "Support", role: "SUPPORT", passwordHash },
  });

  await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: { name: "User", role: "USER", passwordHash },
    create: { email: "user@test.com", name: "User", role: "USER", passwordHash },
  });

  console.log("✅ Seeded users: admin/support/user (Password123!)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
