"use client";

import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  FileSearch,
  Gauge,
  GitBranch,
  Layers3,
  LockKeyhole,
  Radio,
  Route,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Waypoints,
  XCircle
} from "lucide-react";
import Link from "next/link";

type SystemTone = "normal" | "info" | "warning" | "private" | "danger";
type PrivateSystemPosture = "healthy" | "watch" | "blocked";

type PrivateSystemEvidence = {
  label: string;
  state: string;
  tone: SystemTone;
  detail: string;
};

type PrivateSystemService = {
  id: string;
  label: string;
  domain: string;
  posture: PrivateSystemPosture;
  state: string;
  tone: SystemTone;
  detail: string;
  visibleSignal: string;
  ownerGate: string;
  evidence: readonly PrivateSystemEvidence[];
  risks: readonly string[];
  noGo: readonly string[];
};

type PrivateSystemSignal = {
  id: string;
  label: string;
  value: string;
  tone: SystemTone;
  scope: string;
  detail: string;
  lastChecked: string;
};

type PrivateSystemGap = {
  id: string;
  label: string;
  state: string;
  tone: SystemTone;
  detail: string;
  notedAt: string;
  revisitWhen: string;
};

type PrivateSystemMetric = {
  label: string;
  value: string;
  detail: string;
};

type PrivateSystemDiagnosticLane = {
  label: string;
  owner: string;
  state: string;
  tone: SystemTone;
  detail: string;
};

export type OwnerSystemHealthData = {
  services: readonly PrivateSystemService[];
  signals: readonly PrivateSystemSignal[];
  gaps: readonly PrivateSystemGap[];
  metrics: readonly PrivateSystemMetric[];
  lanes: readonly PrivateSystemDiagnosticLane[];
  diagnostics: readonly string[];
};

type FilterValue = "all" | "attention" | "public" | "owner";

type FilterOption = {
  label: string;
  value: FilterValue;
  icon: LucideIcon;
};

const filters = [
  { label: "All", value: "all", icon: Layers3 },
  { label: "Attention", value: "attention", icon: ShieldAlert },
  { label: "Public boundary", value: "public", icon: Route },
  { label: "Owner cockpit", value: "owner", icon: LockKeyhole }
] as const satisfies readonly FilterOption[];

const unavailableControls = ["Repair action", "Release action", "Queue mutation", "Runtime detail view", "Automatic recovery"] as const;

const postureCopy = {
  healthy: {
    label: "Held",
    detail: "Core boundaries are in place and visible at a safe summary level.",
    icon: CheckCircle2
  },
  watch: {
    label: "Watch",
    detail: "The system is honest about weak signals and missing evidence.",
    icon: CircleDashed
  },
  blocked: {
    label: "Blocked",
    detail: "Execution paths remain unavailable until a separate audit design exists.",
    icon: LockKeyhole
  }
} as const satisfies Record<PrivateSystemPosture, { label: string; detail: string; icon: LucideIcon }>;

const constellationIcons = [LockKeyhole, ShieldCheck, Radio, FileSearch, Waypoints, XCircle] as const;

function SystemBadge({ children, tone = "info" }: { children: React.ReactNode; tone?: SystemTone }) {
  const className = {
    normal: "border-emerald-200 bg-emerald-50 text-emerald-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    private: "border-slate-200 bg-slate-50 text-slate-700",
    danger: "border-red-200 bg-red-50 text-red-800"
  }[tone];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-[8px] border px-2.5 py-1 text-xs font-bold ${className}`}>
      {children}
    </span>
  );
}

function filterServices(services: readonly PrivateSystemService[], activeFilter: FilterValue) {
  if (activeFilter === "attention") {
    return services.filter((service) => service.posture !== "healthy" || service.tone === "warning" || service.tone === "private");
  }

  if (activeFilter === "public") {
    return services.filter((service) => service.id.includes("public") || service.domain.toLowerCase().includes("public"));
  }

  if (activeFilter === "owner") {
    return services.filter(
      (service) =>
        service.id.includes("owner") ||
        service.id.includes("review") ||
        service.id.includes("command") ||
        service.domain.toLowerCase().includes("owner")
    );
  }

  return [...services];
}

function healthSummary(services: readonly PrivateSystemService[]) {
  const healthy = services.filter((service) => service.posture === "healthy").length;
  const watch = services.filter((service) => service.posture === "watch").length;
  const blocked = services.filter((service) => service.posture === "blocked").length;

  return { healthy, watch, blocked };
}

function evidenceSummary(service: PrivateSystemService) {
  const ready = service.evidence.filter((item) => item.tone === "normal" || item.state === "Held" || item.state === "Visible").length;
  return `${ready} / ${service.evidence.length}`;
}

function SystemHero({ data, selectedService }: { data: OwnerSystemHealthData; selectedService: PrivateSystemService }) {
  const summary = healthSummary(data.services);
  const PostureIcon = postureCopy[selectedService.posture].icon;

  return (
    <section
      className="overflow-hidden rounded-[8px] border border-white/70 bg-white text-slate-950 shadow-[0_34px_120px_rgba(15,23,42,0.18)]"
      aria-labelledby="system-health-title"
    >
      <div className="grid min-h-[31rem] gap-0 xl:grid-cols-[minmax(0,1fr)_25rem] 2xl:grid-cols-[minmax(0,1fr)_29rem]">
        <div className="relative overflow-hidden p-6 md:p-8">
          <div className="pointer-events-none absolute -right-28 -top-32 size-96 rounded-full bg-blue-500/10 blur-3xl" aria-hidden />
          <div
            className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-[50rem] -translate-x-1/2 rounded-t-full border border-blue-100 bg-[radial-gradient(circle_at_50%_100%,rgba(37,99,235,0.14),rgba(34,197,94,0.08)_42%,transparent_70%)]"
            aria-hidden
          />

          <div className="relative flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase text-blue-800">
              <LockKeyhole size={14} aria-hidden />
              Owner-only
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase text-emerald-800">
              <FileSearch size={14} aria-hidden />
              Evidence-first
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-bold uppercase text-amber-800">
              <ShieldCheck size={14} aria-hidden />
              Read-only posture
            </span>
          </div>

          <div className="relative mt-10 grid gap-8 2xl:grid-cols-[minmax(18rem,0.82fr)_minmax(24rem,1fr)]">
            <div>
              <h2 id="system-health-title" className="max-w-3xl text-4xl font-semibold leading-[1.02] text-slate-950 md:text-5xl">
                System Health
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                A private posture room for Doraemon and the MiniDoras: service status, review gates, boundary checks,
                and known gaps without turning diagnostics into an operations console.
              </p>
            </div>

            <div className="relative min-h-[18rem] rounded-[8px] border border-slate-200 bg-white/64 p-5 shadow-[0_24px_90px_rgba(37,99,235,0.08)] backdrop-blur">
              <div className="absolute inset-6 rounded-full border border-blue-100" aria-hidden />
              <div className="absolute inset-x-12 top-1/2 border-t border-blue-100" aria-hidden />
              <div className="absolute inset-y-12 left-1/2 border-l border-blue-100" aria-hidden />
              <div className="relative flex h-full min-h-[15rem] items-center justify-center">
                <div className="flex size-24 items-center justify-center rounded-full border border-blue-200 bg-blue-600 text-white shadow-[0_22px_70px_rgba(37,99,235,0.28)]">
                  <Gauge size={36} aria-hidden />
                </div>
                {data.services.slice(0, 6).map((service, index) => {
                  const Icon = constellationIcons[index] ?? Server;
                  const angle = (index / Math.max(data.services.slice(0, 6).length, 1)) * Math.PI * 2 - Math.PI / 2;
                  const x = Math.cos(angle) * 8;
                  const y = Math.sin(angle) * 6;
                  const isSelected = service.id === selectedService.id;

                  return (
                    <div
                      key={service.id}
                      className={`absolute flex size-14 items-center justify-center rounded-[8px] border text-blue-700 transition ${
                        isSelected ? "border-blue-300 bg-blue-50 shadow-[0_12px_34px_rgba(37,99,235,0.2)]" : "border-slate-200 bg-white"
                      }`}
                      style={{ left: "50%", top: "50%", transform: `translate(-50%, -50%) translate(${x}rem, ${y}rem)` }}
                      aria-label={service.label}
                    >
                      <Icon size={20} aria-hidden />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative mt-7 grid overflow-hidden rounded-[8px] border border-slate-200 bg-white/82 shadow-[0_18px_70px_rgba(37,99,235,0.08)] backdrop-blur sm:grid-cols-2 xl:grid-cols-4">
            {data.metrics.map((metric) => (
              <div
                key={metric.label}
                className="border-b border-slate-200 p-4 sm:border-r sm:[&:nth-child(2n)]:border-r-0 sm:[&:nth-child(n+3)]:border-b-0 xl:border-b-0 xl:[&:nth-child(2n)]:border-r xl:last:border-r-0"
              >
                <p className="text-xs font-bold uppercase text-slate-500">{metric.label}</p>
                <strong className="mt-2 block text-3xl font-semibold text-slate-950">{metric.value}</strong>
                <p className="mt-2 text-sm leading-5 text-slate-600">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <section
          className="relative border-t border-slate-200 bg-[linear-gradient(180deg,#f7fbff,#edf5ff)] p-5 md:p-6 xl:border-l xl:border-t-0"
          aria-labelledby="posture-card-title"
        >
          <div className="pointer-events-none absolute inset-x-6 top-6 h-48 rounded-full bg-blue-500/12 blur-3xl" aria-hidden />
          <div className="relative rounded-[8px] border border-white bg-white/78 p-5 shadow-[0_20px_80px_rgba(37,99,235,0.1)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">Selected service</p>
                <h3 id="posture-card-title" className="mt-1 text-2xl font-semibold text-slate-950">
                  {selectedService.label}
                </h3>
                <p className="mt-1 text-xs font-bold uppercase text-blue-700">{selectedService.domain}</p>
              </div>
              <span className="flex size-12 items-center justify-center rounded-[8px] bg-blue-600 text-white">
                <PostureIcon size={22} aria-hidden />
              </span>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600">{selectedService.visibleSignal}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <SystemBadge tone={selectedService.tone}>{selectedService.state}</SystemBadge>
              <SystemBadge tone="private">{postureCopy[selectedService.posture].label}</SystemBadge>
            </div>
          </div>

          <dl className="relative mt-4 grid grid-cols-3 gap-3 rounded-[8px] border border-slate-200 bg-white/78 p-4 text-sm">
            <div>
              <dt className="text-xs font-bold uppercase text-slate-500">Held</dt>
              <dd className="mt-1 text-lg font-semibold text-slate-950">{summary.healthy}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-slate-500">Watch</dt>
              <dd className="mt-1 text-lg font-semibold text-slate-950">{summary.watch}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-slate-500">Blocked</dt>
              <dd className="mt-1 text-lg font-semibold text-slate-950">{summary.blocked}</dd>
            </div>
          </dl>

          <div className="relative mt-4 grid gap-3">
            <div className="rounded-[8px] border border-blue-100 bg-white/78 p-4">
              <p className="text-xs font-bold uppercase text-slate-500">Owner gate</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">{selectedService.ownerGate}</p>
            </div>
            <div className="rounded-[8px] border border-amber-100 bg-amber-50/80 p-4">
              <p className="text-xs font-bold uppercase text-amber-800">Boundary posture</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">{postureCopy[selectedService.posture].detail}</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

function FilterTabs({
  activeFilter,
  onSelect,
  counts
}: {
  activeFilter: FilterValue;
  onSelect: (value: FilterValue) => void;
  counts: Record<FilterValue, number>;
}) {
  return (
    <div className="panel p-3" aria-label="System health filters">
      <div className="grid gap-2 md:grid-cols-4">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const selected = activeFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => onSelect(filter.value)}
              className={`link-focus flex min-h-12 items-center justify-between gap-3 rounded-[8px] border px-4 py-3 text-left text-sm font-semibold transition ${
                selected
                  ? "border-sky-300 bg-sky-300/16 text-white"
                  : "border-slate-700 bg-white/[0.045] text-slate-300 hover:border-sky-300/60 hover:text-white"
              }`}
              aria-pressed={selected}
            >
              <span className="inline-flex items-center gap-2">
                <Icon size={17} aria-hidden />
                {filter.label}
              </span>
              <span className="rounded-[8px] border border-current/20 px-2 py-0.5 text-xs">{counts[filter.value]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ServiceRail({
  services,
  selectedService,
  onSelect
}: {
  services: readonly PrivateSystemService[];
  selectedService: PrivateSystemService;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="panel p-4" aria-labelledby="system-service-rail-title">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sky-100">
          <Server size={20} aria-hidden />
          <h2 id="system-service-rail-title" className="text-xl font-semibold text-white">
            Services
          </h2>
        </div>
        <SystemBadge tone="private">{services.length}</SystemBadge>
      </div>
      <div className="mt-4 grid gap-2">
        {services.map((service, index) => {
          const selected = service.id === selectedService.id;

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelect(service.id)}
              className={`link-focus rounded-[8px] border p-3 text-left transition ${
                selected
                  ? "border-sky-300 bg-sky-300/14 text-white"
                  : "border-slate-700 bg-white/[0.045] text-slate-300 hover:border-slate-500 hover:bg-white/[0.065]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.68rem] font-bold uppercase text-slate-400">{String(index + 1).padStart(2, "0")} - {service.domain}</p>
                  <p className="mt-1 text-sm font-semibold">{service.label}</p>
                </div>
                <SystemBadge tone={service.tone}>{service.state}</SystemBadge>
              </div>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{service.visibleSignal}</p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function SystemConstellation({
  services,
  selectedService,
  onSelect
}: {
  services: readonly PrivateSystemService[];
  selectedService: PrivateSystemService;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="panel overflow-hidden p-5" aria-labelledby="system-constellation-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Waypoints size={22} aria-hidden />
            <h2 id="system-constellation-title" className="text-2xl font-semibold text-white">
              System map
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Select a node to inspect posture, evidence, and the owner boundary. The map shows relationships without
            exposing runtime internals.
          </p>
        </div>
        <SystemBadge tone="info">Interactive</SystemBadge>
      </div>

      <div className="relative mt-6 min-h-[34rem] overflow-hidden rounded-[8px] border border-slate-700 bg-[radial-gradient(circle_at_50%_42%,rgba(37,99,235,0.22),rgba(15,23,42,0.2)_40%,rgba(255,255,255,0.035)_100%)] p-5">
        <div className="pointer-events-none absolute inset-8 rounded-full border border-sky-200/15" aria-hidden />
        <div className="pointer-events-none absolute inset-20 rounded-full border border-sky-200/15" aria-hidden />
        <div className="pointer-events-none absolute inset-x-10 top-1/2 border-t border-sky-200/15" aria-hidden />
        <div className="pointer-events-none absolute inset-y-10 left-1/2 border-l border-sky-200/15" aria-hidden />

        <div className="relative z-10 flex min-h-[30rem] items-center justify-center">
          <div className="flex size-32 items-center justify-center rounded-full border border-sky-200/40 bg-sky-300/16 text-sky-50 shadow-[0_24px_90px_rgba(14,165,233,0.18)]">
            <Sparkles size={42} aria-hidden />
          </div>
          {services.map((service, index) => {
            const Icon = constellationIcons[index % constellationIcons.length] ?? Server;
            const angle = (index / Math.max(services.length, 1)) * Math.PI * 2 - Math.PI / 2;
            const x = services.length === 1 ? 0 : Math.cos(angle) * 9;
            const y = services.length === 1 ? 0 : Math.sin(angle) * 7;
            const selected = service.id === selectedService.id;

            return (
              <button
                key={service.id}
                type="button"
                onClick={() => onSelect(service.id)}
                className={`link-focus absolute w-44 rounded-[8px] border p-3 text-left shadow-[0_18px_70px_rgba(2,6,23,0.18)] transition ${
                  selected
                    ? "border-sky-300 bg-sky-300/18 text-white"
                    : "border-slate-700 bg-slate-950/42 text-slate-300 hover:border-sky-300/60 hover:text-white"
                }`}
                style={{ left: "50%", top: "50%", transform: `translate(-50%, -50%) translate(${x}rem, ${y}rem)` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex size-8 items-center justify-center rounded-[8px] border border-current/20 bg-white/8 text-sky-100">
                    <Icon size={15} aria-hidden />
                  </span>
                  <SystemBadge tone={service.tone}>{service.state}</SystemBadge>
                </div>
                <p className="mt-3 text-sm font-semibold">{service.label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">{service.domain}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ServiceInspector({ service }: { service: PrivateSystemService }) {
  return (
    <aside className="panel p-5" aria-labelledby="system-inspector-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Selected service</p>
          <h2 id="system-inspector-title" className="mt-2 text-2xl font-semibold text-white">
            {service.label}
          </h2>
          <p className="mt-2 text-xs font-bold uppercase text-yellow-100">{service.domain}</p>
        </div>
        <SystemBadge tone={service.tone}>{service.state}</SystemBadge>
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-300">{service.detail}</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
          <p className="text-xs font-bold uppercase text-slate-400">Evidence</p>
          <p className="mt-2 text-xl font-semibold text-white">{evidenceSummary(service)}</p>
        </div>
        <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
          <p className="text-xs font-bold uppercase text-slate-400">No-go</p>
          <p className="mt-2 text-xl font-semibold text-white">{service.noGo.length}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {service.evidence.map((item) => (
          <article key={`${service.id}-${item.label}`} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-white">{item.label}</h3>
              <SystemBadge tone={item.tone}>{item.state}</SystemBadge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-[8px] border border-amber-200/25 bg-amber-200/10 p-4">
        <div className="flex items-center gap-2 text-yellow-100">
          <ShieldAlert size={17} aria-hidden />
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
    </aside>
  );
}

function DiagnosticLanes({ lanes }: { lanes: readonly PrivateSystemDiagnosticLane[] }) {
  return (
    <section className="panel p-5" aria-labelledby="diagnostic-lanes-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <GitBranch size={22} aria-hidden />
            <h2 id="diagnostic-lanes-title" className="text-2xl font-semibold text-white">
              Diagnostic lanes
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            The lanes describe where Doraemon can summarize posture and where the owner boundary stops action.
          </p>
        </div>
        <SystemBadge tone="private">Summary only</SystemBadge>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {lanes.map((lane, index) => (
          <article key={lane.label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-9 items-center justify-center rounded-[8px] border border-sky-200/35 bg-sky-200/16 text-xs font-semibold text-white">
                {String(index + 1).padStart(2, "0")}
              </span>
              <SystemBadge tone={lane.tone}>{lane.state}</SystemBadge>
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

function SignalsAndBoundary({ data }: { data: OwnerSystemHealthData }) {
  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]" aria-label="System signals and boundary">
      <div className="panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-100">
              <Activity size={22} aria-hidden />
              <h2 className="text-2xl font-semibold text-white">Signals</h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Signals are deliberately summary-level. Missing feeds are shown as gaps instead of pretending precision.
            </p>
          </div>
          <SystemBadge tone="warning">Safe abstraction</SystemBadge>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {data.signals.map((signal) => (
            <article key={signal.id} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-white">{signal.label}</h3>
                <SystemBadge tone={signal.tone}>{signal.value}</SystemBadge>
              </div>
              <p className="mt-2 text-xs font-bold uppercase text-yellow-100">{signal.scope}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{signal.detail}</p>
              <p className="mt-4 text-xs font-bold uppercase text-slate-400">Last checked</p>
              <p className="mt-1 text-sm text-slate-300">{signal.lastChecked}</p>
            </article>
          ))}
        </div>
      </div>

      <aside className="panel p-5">
        <div className="flex items-center gap-2 text-yellow-100">
          <FileSearch size={20} aria-hidden />
          <h2 className="text-2xl font-semibold text-white">Known gaps</h2>
        </div>
        <div className="mt-5 grid gap-3">
          {data.gaps.map((gap) => (
            <article key={gap.id} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-white">{gap.label}</h3>
                <SystemBadge tone={gap.tone}>{gap.state}</SystemBadge>
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

function BoundaryAndControls({ diagnostics }: { diagnostics: readonly string[] }) {
  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]" aria-label="System diagnostic boundary">
      <div className="panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-yellow-100">
              <ShieldCheck size={22} aria-hidden />
              <h2 className="text-2xl font-semibold text-white">Diagnostic boundary</h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              This page can summarize posture and gaps. It cannot expose internals or mutate runtime state.
            </p>
          </div>
          <SystemBadge tone="private">Read-only</SystemBadge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {diagnostics.map((item) => (
            <div key={item} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 text-sm leading-6 text-slate-300">
              {item}
            </div>
          ))}
        </div>
      </div>

      <aside className="panel p-5">
        <div className="flex items-center gap-2 text-yellow-100">
          <LockKeyhole size={20} aria-hidden />
          <h2 className="text-2xl font-semibold text-white">Unavailable</h2>
        </div>
        <div className="mt-5 grid gap-2">
          {unavailableControls.map((item) => (
            <div key={item} className="flex items-center justify-between gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] px-3 py-2 text-sm text-slate-300">
              <span>{item}</span>
              <SystemBadge tone="private">Unavailable</SystemBadge>
            </div>
          ))}
        </div>
        <Link
          href="/app/schedules"
          className="link-focus mt-4 inline-flex items-center gap-2 rounded-[8px] border border-sky-300/35 bg-sky-300/12 px-3 py-2 text-sm font-semibold text-sky-100 transition hover:border-sky-200 hover:bg-sky-300/18"
        >
          Review schedules
          <ArrowRight size={15} aria-hidden />
        </Link>
      </aside>
    </section>
  );
}

function EmptySystemHealthSurface() {
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
            No owner-visible diagnostics are available in this private source. The surface remains read-only and avoids
            exposing runtime internals or repair controls.
          </p>
        </div>
        <SystemBadge tone="private">Owner-only</SystemBadge>
      </div>
    </section>
  );
}

export function OwnerSystemHealthSurface({ data }: { data: OwnerSystemHealthData }) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");
  const [selectedServiceId, setSelectedServiceId] = useState(data.services[0]?.id ?? "");

  const counts = useMemo(
    () => ({
      all: filterServices(data.services, "all").length,
      attention: filterServices(data.services, "attention").length,
      public: filterServices(data.services, "public").length,
      owner: filterServices(data.services, "owner").length
    }),
    [data.services]
  );

  const visibleServices = useMemo(() => filterServices(data.services, activeFilter), [activeFilter, data.services]);
  const selectedService =
    visibleServices.find((service) => service.id === selectedServiceId) ?? visibleServices[0] ?? data.services[0];

  if (!selectedService) {
    return (
      <div className="grid gap-5">
        <h1 className="sr-only">Private system health diagnostics</h1>
        <EmptySystemHealthSurface />
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <h1 className="sr-only">Private system health diagnostics</h1>
      <SystemHero data={data} selectedService={selectedService} />
      <FilterTabs activeFilter={activeFilter} counts={counts} onSelect={setActiveFilter} />
      <section className="grid gap-5 2xl:grid-cols-[20rem_minmax(0,1fr)_26rem]" aria-label="Interactive system health workspace">
        <ServiceRail services={visibleServices} selectedService={selectedService} onSelect={setSelectedServiceId} />
        <SystemConstellation services={visibleServices} selectedService={selectedService} onSelect={setSelectedServiceId} />
        <ServiceInspector service={selectedService} />
      </section>
      <DiagnosticLanes lanes={data.lanes} />
      <SignalsAndBoundary data={data} />
      <BoundaryAndControls diagnostics={data.diagnostics} />
    </div>
  );
}
