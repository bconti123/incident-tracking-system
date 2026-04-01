import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import Link from "next/link";

export default async function AppHome() {
  const session = await getServerSession(authOptions);

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Welcome {session?.user.name},</h1>
        <p className="text-sm text-gray-600">
          Logged in as <span className="font-medium">{session?.user.email}</span> — role{" "}
          <span className="font-medium">{session?.user.role}</span>
        </p>
      </header>

      <nav className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h2>
        <ul className="space-y-3">
          <li>
            <Link
              href="/app/dashboard"
              className="inline-flex items-center rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
            >
              → Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/app/tickets"
              className="inline-flex items-center rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
            >
              → Tickets
            </Link>
          </li>

          {session?.user.role === "ADMIN" && (
            <li className="pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-500">User Management (under development)</p>
            </li>
          )}
        </ul>
      </nav>
    </section>
  );
}
