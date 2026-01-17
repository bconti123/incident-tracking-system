import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function AppHome() {
  const session = await getServerSession(authOptions);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Welcome {session?.user.name},</h1>
        <p className="text-sm text-muted-foreground">
          Logged in as <b>{session?.user.email}</b> — role{" "}
          <b>{session?.user.role}</b>
        </p>
      </header>

      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/app/dashboard" className="underline">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/app/tickets" className="underline">
              Tickets
            </Link>
          </li>

          {session?.user.role === "ADMIN" && (
            <li className="opacity-60">
              User Management (under development)
            </li>
          )}
        </ul>
      </nav>
    </section>
  );
}