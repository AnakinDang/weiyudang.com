import { events } from "@/lib/mock";
import { StatusBadge } from "@/components/StatusBadge";

const tone = {
  normal: "normal",
  info: "info",
  warning: "warning",
  error: "danger",
  critical: "danger"
} as const;

export function Timeline({ compact = false }: { compact?: boolean }) {
  return (
    <div className="space-y-3">
      {events.slice(0, compact ? 3 : events.length).map((event) => (
        <article key={event.event_id} className="panel-quiet p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="mono text-xs text-slate-500">{event.event_id}</p>
              <h3 className="mt-1 font-semibold text-white">{event.message_short}</h3>
            </div>
            <StatusBadge tone={tone[event.severity]}>{event.state}</StatusBadge>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
            <span>{event.agent_role}</span>
            <span>{event.agent_id}</span>
            <span>{event.started_at}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
