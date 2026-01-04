import Link from "next/link";
import { listTicketsForCurrentUser } from "./actions";

export default async function TicketsPage() {
  const tickets = await listTicketsForCurrentUser();

  return (
    <div style={{ padding: 24 }}>
      <h1>Tickets</h1>
      <p><Link href="/app/tickets/new">Create ticket</Link></p>

      <table style={{ width: "100%", marginTop: 12 }}>
        <thead>
          <tr>
            <th align="left">Title</th>
            <th align="left">Status</th>
            <th align="left">Owner</th>
            <th align="left">Assignee</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(t => (
            <tr key={t.id}>
              <td><Link href={`/app/tickets/${t.id}`}>{t.title}</Link></td>
              <td>{t.status}</td>
              <td>{t.owner.email}</td>
              <td>{t.priority ?? "-"}</td>
              <td>{t.assignedTo?.email ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
