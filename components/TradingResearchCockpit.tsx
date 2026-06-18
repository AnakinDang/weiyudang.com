"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Ban,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileSearch,
  Gauge,
  GitCompareArrows,
  LineChart,
  Radio,
  ShieldCheck,
  SlidersHorizontal
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { UnavailableControlsPanel } from "@/components/UnavailableControlsPanel";
import {
  tradingDesks,
  tradingGates,
  tradingOpenQuestions,
  tradingOptionsLab,
  tradingReplay,
  tradingResearchDisclaimer,
  tradingSignals,
  tradingSourceHealth,
  tradingSystemStatus,
  tradingTeamStatus,
  tradingTodayFocus,
  tradingUnavailableActions,
  tradingViews
} from "@/lib/trading-team";

type TradingView = (typeof tradingViews)[number];
type TradingSignal = (typeof tradingSignals)[number];

const viewIcons = {
  Today: Gauge,
  Signals: LineChart,
  Desks: GitCompareArrows,
  "Options Lab": BarChart3,
  Evidence: FileSearch,
  Replay: Clock3,
  System: Radio
} as const satisfies Record<TradingView, typeof Gauge>;

function sourceTone(state: string) {
  if (state === "Disabled") {
    return "private";
  }

  if (state === "Blocked") {
    return "danger";
  }

  if (state === "Degraded" || state === "Pending" || state === "Incomplete" || state === "Partial") {
    return "warning";
  }

  return "info";
}

function gateTone(value: string) {
  if (value === "Disabled") {
    return "private";
  }

  if (value === "Blocked" || value === "Incomplete" || value === "Required") {
    return "warning";
  }

  return "normal";
}

function SignalCard({ signal }: { signal: TradingSignal }) {
  return (
    <article className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white">{signal.instrument}</h3>
          <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{signal.desk}</p>
        </div>
        <StatusBadge tone={sourceTone(signal.sourceHealth)}>{signal.sourceHealth}</StatusBadge>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{signal.thesis}</p>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-bold uppercase text-slate-400">Confidence</dt>
          <dd className="mt-1 font-semibold text-white">{signal.confidence}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase text-slate-400">Evidence</dt>
          <dd className="mt-1 font-semibold text-white">
            {signal.evidence} / {signal.counterEvidence} counter
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase text-slate-400">Horizon</dt>
          <dd className="mt-1 text-slate-300">{signal.horizon}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase text-slate-400">Updated</dt>
          <dd className="mt-1 text-slate-300">{signal.updated}</dd>
        </div>
      </dl>
      <div className="mt-4 rounded-[8px] border border-slate-700 bg-black/15 p-3">
        <p className="text-xs font-bold uppercase text-slate-400">Blocker</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">{signal.blocker}</p>
      </div>
    </article>
  );
}

function SignalTable({ signals }: { signals: readonly TradingSignal[] }) {
  return (
    <section className="panel overflow-hidden p-0" aria-labelledby="trading-signals-title">
      <div className="border-b border-slate-700/70 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-yellow-100">
              <LineChart size={22} aria-hidden />
              <h2 id="trading-signals-title" className="text-2xl font-semibold text-white">
                Signals needing review
              </h2>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Signal rows are research artifacts. They show uncertainty, evidence state, and blockers; they do not
              produce orders or trading recommendations.
            </p>
          </div>
          <StatusBadge tone="warning">Owner review required</StatusBadge>
        </div>
      </div>

      <div className="grid gap-3 p-4 lg:hidden">
        {signals.map((signal) => (
          <SignalCard key={`${signal.instrument}-${signal.desk}`} signal={signal} />
        ))}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-[780px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-700/70 text-xs font-bold uppercase text-slate-400">
              <th scope="col" className="px-4 py-3">
                Instrument
              </th>
              <th scope="col" className="px-4 py-3">
                Thesis
              </th>
              <th scope="col" className="px-4 py-3">
                Confidence
              </th>
              <th scope="col" className="px-4 py-3">
                Evidence
              </th>
              <th scope="col" className="px-4 py-3">
                Source health
              </th>
              <th scope="col" className="px-4 py-3">
                Desk
              </th>
            </tr>
          </thead>
          <tbody>
            {signals.map((signal) => (
              <tr key={`${signal.instrument}-${signal.desk}`} className="border-b border-slate-800/80 last:border-0">
                <td className="px-4 py-4 align-top">
                  <p className="font-semibold text-white">{signal.instrument}</p>
                  <p className="mt-1 text-xs text-slate-400">{signal.horizon}</p>
                </td>
                <td className="max-w-[20rem] px-4 py-4 align-top text-sm leading-6 text-slate-300">{signal.thesis}</td>
                <td className="px-4 py-4 align-top">
                  <p className="text-sm font-semibold text-white">{signal.confidence}</p>
                  <p className="mt-1 text-xs text-yellow-100">{signal.state}</p>
                </td>
                <td className="px-4 py-4 align-top text-sm text-slate-300">
                  <span className="font-semibold text-white">{signal.evidence}</span> evidence
                  <p className="mt-1 text-xs text-slate-400">{signal.counterEvidence} counter</p>
                </td>
                <td className="px-4 py-4 align-top">
                  <StatusBadge tone={sourceTone(signal.sourceHealth)}>{signal.sourceHealth}</StatusBadge>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{signal.blocker}</p>
                </td>
                <td className="px-4 py-4 align-top text-sm text-slate-300">
                  {signal.desk}
                  <p className="mt-1 text-xs text-slate-400">{signal.updated}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SafetyRail() {
  return (
    <aside className="grid content-start gap-4">
      <section className="panel p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-yellow-100">
              <ShieldCheck size={22} aria-hidden />
              <h2 className="text-2xl font-semibold text-white">Research boundary</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">Persistent guardrails for every tab and row.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          {["No broker write", "No account data", "No orders", "Owner review required"].map((rule) => (
            <div key={rule} className="flex gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] p-3 text-sm leading-6 text-slate-300">
              <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-200" size={17} aria-hidden />
              {rule}
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-5">
        <div className="flex items-center gap-2 text-red-100">
          <Ban size={18} aria-hidden />
          <h2 className="font-semibold text-white">Blocked actions</h2>
        </div>
        <div className="mt-4 grid gap-2">
          {tradingUnavailableActions.slice(0, 5).map((action) => (
            <div key={action} className="rounded-[8px] border border-red-300/20 bg-red-300/10 px-3 py-2 text-sm text-red-100">
              {action}: unavailable
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}

function TodayView({ signals }: { signals: readonly TradingSignal[] }) {
  return (
    <div className="grid gap-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="What matters today">
        {tradingTodayFocus.map((item) => {
          const Icon =
            item.icon === "alert" ? AlertTriangle : item.icon === "shield" ? ShieldCheck : item.icon === "compare" ? GitCompareArrows : FileSearch;

          return (
            <article key={item.title} className="panel p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-11 items-center justify-center rounded-[8px] border border-sky-200/20 bg-sky-300/10 text-sky-100">
                  <Icon size={21} aria-hidden />
                </span>
                <StatusBadge tone={sourceTone(item.state)}>{item.state}</StatusBadge>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_24rem]">
        <SignalTable signals={signals} />
        <SafetyRail />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <DeskDisagreement />
        <SourceDegradation />
      </section>
    </div>
  );
}

function DeskDisagreement() {
  return (
    <section className="panel p-5" aria-labelledby="trading-desk-title">
      <div className="flex items-center gap-2">
        <GitCompareArrows className="text-sky-100" size={22} aria-hidden />
        <div>
          <p className="eyebrow">Desk disagreement</p>
          <h2 id="trading-desk-title" className="mt-1 text-2xl font-semibold text-white">
            Different desks, visible uncertainty
          </h2>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {tradingDesks.map((desk) => (
          <article key={desk.name} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-white">{desk.name}</h3>
              <span className="text-xs font-bold uppercase text-yellow-100">{desk.stance}</span>
            </div>
            <p className="mt-2 text-xs font-semibold uppercase text-slate-400">{desk.focus}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{desk.disagreement}</p>
            <p className="mt-3 rounded-[8px] border border-slate-700 bg-black/15 p-3 text-xs leading-5 text-slate-400">
              Needs: {desk.needs}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SourceDegradation() {
  return (
    <section className="panel p-5" aria-labelledby="trading-source-title">
      <div className="flex items-center gap-2">
        <AlertTriangle className="text-yellow-100" size={22} aria-hidden />
        <div>
          <p className="eyebrow">Source degradation</p>
          <h2 id="trading-source-title" className="mt-1 text-2xl font-semibold text-white">
            Missing evidence stays visible
          </h2>
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
    </section>
  );
}

function OptionsLab() {
  return (
    <section className="panel p-5" aria-labelledby="trading-options-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <BarChart3 size={22} aria-hidden />
            <h2 id="trading-options-title" className="text-2xl font-semibold text-white">
              Options Lab
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Scenario notes for volatility research only. No strategy execution, no order ticket, and no account context.
          </p>
        </div>
        <StatusBadge tone="private">Research artifact</StatusBadge>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {tradingOptionsLab.map((scenario) => (
          <article key={scenario.title} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-white">{scenario.title}</h3>
              <StatusBadge tone={sourceTone(scenario.state)}>{scenario.state}</StatusBadge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{scenario.detail}</p>
            <div className="mt-4 grid gap-2">
              {scenario.checks.map((check) => (
                <div key={check} className="rounded-[8px] border border-slate-700 bg-black/15 px-3 py-2 text-xs text-slate-300">
                  {check}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EvidenceView() {
  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="panel p-5">
        <div className="flex items-center gap-2 text-yellow-100">
          <FileSearch size={22} aria-hidden />
          <h2 className="text-2xl font-semibold text-white">Gates & Evidence</h2>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Every important signal needs evidence, counter-evidence, source health, and owner review before confidence can
          rise.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {tradingGates.map((gate) => (
            <article key={gate.label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold text-white">{gate.label}</h3>
                <StatusBadge tone={gateTone(gate.value)}>{gate.value}</StatusBadge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{gate.detail}</p>
            </article>
          ))}
        </div>
      </div>
      <UnavailableControlsPanel
        eyebrow="Blocked actions"
        title="No trading controls"
        items={tradingUnavailableActions}
        note="This cockpit can prepare evidence and questions only. It cannot place, submit, replace, cancel, or produce trading recommendations."
      />
    </section>
  );
}

function ReplayView() {
  return (
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
          <SlidersHorizontal className="text-sky-100" size={22} aria-hidden />
          <div>
            <p className="eyebrow">Open questions</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">What must be answered before confidence rises</h2>
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          {tradingOpenQuestions.map((question) => (
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
  );
}

function SystemView() {
  return (
    <section className="grid gap-5 lg:grid-cols-3">
      {tradingSystemStatus.map((item) => (
        <article key={item.label} className="panel p-5">
          <div className="flex items-start justify-between gap-3">
            <Gauge className="text-sky-100" size={22} aria-hidden />
            <StatusBadge tone={sourceTone(item.state)}>{item.state}</StatusBadge>
          </div>
          <h2 className="mt-5 text-xl font-semibold text-white">{item.label}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{item.detail}</p>
        </article>
      ))}
    </section>
  );
}

export function TradingResearchCockpit() {
  const [activeView, setActiveView] = useState<TradingView>("Today");
  const [activeDesk, setActiveDesk] = useState("All desks");

  const deskFilters = useMemo(() => ["All desks", ...new Set(tradingSignals.map((signal) => signal.desk))], []);
  const filteredSignals = useMemo(
    () => (activeDesk === "All desks" ? tradingSignals : tradingSignals.filter((signal) => signal.desk === activeDesk)),
    [activeDesk]
  );

  return (
    <div className="grid gap-5">
      <section className="panel relative isolate overflow-hidden p-6 md:p-7">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-1/2 bg-[radial-gradient(circle_at_55%_35%,rgba(56,189,248,0.16),transparent_34%),linear-gradient(135deg,transparent,rgba(250,204,21,0.08))]"
          aria-hidden
        />
        <div className="grid items-end gap-6 xl:grid-cols-[minmax(0,1fr)_25rem]">
          <div>
            <h2 className="max-w-4xl text-3xl font-semibold text-white md:text-5xl">MiniDora Trading Research</h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
              Evidence-first research cockpit for signals, desk disagreement, source degradation, gates, and replay.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">
              MiniDora Trading organizes market research artifacts for owner review. It does not connect to broker write
              paths, submit orders, manage accounts, or auto-promote phases.
            </p>
          </div>

          <div className="rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 p-4">
            <div className="flex items-center gap-2 text-yellow-100">
              <ShieldCheck size={19} aria-hidden />
              <h3 className="font-semibold text-white">Persistent boundary</h3>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-yellow-50">{tradingResearchDisclaimer}</p>
            <div className="mt-4 grid gap-2">
              {[
                ["Mode", tradingTeamStatus.mode],
                ["Phase", tradingTeamStatus.phase],
                ["Posture", tradingTeamStatus.posture],
                ["Freshness", tradingTeamStatus.lastUpdated]
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[1fr_auto] gap-3 border-t border-yellow-100/15 pt-3">
                  <span className="text-xs font-bold uppercase text-yellow-50/70">{label}</span>
                  <span className="text-sm font-semibold text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="panel-quiet p-3" aria-label="Trading research views">
        <div className="flex flex-wrap gap-2">
          {tradingViews.map((view) => {
            const Icon = viewIcons[view];
            const isActive = activeView === view;

            return (
              <button
                key={view}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveView(view)}
                className={`link-focus inline-flex items-center gap-2 rounded-[8px] border px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "border-sky-200/40 bg-sky-300/15 text-sky-50"
                    : "border-slate-700 bg-white/[0.035] text-slate-300 hover:border-sky-200/30 hover:text-white"
                }`}
              >
                <Icon size={16} aria-hidden />
                {view}
              </button>
            );
          })}
        </div>
      </section>

      {(activeView === "Today" || activeView === "Signals") && (
        <section className="panel-quiet p-4" aria-label="Desk signal filters">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-bold uppercase text-slate-400">Desk filter</span>
            {deskFilters.map((desk) => {
              const isActive = activeDesk === desk;

              return (
                <button
                  key={desk}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveDesk(desk)}
                  className={`link-focus rounded-[8px] border px-3 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "border-yellow-200/40 bg-yellow-300/10 text-yellow-50"
                      : "border-slate-700 bg-white/[0.035] text-slate-300 hover:border-yellow-200/30 hover:text-white"
                  }`}
                >
                  {desk}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {activeView === "Today" ? <TodayView signals={filteredSignals} /> : null}
      {activeView === "Signals" ? (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_24rem]">
          <SignalTable signals={filteredSignals} />
          <SafetyRail />
        </section>
      ) : null}
      {activeView === "Desks" ? <DeskDisagreement /> : null}
      {activeView === "Options Lab" ? <OptionsLab /> : null}
      {activeView === "Evidence" ? <EvidenceView /> : null}
      {activeView === "Replay" ? <ReplayView /> : null}
      {activeView === "System" ? <SystemView /> : null}
    </div>
  );
}
