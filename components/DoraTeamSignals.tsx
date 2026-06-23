"use client";

import { useMemo } from "react";
import type { PublicDoraEventClientView } from "@/lib/dora-public-client";
import { formatPublicEventTime } from "@/lib/dora-public-format";
import { activityModeLabel, displayEvents, useDoraLiveEvents, visibleLiveEvents } from "@/lib/use-dora-live";

type DoraTeamSignalsProps = {
  fallbackSignals: PublicDoraEventClientView[];
};

// Public team recent-activity strip. Reuses the shared live-relay client so the
// team page's recent signals reflect real relay state (live/demo), consistent
// with /dora, /dora/office, and /dora/activity. The roster itself stays a
// public-safe demo baseline — live per-agent state needs the relay registry,
// which the public client does not consume yet.
export function DoraTeamSignals({ fallbackSignals }: DoraTeamSignalsProps) {
  const live = useDoraLiveEvents();
  const hasVisibleLiveActivity = useMemo(() => visibleLiveEvents(live.events).length > 0, [live.events]);
  const signals = useMemo(
    () => displayEvents(live.events, fallbackSignals).slice(0, 5),
    [fallbackSignals, live.events]
  );
  const activityMode = activityModeLabel(live.connection, live.events, hasVisibleLiveActivity);

  return (
    <section
      className={
        hasVisibleLiveActivity
          ? "dora-office-live-strip dora-team-landing-activity-strip dora-team-signals"
          : "dora-office-live-strip dora-team-landing-activity-strip dora-team-signals is-demo"
      }
      aria-label="Recent public-safe MiniDora team activity"
    >
      <div>
        <span aria-hidden />
        <strong>Recent public team signals</strong>
        <small>{activityMode}</small>
      </div>
      <ol>
        {signals.map((event) => (
          <li key={event.event_id}>
            <time dateTime={event.created_at}>{formatPublicEventTime(event.created_at)}</time>
            <strong>{event.agent}</strong>
            <span>{event.title}</span>
          </li>
        ))}
      </ol>
      <p className="sr-only" aria-live="polite">
        {hasVisibleLiveActivity
          ? "Doraemon team is showing live public signals."
          : "Doraemon team is showing a public-safe demo snapshot."}
      </p>
    </section>
  );
}
