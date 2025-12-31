import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function AppHome() {
  const session = await getServerSession(authOptions);

  return (
    <div style={{ padding: 24 }}>
      <h1>App</h1>
      <p>
        Logged in as: <b>{session?.user.email}</b> — role: <b>{session?.user.role}</b>
      </p>

      <ul>
        <li><Link href="/app/tickets">Tickets</Link></li>
        <li><Link href="/app/admin/users">User Management (ADMIN)</Link></li>
      </ul>
    </div>
  );
}
