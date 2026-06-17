import type { Metadata } from "next";
import { DoraOfficeShell } from "@/components/DoraOfficeShell";
import { StatusBadge } from "@/components/StatusBadge";
import { formatPublicEventTime, getPublicToolLabel, getRecentPublicDoraEvents } from "@/lib/dora-office";

export const metadata: Metadata = {
  title: "Doraemon Activity",
  description: "Public sanitized Doraemon Office activity timeline."
};

export default function DoraActivityPage() {
  const events = getRecentPublicDoraEvents();

  return (
    <DoraOfficeShell
      active="/dora/activity"
      title="Activity"
      summary="A newest-first public event timeline using opaque IDs, fixed titles, and safe state labels."
    >
      <div className="grid gap-3">
        {events.map((event) => {
          const toolLabel = getPublicToolLabel(event.tool_name);

          return (
            <article key={event.event_id} className="panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="mono text-xs text-slate-500">{event.event_id}</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-950">{event.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {event.agent} · {event.event_type.replaceAll("_", " ")}
                  </p>
                </div>
                <StatusBadge tone={event.severity}>{event.state}</StatusBadge>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                <span>{formatPublicEventTime(event.created_at)}</span>
                {toolLabel ? <span>tool: {toolLabel}</span> : null}
              </div>
            </article>
          );
        })}
      </div>
    </DoraOfficeShell>
  );
}
