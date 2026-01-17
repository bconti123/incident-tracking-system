import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";
import { Container } from "@/components/ui/Container";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <Container size="xl" className="flex items-center justify-between py-4">
          <Link href="/app" className="text-lg font-semibold">
            Incident Tracking System
          </Link>
          <LogoutButton />
        </Container>
      </header>

      <main>
        <Container size="xl" className="py-6">
          <aside>{/* nav */}</aside>
          {children}
        </Container>
      </main>
    </div>
  );
}