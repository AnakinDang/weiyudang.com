"use client";

import { useMemo } from "react";
import { Clock3 } from "lucide-react";
import type { PublicDoraEventClientView } from "@/lib/dora-public-client";
import { formatPublicEventTime } from "@/lib/dora-public-format";
import { activityModeLabel, displayEvents, useDoraLiveEvents, visibleLiveEvents } from "@/lib/use-dora-live";

type DoraEntryActivityPreviewProps = {
  fallbackEvents: PublicDoraEventClientView[];
};

// Public Doraemon entry preview. Reuses the shared live-relay client so the
// front door tells the truth about whether the office is live or replaying a
// sanitized demo snapshot. Falls back to the server-projected demo events.
export function DoraEntryActivityPreview({ fallbackEvents }: DoraEntryActivityPreviewProps) {
  const live = useDoraLiveEvents();
  const events = useMemo(
    () => displayEvents(live.events, fallbackEvents).slice(0, 5),
    [fallbackEvents, live.events]
  );
  const hasVisibleLiveActivity = useMemo(() => visibleLiveEvents(live.events).length > 0, [live.events]);
  const activityMode = activityModeLabel(live.connection, live.events, hasVisibleLiveActivity);
  const sourceLabel = hasVisibleLiveActivity ? "Live activity · public-safe" : "Demo activity · public-safe";

  return (
    <div className="doraemon-activity-preview" role="group" aria-label="Recent public-safe Doraemon activity">
      <div
        className={
          hasVisibleLiveActivity ? "doraemon-activity-preview-head is-live" : "doraemon-activity-preview-head"
        }
      >
        <span>
          <Clock3 size={14} aria-hidden />
          {sourceLabel}
        </span>
        <small>{activityMode}</small>
      </div>
      <div className="doraemon-activity-ticks">
        {events.map((event) => (
          <div
            key={event.event_id}
            className={`doraemon-activity-tick doraemon-activity-tick-${event.severity}`}
          >
            <time dateTime={event.created_at}>{formatPublicEventTime(event.created_at)}</time>
            <strong>{event.agent}</strong>
            <span>{event.title}</span>
          </div>
        ))}
      </div>
      <div className="sr-only" aria-live="polite">
        {hasVisibleLiveActivity
          ? "Doraemon Office is showing live public activity."
          : "Doraemon Office is showing a public-safe demo snapshot."}
      </div>
    </div>
  );
}
