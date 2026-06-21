import { OwnerReviewQueueSurface } from "@/components/OwnerReviewQueueSurface";
import { requireOwnerSession } from "@/lib/private/owner-session";
import { ownerReviewQueueData } from "@/lib/private/review-queue";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  await requireOwnerSession("/app/events");

  return <OwnerReviewQueueSurface data={ownerReviewQueueData} />;
}
