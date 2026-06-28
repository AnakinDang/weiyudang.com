import { TradingResearchCockpit } from "@/components/TradingResearchCockpit";
import { requireOwnerSession } from "@/lib/private/owner-session";
import { privateTradingResearchData } from "@/lib/private/trading-team";
import { tradingViewFromSlug, tradingViewSlugFromParam } from "@/lib/trading-team";
import type { TradingView } from "@/lib/trading-team";

export const dynamic = "force-dynamic";

type TradingPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function nextPathFromSearchParams(params: Record<string, string | string[] | undefined> = {}) {
  const viewValue = params.view;
  const view = tradingViewSlugFromParam(Array.isArray(viewValue) ? viewValue[0] : viewValue);

  if (!view) {
    return "/app/trading";
  }

  const query = new URLSearchParams({ view });
  return `/app/trading?${query.toString()}`;
}

function initialViewFromSearchParams(params: Record<string, string | string[] | undefined> = {}): TradingView | undefined {
  const viewValue = params.view;
  return tradingViewFromSlug(Array.isArray(viewValue) ? viewValue[0] : viewValue);
}

export default async function TradingPage({ searchParams }: TradingPageProps) {
  const params = await searchParams;
  await requireOwnerSession(nextPathFromSearchParams(params));
  return <TradingResearchCockpit data={privateTradingResearchData} initialView={initialViewFromSearchParams(params)} />;
}
