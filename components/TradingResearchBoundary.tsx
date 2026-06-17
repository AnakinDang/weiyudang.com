import { AlertTriangle } from "lucide-react";
import { tradingResearchDisclaimer } from "@/lib/trading-team";

export function TradingResearchBoundary({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={`trading-research-boundary${compact ? " is-compact" : ""}`} aria-label="Trading research boundary">
      <AlertTriangle size={compact ? 16 : 19} aria-hidden />
      <div>
        <strong>Research boundary</strong>
        <span>{tradingResearchDisclaimer}</span>
      </div>
    </aside>
  );
}
