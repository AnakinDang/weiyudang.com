import { OwnerSchedulesSurface } from "@/components/OwnerSchedulesSurface";
import { requireOwnerSession } from "@/lib/private/owner-session";
import { privateSchedules, scheduleControlPolicy, scheduleMetrics, scheduleRhythmLanes } from "@/lib/private/schedules";

export const dynamic = "force-dynamic";

export default async function SchedulesPage() {
  await requireOwnerSession("/app/schedules");

  return (
    <OwnerSchedulesSurface
      data={{
        schedules: privateSchedules,
        metrics: scheduleMetrics,
        rhythmLanes: scheduleRhythmLanes,
        policy: scheduleControlPolicy
      }}
    />
  );
}
