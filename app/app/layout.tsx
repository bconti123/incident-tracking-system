import { LogoutButton } from "@/components/LogoutButton";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <LogoutButton />
      {children}
    </div>
  );
}
