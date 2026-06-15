import { AlertTriangle, Ban, Clock3, FileSearch, Gauge, GitCompareArrows, LineChart, ShieldCheck } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import {
  tradingDesks,
  tradingGates,
  tradingReplay,
  tradingResearchDisclaimer,
  tradingSignals,
  tradingSourceHealth,
  tradingTeamStatus
} from "@/lib/trading-team";

const toneMap = {
  private: "private",
  warning: "warning"
} as const;

function sourceTone(state: string) {
  if (state === "Degraded" || state === "Pending") {
    return "warning";
  }

  return "info";
}

export function TradingDashboardMock() {
  return (
    <div className="grid gap-5">
      <section className="panel p-6 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">MiniDora Trading Team</p>
            <h2 className="mt-2 max-w-4xl text-3xl font-semibold text-white md:text-4xl">
              Research desk for signals, evidence, disagreement, and owner review.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
              MiniDora Trading organizes market research artifacts. It does not connect to broker write paths, submit
              orders, manage accounts, or promote phases without explicit owner review.
            </p>
          </div>
          <div className="rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 px-4 py-3">
            <p className="text-xs font-bold uppercase text-yellow-100">Persistent boundary</p>
            <p className="mt-2 max-w-xs text-sm font-semibold leading-6 text-white">{tradingResearchDisclaimer}</p>
          </div>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-4">
          {[
            ["Mode", tradingTeamStatus.mode],
            ["Phase", tradingTeamStatus.phase],
            ["Posture", tradingTeamStatus.posture],
            ["Freshness", tradingTeamStatus.lastUpdated]
          ].map(([label, value]) => (
            <div key={label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
              <p className="mt-2 text-lg font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_24rem]">
        <div className="panel p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Signals needing review</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Evidence-first queue</h2>
            </div>
            <LineChart className="text-sky-100" size={24} aria-hidden />
          </div>

          <div className="mt-5 overflow-hidden rounded-[8px] border border-slate-700">
            <div className="hidden grid-cols-[0.9fr_1.5fr_0.7fr_0.75fr_0.8fr] gap-3 border-b border-slate-700 bg-white/5 px-4 py-3 text-xs font-bold uppercase text-slate-400 lg:grid">
              <span>Instrument</span>
              <span>Thesis</span>
              <span>Evidence</span>
              <span>Health</span>
              <span>Desk</span>
            </div>
            <div className="divide-y divide-slate-700">
              {tradingSignals.map((signal) => (
                <article
                  key={`${signal.instrument}-${signal.desk}`}
                  className="grid gap-3 px-4 py-4 lg:grid-cols-[0.9fr_1.5fr_0.7fr_0.75fr_0.8fr]"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-white">{signal.instrument}</h3>
                    <p className="mt-1 text-xs text-slate-400">
                      {signal.posture} · {signal.horizon}
                    </p>
                  </div>
                  <p className="text-sm leading-6 text-slate-300">{signal.thesis}</p>
                  <div className="text-sm text-slate-300">
                    <span className="font-semibold text-white">{signal.evidence}</span> / {signal.counterEvidence} counter
                    <p className="mt-1 text-xs text-slate-400">{signal.confidence} confidence</p>
                  </div>
                  <StatusBadge tone={sourceTone(signal.sourceHealth)}>{signal.sourceHealth}</StatusBadge>
                  <div className="text-sm text-slate-300">
                    {signal.desk}
                    <p className="mt-1 text-xs text-yellow-100">{signal.state}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="grid content-start gap-4">
          <section className="panel p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">Gates & evidence</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">No execution path</h2>
              </div>
              <ShieldCheck className="text-yellow-100" size={24} aria-hidden />
            </div>
            <div className="mt-5 grid gap-3">
              {tradingGates.map((gate) => (
                <div key={gate.label} className="flex items-center justify-between gap-3 rounded-[8px] border border-slate-700 bg-white/5 px-3 py-3">
                  <span className="text-sm text-slate-300">{gate.label}</span>
                  <StatusBadge tone={toneMap[gate.tone]}>{gate.value}</StatusBadge>
                </div>
              ))}
            </div>
          </section>

          <section className="panel p-5">
            <div className="flex items-center gap-2 text-yellow-100">
              <Ban size={18} aria-hidden />
              <h2 className="font-semibold">Blocked actions</h2>
            </div>
            <div className="mt-4 grid gap-2">
              {["Order placement", "Broker write", "Paper submit", "Live submit", "Auto-promotion"].map((action) => (
                <div key={action} className="rounded-[8px] border border-red-300/20 bg-red-300/10 px-3 py-2 text-sm text-red-100">
                  {action}
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="panel p-5">
          <div className="flex items-center gap-2">
            <GitCompareArrows className="text-sky-100" size={22} aria-hidden />
            <div>
              <p className="eyebrow">Desk disagreement</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">Different desks, visible uncertainty</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {tradingDesks.map((desk) => (
              <article key={desk.name} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-white">{desk.name}</h3>
                  <span className="text-xs font-bold uppercase text-yellow-100">{desk.view}</span>
                </div>
                <p className="mt-2 text-xs font-semibold uppercase text-slate-400">{desk.focus}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{desk.disagreement}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="panel p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-yellow-100" size={22} aria-hidden />
            <div>
              <p className="eyebrow">Source degradation</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">Missing evidence stays visible</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {tradingSourceHealth.map((source) => (
              <article key={source.source} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold text-white">{source.source}</h3>
                  <StatusBadge tone={sourceTone(source.state)}>{source.state}</StatusBadge>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{source.detail}</p>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="panel p-5">
          <div className="flex items-center gap-2">
            <Clock3 className="text-sky-100" size={22} aria-hidden />
            <div>
              <p className="eyebrow">Replay</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">How the research day formed</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {tradingReplay.map((event) => (
              <article key={`${event.time}-${event.desk}`} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                <p className="mono text-xs text-yellow-100">{event.time}</p>
                <h3 className="mt-2 font-semibold text-white">{event.desk}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{event.note}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="panel p-5">
          <div className="flex items-center gap-2">
            <FileSearch className="text-sky-100" size={22} aria-hidden />
            <div>
              <p className="eyebrow">Open questions</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">What must be answered before confidence rises</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {[
              "Which source packets are missing or degraded?",
              "What counter-evidence would invalidate the thesis?",
              "Which desk disagrees, and why?",
              "Has the owner reviewed the evidence chain?"
            ].map((question) => (
              <div key={question} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 text-sm leading-6 text-slate-300">
                {question}
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 p-4 text-sm font-semibold leading-6 text-yellow-50">
            {tradingResearchDisclaimer}
          </p>
        </article>
      </section>
    </div>
  );
}
