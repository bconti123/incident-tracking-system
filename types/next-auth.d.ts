import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      passwordHash?: string | null;
      pass?: string;
      role: "ADMIN" | "SUPPORT" | "USER";
    };
  }
}
