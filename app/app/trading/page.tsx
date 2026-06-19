import { TradingResearchCockpit } from "@/components/TradingResearchCockpit";
import { requireOwnerSession } from "@/lib/private/owner-session";
import { privateTradingResearchData } from "@/lib/private/trading-team";

export const dynamic = "force-dynamic";

export default async function TradingPage() {
  await requireOwnerSession("/app/trading");
  return <TradingResearchCockpit data={privateTradingResearchData} />;
}
