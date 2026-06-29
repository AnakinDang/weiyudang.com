import {
  isOwnerReviewPacketRouteId,
  OWNER_REVIEW_PACKET_PARAM,
  OWNER_REVIEW_PACKET_ROUTE_IDS,
  ownerReviewHrefFromRouteId,
  type OwnerReviewPacketRouteId
} from "./review-route-public";

export {
  isOwnerReviewPacketRouteId,
  OWNER_REVIEW_PACKET_PARAM,
  OWNER_REVIEW_PACKET_ROUTE_IDS,
  ownerReviewHrefFromRouteId,
  type OwnerReviewPacketRouteId
};

export const OWNER_REVIEW_PACKET_ROUTES = [
  { routeId: OWNER_REVIEW_PACKET_ROUTE_IDS[0], packetId: "review-private-events-surface" },
  { routeId: OWNER_REVIEW_PACKET_ROUTE_IDS[1], packetId: "review-agent-history-depth" },
  { routeId: OWNER_REVIEW_PACKET_ROUTE_IDS[2], packetId: "review-trading-boundary-copy" },
  { routeId: OWNER_REVIEW_PACKET_ROUTE_IDS[3], packetId: "review-private-api-audit" }
] as const;

export type OwnerReviewPacketId = (typeof OWNER_REVIEW_PACKET_ROUTES)[number]["packetId"];

export function isOwnerReviewPacketId(value: string | null | undefined): value is OwnerReviewPacketId {
  return OWNER_REVIEW_PACKET_ROUTES.some((route) => route.packetId === value);
}

export function ownerReviewPacketIdFromRoute(value: string | null | undefined): OwnerReviewPacketId | undefined {
  return OWNER_REVIEW_PACKET_ROUTES.find((route) => route.routeId === value)?.packetId;
}

export function ownerReviewPacketRouteId(packetId: string | null | undefined): OwnerReviewPacketRouteId | undefined {
  return OWNER_REVIEW_PACKET_ROUTES.find((route) => route.packetId === packetId)?.routeId;
}

export function ownerReviewHref(packetId?: string | null) {
  const routeId = ownerReviewPacketRouteId(packetId);

  if (!routeId) {
    return "/app/review";
  }

  const query = new URLSearchParams({ [OWNER_REVIEW_PACKET_PARAM]: routeId });
  return `/app/review?${query.toString()}`;
}
