import "next-auth";
import "next-auth/jwt";

type AppRole = "ADMIN" | "SUPPORT" | "USER";

declare module "next-auth" {
  interface User {
    id: string;
    role: AppRole;
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      passwordHash?: string | null;
      pass?: string;
      role: AppRole;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: AppRole;
  }
}
