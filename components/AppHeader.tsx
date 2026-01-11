"use client";

import { usePathname } from "next/navigation";
import { LogoutButton } from "./LogoutButton";

export const AppHeader = () => {
  const pathname = usePathname();

  if (pathname !== "/app") return null;

  return <LogoutButton />;
}
