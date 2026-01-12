import { LogoutButton } from "@/components/LogoutButton";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h3><Link href="/app">Home</Link></h3>
      <LogoutButton />
      {children}
    </div>
  );
}
