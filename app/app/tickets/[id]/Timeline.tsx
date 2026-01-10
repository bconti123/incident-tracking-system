import type { TimelineItem } from "./timeline.actions";

export default function Timeline({ items }: { items: TimelineItem[] }) {
  if (items.length === 0) {
    return (
      <div style={{ marginTop: 24 }}>
        <h3>Timeline</h3>
        <p style={{ opacity: 0.7 }}>No activity yet.</p>
      </div>
    );
  }

  let lastDay: string | null = null;

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Timeline</h3>

      <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
        {items.map((item) => {
          const dayKey = dayLabel(item.createdAt);
          const showDayHeader = dayKey !== lastDay;
          lastDay = dayKey;

          return (
            <li key={`${item.type}-${item.id}`}>
              {showDayHeader && (
                <div
                  style={{
                    margin: "16px 0 8px",
                    fontSize: 12,
                    fontWeight: 600,
                    opacity: 0.7,
                  }}
                >
                  {dayKey}
                </div>
              )}

              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 10,
                }}
              >
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
    <div style={{ fontWeight: 600 }}>
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
        <div style={{ marginTop: 6 }}>
          <div style={{ fontSize: 12, opacity: 0.8 }}>
            {item.authorEmail}
          </div>
          <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>
            {item.body}
          </div>
        </div>
      );

    case "status":
      return (
        <div style={{ marginTop: 6 }}>
          <div style={{ fontSize: 12, opacity: 0.8 }}>
            {item.actorEmail}
          </div>
          <div style={{ marginTop: 6 }}>
            {item.from ? (
              <>
                Changed status from <b>{item.from}</b> to{" "}
                <b>{item.to}</b>
              </>
            ) : (
              <>
                Set status to <b>{item.to}</b>
              </>
            )}
          </div>
        </div>
      );

    case "audit":
      return (
        <div style={{ marginTop: 6 }}>
          <div style={{ fontSize: 12, opacity: 0.8 }}>
            {item.actorEmail}
          </div>
          <div style={{ marginTop: 6 }}>
            {humanizeAudit(item.action)}
          </div>
        </div>
      );
  }
}

function Time({ ts }: { ts: Date }) {
  return (
    <div style={{ fontSize: 11, opacity: 0.6, marginTop: 8 }}>
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
    default:
      return action;
  }
}
