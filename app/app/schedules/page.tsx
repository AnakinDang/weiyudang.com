import { redirect } from "next/navigation";
import { OwnerSchedulesSurface } from "@/components/OwnerSchedulesSurface";
import { requireOwnerSession } from "@/lib/private/owner-session";
import { privateSchedules, scheduleControlPolicy, scheduleMetrics, scheduleRhythmLanes } from "@/lib/private/schedules";
import { isOwnerScheduleId, OWNER_SCHEDULE_PARAM, ownerScheduleHref } from "@/lib/schedule-route";
import type { OwnerScheduleId } from "@/lib/schedule-route";

export const dynamic = "force-dynamic";

type SchedulesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function scheduleFromSearchParams(params: Record<string, string | string[] | undefined> = {}): OwnerScheduleId | undefined {
  const scheduleId = firstParam(params[OWNER_SCHEDULE_PARAM]);
  return isOwnerScheduleId(scheduleId) && privateSchedules.some((schedule) => schedule.id === scheduleId) ? scheduleId : undefined;
}

function nextPathFromSearchParams(params: Record<string, string | string[] | undefined> = {}) {
  return ownerScheduleHref(scheduleFromSearchParams(params));
}

function hasInvalidScheduleParam(params: Record<string, string | string[] | undefined> = {}) {
  return Boolean(firstParam(params[OWNER_SCHEDULE_PARAM])) && !scheduleFromSearchParams(params);
}

export default async function SchedulesPage({ searchParams }: SchedulesPageProps) {
  const params = await searchParams;
  await requireOwnerSession(nextPathFromSearchParams(params));

  if (hasInvalidScheduleParam(params)) {
    redirect("/app/schedules");
  }

  const initialScheduleId = scheduleFromSearchParams(params);

  return (
    <OwnerSchedulesSurface
      initialScheduleId={initialScheduleId}
      data={{
        schedules: privateSchedules,
        metrics: scheduleMetrics,
        rhythmLanes: scheduleRhythmLanes,
        policy: scheduleControlPolicy
      }}
    />
  );
}
