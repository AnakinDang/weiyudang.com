import { TradingResearchCockpit } from "@/components/TradingResearchCockpit";
import type { TradingReviewReturnContext } from "@/components/TradingResearchCockpit";
import { requireOwnerSession } from "@/lib/private/owner-session";
import { ownerReviewQueueData } from "@/lib/private/review-queue";
import { privateTradingResearchData } from "@/lib/private/trading-team";
import { ownerReviewHref, ownerReviewPacketIdFromRoute, ownerReviewPacketRouteId } from "@/lib/review-route";
import { TRADING_REVIEW_PACKET_PARAM } from "@/lib/trading-trace";
import { tradingViewFromSlug, tradingViewSlugFromParam } from "@/lib/trading-team";
import type { TradingView } from "@/lib/trading-team";

export const dynamic = "force-dynamic";

type TradingPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function reviewPacketFromSearchParams(params: Record<string, string | string[] | undefined> = {}) {
  const packetId = ownerReviewPacketIdFromRoute(firstParam(params[TRADING_REVIEW_PACKET_PARAM]));
  return ownerReviewQueueData.queue.find((item) => item.id === packetId);
}

function nextPathFromSearchParams(params: Record<string, string | string[] | undefined> = {}) {
  const viewValue = params.view;
  const view = tradingViewSlugFromParam(firstParam(viewValue));
  const reviewPacket = reviewPacketFromSearchParams(params);
  const query = new URLSearchParams();

  if (view) {
    query.set("view", view);
  }

  if (reviewPacket) {
    const packetRouteId = ownerReviewPacketRouteId(reviewPacket.id);
    if (packetRouteId) {
      query.set(TRADING_REVIEW_PACKET_PARAM, packetRouteId);
    }
  }

  const queryString = query.toString();
  return queryString ? `/app/trading?${queryString}` : "/app/trading";
}

function initialViewFromSearchParams(params: Record<string, string | string[] | undefined> = {}): TradingView | undefined {
  const viewValue = params.view;
  return tradingViewFromSlug(firstParam(viewValue));
}

function reviewReturnFromSearchParams(
  params: Record<string, string | string[] | undefined> = {}
): TradingReviewReturnContext | undefined {
  const reviewPacket = reviewPacketFromSearchParams(params);

  if (!reviewPacket) {
    return undefined;
  }

  const routeId = ownerReviewPacketRouteId(reviewPacket.id);
  if (!routeId) {
    return undefined;
  }

  return {
    id: reviewPacket.id,
    routeId,
    title: reviewPacket.title,
    detail: reviewPacket.requestedDecision,
    href: ownerReviewHref(reviewPacket.id)
  };
}

export default async function TradingPage({ searchParams }: TradingPageProps) {
  const params = await searchParams;
  await requireOwnerSession(nextPathFromSearchParams(params));
  return (
    <TradingResearchCockpit
      data={privateTradingResearchData}
      initialView={initialViewFromSearchParams(params)}
      reviewReturn={reviewReturnFromSearchParams(params)}
    />
  );
}
