import { OwnerReviewQueueSurface } from "@/components/OwnerReviewQueueSurface";
import { requireOwnerSession } from "@/lib/private/owner-session";
import { ownerReviewQueueData } from "@/lib/private/review-queue";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  await requireOwnerSession("/app/review");

  return <OwnerReviewQueueSurface data={ownerReviewQueueData} />;
}
