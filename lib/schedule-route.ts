export const OWNER_SCHEDULE_PARAM = "schedule";

export const OWNER_SCHEDULE_IDS = ["daily-brief", "market-scan", "system-health", "weekly-review"] as const;

export type OwnerScheduleId = (typeof OWNER_SCHEDULE_IDS)[number];

export function isOwnerScheduleId(value: string | null | undefined): value is OwnerScheduleId {
  return OWNER_SCHEDULE_IDS.some((id) => id === value);
}

export function ownerScheduleHref(scheduleId?: OwnerScheduleId) {
  if (!scheduleId) {
    return "/app/schedules";
  }

  const query = new URLSearchParams({ [OWNER_SCHEDULE_PARAM]: scheduleId });
  return `/app/schedules?${query.toString()}`;
}
