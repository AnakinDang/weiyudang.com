import { OwnerReviewQueueSurface } from "@/components/OwnerReviewQueueSurface";
import { requireOwnerSession } from "@/lib/private/owner-session";
import { ownerReviewQueueData } from "@/lib/private/review-queue";

export const dynamic = "force-dynamic";

type ReviewPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function initialPacketFrom(params: Record<string, string | string[] | undefined>) {
  const packetId = firstParam(params.packet);
  return ownerReviewQueueData.queue.some((item) => item.id === packetId) ? packetId : undefined;
}

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  await requireOwnerSession("/app/review");
  const params = await searchParams;

  return <OwnerReviewQueueSurface data={ownerReviewQueueData} initialPacketId={initialPacketFrom(params ?? {})} />;
}
