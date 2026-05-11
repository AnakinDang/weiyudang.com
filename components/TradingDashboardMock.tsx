import { AlertTriangle, Ban, CheckCircle2, ClipboardList, Gauge, ShieldCheck } from "lucide-react";
import { candidateQueue, marketContext, riskState, tradingStatus } from "@/lib/mock";
import { StatusBadge } from "@/components/StatusBadge";

function Metric({
  label,
  value,
  total
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percent = Math.round((value / total) * 100);
  return (
    <div className="panel-quiet p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-slate-300">{label}</span>
        <span className="mono text-sm text-slate-100">
          {value}/{total}
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-[8px] bg-slate-800">
        <div className="h-full rounded-[8px] bg-sky-300" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function TradingDashboardMock() {
  return (
    <div className="space-y-6">
      <section className="panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">MiniDora Trading Research Desk</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Mode: Local Paper / Research Only</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              This MVP is a read-only evidence dashboard. It does not connect to a broker and cannot submit orders.
            </p>
          </div>
          <StatusBadge tone="warning">{tradingStatus.phase}</StatusBadge>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Metric label="Qualifying days" value={tradingStatus.qualifying_days} total={tradingStatus.required_days} />
          <Metric label="Qualifying trades" value={tradingStatus.qualifying_trades} total={tradingStatus.required_trades} />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <div className="panel p-5">
          <div className="mb-4 flex items-center gap-2 text-white">
            <ShieldCheck size={20} className="text-emerald-200" aria-hidden />
            <h3 className="font-semibold">Permission Boundary</h3>
          </div>
          <div className="space-y-3">
            {[
              ["broker_write", tradingStatus.broker_write],
              ["paper_submit", tradingStatus.paper_submit],
              ["live_submit", tradingStatus.live_submit],
              ["phase_auto_promotion", tradingStatus.phase_auto_promotion]
            ].map(([label, enabled]) => (
              <div key={String(label)} className="flex items-center justify-between rounded-[8px] border border-slate-700 px-3 py-2">
                <span className="mono text-xs text-slate-300">{label}</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-100">
                  <Ban size={13} aria-hidden />
                  {enabled ? "enabled" : "false"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-5">
          <div className="mb-4 flex items-center gap-2 text-white">
            <Gauge size={20} className="text-sky-200" aria-hidden />
            <h3 className="font-semibold">Risk State</h3>
          </div>
          <div className="space-y-3">
            {riskState.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3 rounded-[8px] border border-slate-700 px-3 py-2">
                <span className="text-sm text-slate-300">{item.label}</span>
                <span className="text-sm font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-5">
          <div className="mb-4 flex items-center gap-2 text-white">
            <AlertTriangle size={20} className="text-yellow-200" aria-hidden />
            <h3 className="font-semibold">Blocked Actions</h3>
          </div>
          <div className="space-y-3 text-sm text-slate-300">
            {["Order submit", "Broker write", "Paper submit", "Live submit", "Risk limit modification"].map((action) => (
              <div key={action} className="flex items-center gap-2 rounded-[8px] border border-red-300/20 bg-red-300/10 px-3 py-2 text-red-100">
                <Ban size={14} aria-hidden />
                {action}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel p-5">
          <div className="mb-4 flex items-center gap-2 text-white">
            <ClipboardList size={20} className="text-sky-200" aria-hidden />
            <h3 className="font-semibold">Today's Market Context</h3>
          </div>
          <div className="grid gap-3">
            {marketContext.map((item) => (
              <div key={item} className="rounded-[8px] border border-slate-700 px-3 py-3 text-sm text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="panel p-5">
          <div className="mb-4 flex items-center gap-2 text-white">
            <CheckCircle2 size={20} className="text-emerald-200" aria-hidden />
            <h3 className="font-semibold">Candidate Research Queue</h3>
          </div>
          <div className="space-y-3">
            {candidateQueue.map((candidate) => (
              <article key={candidate.stage} className="panel-quiet p-4">
                <p className="mono text-xs text-yellow-100">{candidate.stage}</p>
                <h4 className="mt-1 font-semibold text-white">{candidate.title}</h4>
                <p className="mt-2 text-sm text-slate-400">{candidate.status}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
