import { getCurrentUser } from "@/lib/auth";

export const requireUser = async () => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}