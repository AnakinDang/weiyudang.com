export const OWNER_SYSTEM_SERVICE_PARAM = "service";

export const OWNER_SYSTEM_SERVICE_IDS = [
  "owner-auth-gate",
  "doraemon-public-boundary",
  "event-freshness",
  "review-queue-health",
  "command-runtime",
  "trading-execution"
] as const;

export type OwnerSystemServiceId = (typeof OWNER_SYSTEM_SERVICE_IDS)[number];

export function isOwnerSystemServiceId(value: string | null | undefined): value is OwnerSystemServiceId {
  return OWNER_SYSTEM_SERVICE_IDS.some((id) => id === value);
}

export function ownerSystemHref(serviceId?: OwnerSystemServiceId) {
  if (!serviceId) {
    return "/app/system";
  }

  const query = new URLSearchParams({ [OWNER_SYSTEM_SERVICE_PARAM]: serviceId });
  return `/app/system?${query.toString()}`;
}
