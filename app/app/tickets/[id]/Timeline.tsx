import type { TimelineItem } from "./timeline.actions";

export default function Timeline({ items }: { items: TimelineItem[] }) {
  if (items.length === 0) {
    return (
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
        <p className="text-sm text-gray-600">No activity yet.</p>
      </div>
    );
  }

  let lastDay: string | null = null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>

      <ul className="space-y-3">
        {items.map((item) => {
          const dayKey = dayLabel(item.createdAt);
          const showDayHeader = dayKey !== lastDay;
          lastDay = dayKey;

          return (
            <li key={`${item.type}-${item.id}`}>
              {showDayHeader && (
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  {dayKey}
                </div>
              )}

              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <Header item={item} />
                <Body item={item} />
                <Time ts={item.createdAt} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Header({ item }: { item: TimelineItem }) {
  return (
    <div className="font-semibold text-gray-900">
      {item.type === "comment" && "💬 Comment"}
      {item.type === "status" && "🔁 Status change"}
      {item.type === "audit" && "🧾 Audit"}
    </div>
  );
}

function Body({ item }: { item: TimelineItem }) {
  switch (item.type) {
    case "comment":
      return (
        <div className="mt-2 space-y-2">
          <div className="text-xs text-gray-600">
            {item.authorEmail}
          </div>
          <div className="whitespace-pre-wrap text-sm text-gray-700">
            {item.body}
          </div>
        </div>
      );

    case "status":
      return (
        <div className="mt-2 space-y-2">
          <div className="text-xs text-gray-600">
            {item.actorEmail}
          </div>
          <div className="text-sm text-gray-700">
            {item.from ? (
              <>
                Changed status from <span className="font-medium">{item.from}</span> to{" "}
                <span className="font-medium">{item.to}</span>
              </>
            ) : (
              <>
                Set status to <span className="font-medium">{item.to}</span>
              </>
            )}
          </div>
        </div>
      );

    case "audit":
      return (
        <div className="mt-2 space-y-2">
          <div className="text-xs text-gray-600">
            {item.actorEmail}
          </div>
          <div className="text-sm text-gray-700">
            {humanizeAudit(item.action)}
          </div>
        </div>
      );
  }
}

function Time({ ts }: { ts: Date }) {
  return (
    <div className="mt-3 border-t border-gray-200 pt-2 text-xs text-gray-500">
      {new Date(ts).toLocaleTimeString()}
    </div>
  );
}

function dayLabel(d: Date) {
  const date = new Date(d);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function humanizeAudit(action: string) {
  switch (action) {
    case "TICKET_CREATED":
      return "Created the ticket";
    case "ASSIGNEE_CHANGED":
      return "Changed assignee";
    case "PRIORITY_CHANGED":
      return "Changed priority";
    case "TICKET_UPDATED":
      return "Updated ticket";
    case "ERROR_REF_ADDED":
      return "Added error reference";
    case "ERROR_REF_REMOVED":
      return "Removed error reference";
    default:
      return action;
  }
}
