import Link from "next/link";
import { createTicketAction } from "../actions";

export default function NewTicketPage() {
  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <p><Link href="/app/tickets">← Back</Link></p>
      <h1>Create Ticket</h1>

      <form action={createTicketAction}>
        <label>Title</label>
        <input
          name="title"
          required
          style={{ width: "100%", marginTop: 4 }}
        />

        <label style={{ display: "block", marginTop: 12 }}>
          Description
        </label>
        <textarea
          name="description"
          style={{ width: "100%", height: 160 }}
        />

        <button type="submit" style={{ marginTop: 16 }} href="/app/tickets">
          Create
        </button>
      </form>
    </div>
  );
}
