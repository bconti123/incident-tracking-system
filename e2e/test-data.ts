export const credentials = {
  admin: {
    email: "admin@test.com",
    password: "Password123!",
    storageState: "e2e/.auth/admin.json",
  },
  support: {
    email: "support@test.com",
    password: "Password123!",
    storageState: "e2e/.auth/support.json",
  },
  user: {
    email: "user@test.com",
    password: "Password123!",
    storageState: "e2e/.auth/user.json",
  },
} as const;

export const seededTickets = {
  userVisible: "Dark mode toggle not persisting",
  adminOnly: "RBAC permissions not enforced for admin panel",
  supportVisibleUnassigned: "Update documentation for API v2",
} as const;
