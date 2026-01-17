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

  // ============================================
  // SEED TICKETS
  // ============================================

  // Fetch users
  const adminUser = await prisma.user.findUnique({ where: { email: "admin@test.com" } });
  const supportUser = await prisma.user.findUnique({ where: { email: "support@test.com" } });
  const normalUser = await prisma.user.findUnique({ where: { email: "user@test.com" } });

  if (!adminUser || !supportUser || !normalUser) {
    throw new Error("Users not found after creation");
  }

  // Clear existing tickets for fresh seeding
  await prisma.ticket.deleteMany({});

  // Create sample tickets with various statuses, priorities, and assignments
  const tickets = [
    {
      title: "Login page not responding on mobile",
      description:
        "Users report the login page is slow or unresponsive when accessing from mobile devices. Need to investigate performance issues and optimize for mobile.",
      status: "IN_PROGRESS" as const,
      priority: "HIGH" as const,
      ownerId: normalUser.id,
      assignedToId: supportUser.id,
      externalRef: "INC-000001",
    },
    {
      title: "Database connection timeout during peak hours",
      description:
        "Database connections are timing out when traffic exceeds 1000 concurrent users. Need to review connection pool settings and optimize queries.",
      status: "BLOCKED" as const,
      priority: "URGENT" as const,
      ownerId: supportUser.id,
      assignedToId: adminUser.id,
      externalRef: "INC-000002",
    },
    {
      title: "Fix typo in privacy policy",
      description:
        "There is a grammatical error in section 3.2 of the privacy policy. Update the text for clarity.",
      status: "RESOLVED" as const,
      priority: "LOW" as const,
      ownerId: adminUser.id,
      assignedToId: normalUser.id,
      externalRef: "INC-000003",
    },
    {
      title: "RBAC permissions not enforced for admin panel",
      description:
        "Users with USER role can access admin panel pages they shouldn't have access to. Security issue that needs immediate attention.",
      status: "OPEN" as const,
      priority: "URGENT" as const,
      ownerId: adminUser.id,
      assignedToId: adminUser.id,
      externalRef: "INC-000004",
    },
    {
      title: "Email notifications not being sent",
      description:
        "Users are not receiving email notifications for ticket updates. Check email service integration and logs.",
      status: "IN_PROGRESS" as const,
      priority: "HIGH" as const,
      ownerId: supportUser.id,
      assignedToId: supportUser.id,
      externalRef: "INC-000005",
    },
    {
      title: "Dark mode toggle not persisting",
      description:
        "When users enable dark mode, it doesn't persist across page refreshes or sessions.",
      status: "OPEN" as const,
      priority: "MEDIUM" as const,
      ownerId: normalUser.id,
      assignedToId: null,
      externalRef: "INC-000006",
    },
    {
      title: "API endpoint returning 500 on bulk operations",
      description:
        "The bulk ticket update endpoint returns 500 error when processing more than 50 tickets at once. Need to optimize for batch operations.",
      status: "IN_PROGRESS" as const,
      priority: "HIGH" as const,
      ownerId: adminUser.id,
      assignedToId: supportUser.id,
      externalRef: "INC-000007",
    },
    {
      title: "404 error on attachment downloads",
      description:
        "Users report getting 404 errors when trying to download ticket attachments. Storage issue or incorrect file path reference.",
      status: "BLOCKED" as const,
      priority: "MEDIUM" as const,
      ownerId: normalUser.id,
      assignedToId: adminUser.id,
      externalRef: "INC-000008",
    },
    {
      title: "Update documentation for API v2",
      description:
        "Create comprehensive documentation for the new API v2 endpoints, including examples and best practices.",
      status: "OPEN" as const,
      priority: "MEDIUM" as const,
      ownerId: supportUser.id,
      assignedToId: null,
      externalRef: "INC-000009",
    },
    {
      title: "Implement rate limiting for API",
      description:
        "Add rate limiting to API endpoints to prevent abuse and ensure fair resource allocation.",
      status: "OPEN" as const,
      priority: "MEDIUM" as const,
      ownerId: adminUser.id,
      assignedToId: adminUser.id,
      externalRef: "INC-000010",
    },
    {
      title: "Search functionality broken after deployment",
      description:
        "Full-text search stopped working after the latest deployment. Check Elasticsearch connection and indexing.",
      status: "IN_PROGRESS" as const,
      priority: "URGENT" as const,
      ownerId: supportUser.id,
      assignedToId: supportUser.id,
      externalRef: "INC-000011",
    },
    {
      title: "Memory leak in background worker",
      description:
        "Background worker process is consuming increasing memory over time. Memory usage triples after 24 hours of operation.",
      status: "OPEN" as const,
      priority: "HIGH" as const,
      ownerId: adminUser.id,
      assignedToId: null,
      externalRef: "INC-000012",
    },
    {
      title: "Add multi-language support",
      description:
        "Implement internationalization (i18n) to support Spanish, French, and German in addition to English.",
      status: "RESOLVED" as const,
      priority: "LOW" as const,
      ownerId: normalUser.id,
      assignedToId: normalUser.id,
      externalRef: "INC-000013",
    },
    {
      title: "SSL certificate expiring in 7 days",
      description:
        "SSL certificate for api.example.com will expire on 2026-01-24. Need to renew before expiration.",
      status: "OPEN" as const,
      priority: "URGENT" as const,
      ownerId: adminUser.id,
      assignedToId: adminUser.id,
      externalRef: "INC-000014",
    },
    {
      title: "Optimize database indices for reports",
      description:
        "Monthly report generation is taking over 10 minutes. Need to analyze and optimize database queries and indices.",
      status: "OPEN" as const,
      priority: "MEDIUM" as const,
      ownerId: supportUser.id,
      assignedToId: null,
      externalRef: "INC-000015",
    },
  ];

  const createdTickets: {
    id: string;
    title: string;
    status: string;
    priority: string;
    externalRef: string | null;
  }[] = [];
  for (const ticket of tickets) {
    const created = await prisma.ticket.create({
      data: ticket,
    });
    createdTickets.push(created);
  }

  console.log(`✅ Seeded ${createdTickets.length} tickets`);

  // Link tickets to error codes for demonstration
  const errorCode401 = await prisma.errorCode.findUnique({ where: { code: 401 } });
  const errorCode404 = await prisma.errorCode.findUnique({ where: { code: 404 } });
  const errorCode500 = await prisma.errorCode.findUnique({ where: { code: 500 } });

  if (errorCode401) {
    await prisma.ticketErrorRef.upsert({
      where: {
        ticketId_errorCodeId: {
          ticketId: createdTickets[0].id,
          errorCodeId: errorCode401.id,
        },
      },
      update: { note: "Mobile login authentication failing" },
      create: {
        ticketId: createdTickets[0].id,
        errorCodeId: errorCode401.id,
        addedById: adminUser.id,
        note: "Mobile login authentication failing",
      },
    });
  }

  if (errorCode500) {
    await prisma.ticketErrorRef.upsert({
      where: {
        ticketId_errorCodeId: {
          ticketId: createdTickets[6].id,
          errorCodeId: errorCode500.id,
        },
      },
      update: { note: "Bulk operation API endpoint failure" },
      create: {
        ticketId: createdTickets[6].id,
        errorCodeId: errorCode500.id,
        addedById: adminUser.id,
        note: "Bulk operation API endpoint failure",
      },
    });
  }

  if (errorCode404) {
    await prisma.ticketErrorRef.upsert({
      where: {
        ticketId_errorCodeId: {
          ticketId: createdTickets[7].id,
          errorCodeId: errorCode404.id,
        },
      },
      update: { note: "File storage path not found" },
      create: {
        ticketId: createdTickets[7].id,
        errorCodeId: errorCode404.id,
        addedById: adminUser.id,
        note: "File storage path not found",
      },
    });
  }

  console.log("✅ Linked error codes to tickets");

  // Add some status history entries for demonstration
  const urgentBlockedTicket = createdTickets.find((t) => t.status === "BLOCKED" && t.externalRef === "INC-000008");
  if (urgentBlockedTicket) {
    await prisma.ticketStatusHistory.create({
      data: {
        ticketId: urgentBlockedTicket.id,
        fromStatus: "OPEN",
        toStatus: "BLOCKED",
        changedById: adminUser.id,
        reason: "Blocked on infrastructure team to investigate storage issue",
      },
    });
  }

  console.log("✅ Added status history entries");

  // Add sample comments to tickets
  const inProgressTickets = createdTickets.filter((t) => t.status === "IN_PROGRESS");
  for (const ticket of inProgressTickets.slice(0, 2)) {
    await prisma.ticketComment.create({
      data: {
        ticketId: ticket.id,
        authorId: supportUser.id,
        body: "Started investigating the issue. Initial findings suggest database query optimization is needed.",
      },
    });

    await prisma.ticketComment.create({
      data: {
        ticketId: ticket.id,
        authorId: adminUser.id,
        body: "Good catch. Let's run the profiler on the queries. Also check if we need to add more indices.",
      },
    });
  }

  console.log("✅ Added sample comments to tickets");

  // Summary
  console.log("\n📊 Database Seed Complete!");
  console.log(`  - OPEN: ${createdTickets.filter((t) => t.status === "OPEN").length}`);
  console.log(`  - IN_PROGRESS: ${createdTickets.filter((t) => t.status === "IN_PROGRESS").length}`);
  console.log(`  - BLOCKED: ${createdTickets.filter((t) => t.status === "BLOCKED").length}`);
  console.log(`  - RESOLVED: ${createdTickets.filter((t) => t.status === "RESOLVED").length}`);
  console.log(`\n  - URGENT: ${createdTickets.filter((t) => t.priority === "URGENT").length}`);
  console.log(`  - HIGH: ${createdTickets.filter((t) => t.priority === "HIGH").length}`);
  console.log(`  - MEDIUM: ${createdTickets.filter((t) => t.priority === "MEDIUM").length}`);
  console.log(`  - LOW: ${createdTickets.filter((t) => t.priority === "LOW").length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
