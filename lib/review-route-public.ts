export const OWNER_REVIEW_PACKET_PARAM = "packet";

export const OWNER_REVIEW_PACKET_ROUTE_IDS = ["rq_01", "rq_02", "rq_03", "rq_04"] as const;

export type OwnerReviewPacketRouteId = (typeof OWNER_REVIEW_PACKET_ROUTE_IDS)[number];

export function isOwnerReviewPacketRouteId(value: string | null | undefined): value is OwnerReviewPacketRouteId {
  return OWNER_REVIEW_PACKET_ROUTE_IDS.some((routeId) => routeId === value);
}

export function ownerReviewHrefFromRouteId(routeId?: string | null) {
  if (!isOwnerReviewPacketRouteId(routeId)) {
    return "/app/review";
  }

  const query = new URLSearchParams({ [OWNER_REVIEW_PACKET_PARAM]: routeId });
  return `/app/review?${query.toString()}`;
}
