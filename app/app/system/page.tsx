import type { ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  FileSearch,
  Gauge,
  LockKeyhole,
  Radio,
  Server,
  ShieldCheck,
  Waypoints,
  XCircle
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { requireOwnerSession } from "@/lib/private/owner-session";
import {
  privateSystemDiagnosticLanes,
  privateSystemDiagnostics,
  privateSystemGaps,
  privateSystemMetrics,
  privateSystemServices,
  privateSystemSignals,
  type SystemTone,
  type PrivateSystemService
} from "@/lib/private/system";

export const dynamic = "force-dynamic";

const unavailableControls = ["Restart service", "Deploy worker", "Purge queue", "Open raw logs", "Repair automatically"] as const;

function LightStatusBadge({ children, tone }: { children: ReactNode; tone: SystemTone }) {
  const className = {
    normal: "border-emerald-200 bg-emerald-50 text-emerald-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    private: "border-slate-200 bg-slate-50 text-slate-700",
    danger: "border-red-200 bg-red-50 text-red-800"
  }[tone];

  return (
    <span className={`inline-flex items-center rounded-[8px] border px-2.5 py-1 text-xs font-bold uppercase ${className}`}>
      {children}
    </span>
  );
}

function SystemHero({ primaryService }: { primaryService: PrivateSystemService }) {
  return (
    <section
      className="overflow-hidden rounded-[8px] border border-white/70 bg-white text-slate-950 shadow-[0_34px_120px_rgba(15,23,42,0.18)]"
      aria-labelledby="system-title"
    >
      <div className="grid min-h-[30rem] gap-0 xl:grid-cols-[minmax(0,1.08fr)_31rem]">
        <div className="relative overflow-hidden p-6 md:p-8">
          <div
            className="pointer-events-none absolute -right-28 -top-32 size-96 rounded-full bg-blue-500/12 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 left-0 h-52 w-[42rem] rounded-tr-full border border-blue-100 bg-[radial-gradient(circle_at_35%_100%,rgba(34,197,94,0.16),rgba(37,99,235,0.08)_45%,transparent_70%)]"
            aria-hidden
          />

          <div className="relative flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase text-blue-800">
              <LockKeyhole size={14} aria-hidden />
              Owner-only
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase text-emerald-800">
              <Gauge size={14} aria-hidden />
              Summary diagnostics
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-bold uppercase text-amber-800">
              <ShieldCheck size={14} aria-hidden />
              No repair controls
            </span>
          </div>

          <div className="relative mt-10 max-w-4xl">
            <p className="text-sm font-semibold text-blue-700">Safe diagnostics register</p>
            <h2 id="system-title" className="mt-3 max-w-4xl text-4xl font-semibold leading-[1.02] text-slate-950 md:text-5xl">
              See system posture without exposing internals or turning health into repair.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
              System Health shows what is held, what needs watching, and what is blocked. It can name missing evidence
              and safety boundaries, but it cannot restart services, open logs, deploy, purge, or mutate runtime state.
            </p>
          </div>

          <div className="relative mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {privateSystemMetrics.map((metric) => (
              <div key={metric.label} className="rounded-[8px] border border-slate-200 bg-white/82 p-4 shadow-[0_18px_70px_rgba(37,99,235,0.08)] backdrop-blur">
                <p className="text-xs font-bold uppercase text-slate-500">{metric.label}</p>
                <strong className="mt-2 block text-3xl font-semibold text-slate-950">{metric.value}</strong>
                <p className="mt-2 text-sm leading-5 text-slate-600">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <section
          className="relative border-t border-slate-200 bg-[linear-gradient(180deg,#f7fbff,#edf5ff)] p-5 md:p-6 xl:border-l xl:border-t-0"
          aria-labelledby="primary-system-title"
        >
          <div className="pointer-events-none absolute inset-x-6 top-6 h-48 rounded-full bg-blue-500/12 blur-3xl" aria-hidden />
          <div className="relative rounded-[8px] border border-white bg-white/78 p-5 shadow-[0_20px_80px_rgba(37,99,235,0.1)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">Primary boundary</p>
                <h3 id="primary-system-title" className="mt-1 text-2xl font-semibold text-slate-950">
                  {primaryService.label}
                </h3>
                <p className="mt-1 text-xs font-bold uppercase text-blue-700">{primaryService.domain}</p>
              </div>
              <span className="flex size-12 items-center justify-center rounded-[8px] bg-blue-600 text-white">
                <Server size={23} aria-hidden />
              </span>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600">{primaryService.visibleSignal}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <LightStatusBadge tone={primaryService.tone}>{primaryService.state}</LightStatusBadge>
              <LightStatusBadge tone="private">Owner gated</LightStatusBadge>
            </div>
          </div>

          <div className="relative mt-4 grid gap-3">
            <div className="rounded-[8px] border border-blue-100 bg-white/78 p-4">
              <p className="text-xs font-bold uppercase text-slate-500">Owner gate</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">{primaryService.ownerGate}</p>
            </div>
            <div className="rounded-[8px] border border-amber-100 bg-amber-50/80 p-4">
              <p className="text-xs font-bold uppercase text-amber-800">No internal detail</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">
                Raw logs, internal hosts, ports, filesystem paths, tokens, and repair controls stay out of the page.
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

function DiagnosticLanes() {
  return (
    <section className="panel p-5" aria-labelledby="diagnostic-lanes-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Waypoints size={22} aria-hidden />
            <h2 id="diagnostic-lanes-title" className="text-2xl font-semibold text-white">
              Diagnostic lanes
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Each lane says which boundary is being summarized and where the page must stop before it becomes a repair
            or execution console.
          </p>
        </div>
        <StatusBadge tone="private">Summary only</StatusBadge>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {privateSystemDiagnosticLanes.map((lane, index) => (
          <article key={lane.label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <span
                className="flex size-9 items-center justify-center rounded-[8px] border border-sky-200/35 bg-sky-200/16 text-xs font-semibold text-white"
                aria-hidden
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <StatusBadge tone={lane.tone}>{lane.state}</StatusBadge>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">{lane.label}</h3>
            <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{lane.owner}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{lane.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ServicePacket({ service, index }: { service: PrivateSystemService; index: number }) {
  return (
    <article className="panel p-5" aria-labelledby={`system-service-${service.id}`}>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">
                {String(index + 1).padStart(2, "0")} - {service.domain}
              </p>
              <h3 id={`system-service-${service.id}`} className="mt-2 text-2xl font-semibold text-white">
                {service.label}
              </h3>
              <p className="mt-2 text-xs font-bold uppercase text-slate-400">
                {service.posture} - {service.state}
              </p>
            </div>
            <StatusBadge tone={service.tone}>{service.state}</StatusBadge>
          </div>

          <p className="mt-5 max-w-4xl text-sm leading-6 text-slate-300">{service.detail}</p>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">Visible signal</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{service.visibleSignal}</p>
            </div>
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">Owner gate</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{service.ownerGate}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {service.evidence.map((evidence) => (
              <div key={`${service.id}-${evidence.label}`} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase text-slate-400">{evidence.label}</p>
                  <StatusBadge tone={evidence.tone}>{evidence.state}</StatusBadge>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{evidence.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="grid content-start gap-4">
          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 text-yellow-100">
              <AlertTriangle size={17} aria-hidden />
              <p className="text-sm font-semibold">Watch items</p>
            </div>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-300">
              {service.risks.map((risk) => (
                <li key={`${service.id}-${risk}`} className="flex gap-2">
                  <Radio className="mt-1 shrink-0 text-yellow-100" size={15} aria-hidden />
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 text-yellow-100">
              <XCircle size={17} aria-hidden />
              <p className="text-sm font-semibold">No-go actions</p>
            </div>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-300">
              {service.noGo.map((item) => (
                <li key={`${service.id}-${item}`} className="flex gap-2">
                  <LockKeyhole className="mt-1 shrink-0 text-yellow-100" size={15} aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </article>
  );
}

function SignalsAndGaps() {
  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="panel p-5" aria-labelledby="system-signals-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-100">
              <Activity size={22} aria-hidden />
              <h2 id="system-signals-title" className="text-2xl font-semibold text-white">
                Signals
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Signals are safe summaries. Missing feeds are named as gaps instead of being hidden behind fake precision.
            </p>
          </div>
          <StatusBadge tone="warning">No raw logs</StatusBadge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {privateSystemSignals.map((signal) => (
            <article key={signal.id} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-white">{signal.label}</h3>
                <StatusBadge tone={signal.tone}>{signal.value}</StatusBadge>
              </div>
              <p className="mt-2 text-xs font-bold uppercase text-yellow-100">{signal.scope}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{signal.detail}</p>
              <p className="mt-4 text-xs font-bold uppercase text-slate-400">Last checked</p>
              <p className="mt-1 text-sm text-slate-300">{signal.lastChecked}</p>
            </article>
          ))}
        </div>
      </section>

      <aside className="panel p-5" aria-labelledby="system-gaps-title">
        <div className="flex items-center gap-2 text-yellow-100">
          <FileSearch size={20} aria-hidden />
          <h2 id="system-gaps-title" className="text-2xl font-semibold text-white">
            Known gaps
          </h2>
        </div>
        <div className="mt-5 grid gap-3">
          {privateSystemGaps.map((gap) => (
            <article key={gap.id} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-white">{gap.label}</h3>
                <StatusBadge tone={gap.tone}>{gap.state}</StatusBadge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{gap.detail}</p>
              <div className="mt-4 grid gap-2 text-xs leading-5 text-slate-400">
                <p>
                  <span className="font-bold uppercase text-slate-500">Noted:</span> {gap.notedAt}
                </p>
                <p>
                  <span className="font-bold uppercase text-slate-500">Revisit:</span> {gap.revisitWhen}
                </p>
              </div>
            </article>
          ))}
        </div>
      </aside>
    </section>
  );
}

function BoundaryRail() {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="panel p-5" aria-labelledby="diagnostic-boundary-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-yellow-100">
              <ShieldCheck size={22} aria-hidden />
              <h2 id="diagnostic-boundary-title" className="text-2xl font-semibold text-white">
                Diagnostic boundary
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              The page can summarize posture and gaps. It cannot reveal internals or trigger repair.
            </p>
          </div>
          <StatusBadge tone="private">Read-only</StatusBadge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {privateSystemDiagnostics.map((item) => (
            <div key={item} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 text-sm leading-6 text-slate-300">
              {item}
            </div>
          ))}
        </div>
      </section>

      <aside className="panel p-5" aria-labelledby="repair-unavailable-title">
        <div className="flex items-center gap-2 text-yellow-100">
          <LockKeyhole size={20} aria-hidden />
          <h2 id="repair-unavailable-title" className="text-2xl font-semibold text-white">
            Unavailable
          </h2>
        </div>
        <div className="mt-5 grid gap-2">
          {unavailableControls.map((item) => (
            <div key={item} className="flex items-center justify-between gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] px-3 py-2 text-sm text-slate-300">
              <span>{item}</span>
              <StatusBadge tone="private">Unavailable</StatusBadge>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function EmptySystemDiagnostics() {
  return (
    <section className="panel p-6 md:p-7" aria-labelledby="system-empty-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Server size={22} aria-hidden />
            <h2 id="system-empty-title" className="text-2xl font-semibold text-white">
              Diagnostics empty
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            No owner-visible diagnostics are available in this private mock source. The page remains read-only and does
            not expose logs, hosts, tokens, ports, filesystem paths, or repair controls.
          </p>
        </div>
        <StatusBadge tone="private">Owner-only</StatusBadge>
      </div>
    </section>
  );
}

export default async function SystemPage() {
  await requireOwnerSession("/app/system");
  const primaryService = privateSystemServices[0];

  if (!primaryService) {
    return (
      <div className="grid gap-5">
        <h1 className="sr-only">Private system health diagnostics</h1>
        <EmptySystemDiagnostics />
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <h1 className="sr-only">Private system health diagnostics</h1>
      <SystemHero primaryService={primaryService} />
      <DiagnosticLanes />

      <section className="panel p-5" aria-labelledby="service-packets-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-100">
              <Server size={22} aria-hidden />
              <h2 id="service-packets-title" className="text-2xl font-semibold text-white">
                Service packets
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Each packet describes a posture, visible signal, owner gate, evidence state, and no-go action list.
            </p>
          </div>
          <StatusBadge tone="warning">No repair path</StatusBadge>
        </div>

        <div className="mt-5 grid gap-4">
          {privateSystemServices.map((service, index) => (
            <ServicePacket key={service.id} service={service} index={index} />
          ))}
        </div>
      </section>

      <SignalsAndGaps />
      <BoundaryRail />
    </div>
  );
}
