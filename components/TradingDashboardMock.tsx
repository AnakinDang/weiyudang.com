import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  CircleDashed,
  ClipboardList,
  FileText,
  Gauge,
  Layers3,
  LockKeyhole,
  Route,
  ShieldCheck,
  UsersRound
} from "lucide-react";
import {
  candidateQueue,
  deskMatrix,
  evidenceTrail,
  hardStopFlags,
  nextReviewActions,
  researchGates,
  teamRoles,
  tradingStatus
} from "@/lib/mock";
import { StatusBadge } from "@/components/StatusBadge";

type GateStatus = (typeof researchGates)[number]["status"];

const gateTone: Record<GateStatus, "normal" | "warning" | "danger" | "private"> = {
  pass: "normal",
  warn: "warning",
  blocked: "danger",
  not_run: "private"
};

const gateText: Record<GateStatus, string> = {
  pass: "Pass",
  warn: "Warn",
  blocked: "Blocked",
  not_run: "Not run"
};

function BoundaryRow({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[8px] border border-slate-700/80 bg-slate-950/30 px-3 py-2">
      <span className="mono text-xs text-slate-300">{label}</span>
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-100">
        <Ban size={13} aria-hidden />
        {value ? "enabled" : "false"}
      </span>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, eyebrow }: { icon: typeof ShieldCheck; title: string; eyebrow?: string }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] border border-sky-200/20 bg-sky-300/10 text-sky-100">
        <Icon size={20} aria-hidden />
      </span>
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
    </div>
  );
}

export function TradingDashboardMock() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[8px] border border-yellow-200/25 bg-gradient-to-br from-slate-900 via-[#0b1220] to-slate-950 shadow-[0_24px_80px_rgba(2,6,23,0.36)]">
        <div className="border-b border-yellow-200/15 bg-yellow-300/10 px-5 py-3 text-sm font-semibold text-yellow-100">
          {tradingStatus.research_only_label}
        </div>
        <div className="grid gap-6 p-5 lg:grid-cols-[1.15fr_0.85fr] lg:p-6">
          <div>
            <p className="eyebrow">MiniDora Trading / private app</p>
            <h2 className="mt-2 max-w-4xl text-3xl font-semibold text-white md:text-4xl">Read-only research dashboard</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Local static fixture for evidence review, gates, team roles, and route readiness. This surface intentionally has no broker controls, no order intent creation, and no account-specific sizing.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <StatusBadge tone="warning">{tradingStatus.phase}</StatusBadge>
              <StatusBadge tone="danger">{tradingStatus.blocked_phase}</StatusBadge>
              <StatusBadge tone="private">{tradingStatus.mode}</StatusBadge>
            </div>
          </div>
          <div className="grid gap-3 rounded-[8px] border border-slate-700/80 bg-slate-950/30 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-400">Snapshot</span>
              <span className="mono text-xs text-slate-200">{tradingStatus.snapshot_time}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-400">Fixture</span>
              <span className="mono text-xs text-slate-200">{tradingStatus.fixture_id}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-400">Hash</span>
              <span className="mono text-xs text-slate-200">{tradingStatus.fixture_hash}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-400">Route</span>
              <span className="max-w-56 text-right text-xs font-semibold text-yellow-100">{tradingStatus.route_status}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="panel p-5">
          <SectionTitle icon={ShieldCheck} title="Permission boundary" eyebrow="Hard stops" />
          <div className="grid gap-3 sm:grid-cols-2">
            <BoundaryRow label="broker_write" value={tradingStatus.broker_write} />
            <BoundaryRow label="paper_submit" value={tradingStatus.paper_submit} />
            <BoundaryRow label="live_submit" value={tradingStatus.live_submit} />
            <BoundaryRow label="phase_auto_promotion" value={tradingStatus.phase_auto_promotion} />
            <BoundaryRow label="runtime_signal_or_order_objects" value={tradingStatus.runtime_signal_or_order_objects} />
            <BoundaryRow label="exact_account_sizing" value={tradingStatus.exact_account_sizing} />
          </div>
        </div>
        <div className="panel p-5">
          <SectionTitle icon={LockKeyhole} title="Forbidden actions absent" eyebrow="Safety contract" />
          <div className="grid gap-2 sm:grid-cols-2">
            {hardStopFlags.map((flag) => (
              <div key={flag} className="flex items-center gap-2 rounded-[8px] border border-red-300/20 bg-red-300/10 px-3 py-2 text-sm text-red-100">
                <Ban size={14} aria-hidden />
                {flag}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-2">
          <SectionTitle icon={ClipboardList} title="Candidate research queue" eyebrow="Observation candidates" />
          <div className="grid gap-4">
            {candidateQueue.map((candidate) => (
              <article key={candidate.id} className="panel-quiet p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="mono text-xs text-yellow-100">{candidate.label}</p>
                    <h4 className="mt-1 text-lg font-semibold text-white">{candidate.title}</h4>
                    <p className="mt-1 text-sm text-slate-400">Direction: {candidate.direction}</p>
                  </div>
                  <StatusBadge tone={candidate.confidence === "blocked" ? "danger" : "warning"}>{candidate.confidence}</StatusBadge>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-[8px] border border-slate-700/80 p-3">
                    <p className="text-xs font-semibold uppercase text-slate-500">触发条件 / trigger</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{candidate.trigger}</p>
                  </div>
                  <div className="rounded-[8px] border border-slate-700/80 p-3">
                    <p className="text-xs font-semibold uppercase text-slate-500">失效条件 / invalidation</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{candidate.invalidation}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {candidate.gates.map((gate) => (
                    <span key={gate} className="rounded-[8px] border border-slate-600 bg-slate-950/30 px-2.5 py-1 text-xs text-slate-300">
                      {gate}
                    </span>
                  ))}
                  <span className="ml-auto text-xs text-slate-500">{candidate.evidence_count} evidence refs · {candidate.updated}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="panel p-5">
          <SectionTitle icon={Gauge} title="Research gates" eyebrow="QR-01..QR-05" />
          <div className="space-y-3">
            {researchGates.map((gate) => (
              <div key={gate.id} className="rounded-[8px] border border-slate-700/80 bg-slate-950/25 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="mono text-xs text-slate-400">{gate.id}</span>
                  <StatusBadge tone={gateTone[gate.status]}>{gateText[gate.status]}</StatusBadge>
                </div>
                <h4 className="mt-2 font-semibold text-white">{gate.name}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-400">{gate.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel p-5">
        <SectionTitle icon={Layers3} title="Desk matrix" eyebrow="Summary first, disagreement visible" />
        <div className="overflow-x-auto">
          <div className="min-w-[820px] divide-y divide-slate-700/70 rounded-[8px] border border-slate-700/70">
            <div className="grid grid-cols-[0.65fr_0.9fr_0.8fr_1.45fr_1.1fr_1.1fr] gap-3 bg-slate-950/40 px-3 py-2 text-xs font-semibold uppercase text-slate-500">
              <span>Desk</span>
              <span>Stance</span>
              <span>Confidence</span>
              <span>Top evidence</span>
              <span>Risk</span>
              <span>Disagreement</span>
            </div>
            {deskMatrix.map((desk) => (
              <div key={desk.desk} className="grid grid-cols-[0.65fr_0.9fr_0.8fr_1.45fr_1.1fr_1.1fr] gap-3 px-3 py-3 text-sm text-slate-300">
                <span className="font-semibold text-white">{desk.desk}</span>
                <span>{desk.stance}</span>
                <span>{desk.confidence}</span>
                <span>{desk.evidence}</span>
                <span>{desk.risk}</span>
                <span>{desk.disagreement}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="panel p-5">
          <SectionTitle icon={FileText} title="Evidence / artifact / audit trail" eyebrow="Sanitized fixture refs" />
          <div className="grid gap-3">
            {evidenceTrail.map((item) => (
              <article key={item.id} className="rounded-[8px] border border-slate-700/80 bg-slate-950/25 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="mono text-xs text-sky-100">{item.source} · {item.kind}</p>
                    <h4 className="mt-1 font-semibold text-white">{item.title}</h4>
                  </div>
                  <StatusBadge tone={item.status === "pass" ? "normal" : item.status === "warn" ? "warning" : "info"}>{item.status}</StatusBadge>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-[8px] border border-slate-600 px-2 py-1 text-slate-300">hash {item.hash}</span>
                  <span className="rounded-[8px] border border-emerald-300/20 bg-emerald-300/10 px-2 py-1 text-emerald-100">{item.privacy}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="panel p-5">
            <SectionTitle icon={UsersRound} title="Team roles" eyebrow="Responsibility map" />
            <div className="space-y-3">
              {teamRoles.map((role) => (
                <div key={role.role} className="rounded-[8px] border border-slate-700/80 bg-slate-950/25 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-semibold text-white">{role.role}</h4>
                    <span className="text-xs text-yellow-100">{role.owner}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{role.responsibility}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-5">
            <SectionTitle icon={Route} title="Next review actions" eyebrow="Before anything live" />
            <ol className="space-y-3">
              {nextReviewActions.map((action, index) => (
                <li key={action} className="flex gap-3 rounded-[8px] border border-slate-700/80 bg-slate-950/25 p-3 text-sm leading-6 text-slate-300">
                  <span className="mono text-xs text-yellow-100">{String(index + 1).padStart(2, "0")}</span>
                  <span>{action}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="rounded-[8px] border border-slate-700/80 bg-slate-950/35 p-4 text-sm leading-6 text-slate-400">
        <div className="flex flex-wrap items-center gap-2 text-slate-200">
          <AlertTriangle size={17} className="text-yellow-100" aria-hidden />
          <strong>Read-only fixture note:</strong>
        </div>
        <p className="mt-2">
          This mock renders static repo data only. It does not fetch, call services, expose credentials, read broker accounts, create signal events, create order intents, or mutate trading/runtime state.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-[8px] border border-emerald-300/20 bg-emerald-300/10 px-2 py-1 text-xs text-emerald-100"><CheckCircle2 size={12} aria-hidden /> Static data</span>
          <span className="inline-flex items-center gap-1 rounded-[8px] border border-slate-600 px-2 py-1 text-xs text-slate-300"><CircleDashed size={12} aria-hidden /> Local preview</span>
          <span className="inline-flex items-center gap-1 rounded-[8px] border border-red-300/20 bg-red-300/10 px-2 py-1 text-xs text-red-100"><Ban size={12} aria-hidden /> No execution UI</span>
        </div>
      </section>
    </div>
  );
}
