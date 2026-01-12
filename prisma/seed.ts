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

  await prisma.errorCode.upsert({
  where: { code: 401 },
  update: {
    label: "Unauthorized",
    suggestedFix: "Verify authentication / session token",
  },
  create: {
    code: 401,
    label: "Unauthorized",
    description: "Request lacks valid authentication credentials.",
    suggestedFix: "Verify authentication / session token",
  },
  });

  await prisma.errorCode.upsert({
    where: { code: 403 },
    update: {
      label: "Forbidden",
      suggestedFix: "Verify RBAC / permissions",
    },
    create: {
      code: 403,
      label: "Forbidden",
      description: "Authenticated but not allowed to access resource.",
      suggestedFix: "Verify RBAC / permissions",
    },
  });

  await prisma.errorCode.upsert({
    where: { code: 404 },
    update: {
      label: "Not Found",
      suggestedFix: "Verify route/resource ID",
    },
    create: {
      code: 404,
      label: "Not Found",
      description: "Resource does not exist or is not visible to requester.",
      suggestedFix: "Verify route/resource ID",
    },
  });

  await prisma.errorCode.upsert({
    where: { code: 500 },
    update: {
      label: "Internal Server Error",
      suggestedFix: "Check server logs; reproduce with consistent inputs",
    },
    create: {
      code: 500,
      label: "Internal Server Error",
      description: "Unexpected server error.",
      suggestedFix: "Check server logs; reproduce with consistent inputs",
    },
  });
  console.log("✅ Seeded error codes: 401, 403, 404, 500");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
