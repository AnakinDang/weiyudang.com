import { OwnerReviewQueueSurface } from "@/components/OwnerReviewQueueSurface";
import { requireOwnerSession } from "@/lib/private/owner-session";
import { ownerReviewQueueData } from "@/lib/private/review-queue";
import {
  isOwnerReviewPacketRouteId,
  OWNER_REVIEW_PACKET_PARAM,
  ownerReviewHref,
  ownerReviewHrefFromRouteId,
  ownerReviewPacketIdFromRoute
} from "@/lib/review-route";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type ReviewPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const params = await searchParams;
  const packetRouteId = firstParam(params?.[OWNER_REVIEW_PACKET_PARAM]);
  const validPacketRouteId = isOwnerReviewPacketRouteId(packetRouteId) ? packetRouteId : undefined;
  const initialPacketId = ownerReviewPacketIdFromRoute(validPacketRouteId);

  await requireOwnerSession(ownerReviewHrefFromRouteId(validPacketRouteId));

  if (packetRouteId && !validPacketRouteId) {
    redirect(ownerReviewHref());
  }

  return <OwnerReviewQueueSurface data={ownerReviewQueueData} initialPacketId={initialPacketId} />;
}
