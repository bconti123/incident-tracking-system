import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { createTicketAction } from "../actions";

export default function NewTicketPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/app/tickets"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-900 mb-4"
        >
          ← Back to Tickets
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create Ticket</h1>
      </div>

      <form action={createTicketAction} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
        <Input
          id="title"
          name="title"
          label="Title"
          required
          placeholder="Enter ticket title"
        />

        <Textarea
          id="description"
          name="description"
          label="Description"
          rows={6}
          placeholder="Describe the ticket..."
        />

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary">
            Create
          </Button>
          <Link
            href="/app/tickets"
            className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
