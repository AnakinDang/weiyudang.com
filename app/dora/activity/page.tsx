import type { Metadata } from "next";
import { DoraOfficeShell } from "@/components/DoraOfficeShell";
import { ActivityFeed } from "@/app/dora/activity/ActivityFeed";
import { getRecentPublicDoraEvents } from "@/lib/dora-office";

export const metadata: Metadata = {
  title: "Doraemon Activity",
  description: "Public sanitized Doraemon Office activity timeline."
};

export default function DoraActivityPage() {
  const events = getRecentPublicDoraEvents().map(({ event_id: _eventId, ...event }) => event);

  return (
    <DoraOfficeShell
      active="/dora/activity"
      title="Activity"
      summary="Newest-first public activity with filters by event kind, agent, severity, and safe time window."
      showBoundaryStrip={false}
    >
      <ActivityFeed events={events} />
    </DoraOfficeShell>
  );
}
