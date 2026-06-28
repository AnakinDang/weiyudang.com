"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Boxes,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  GitBranch,
  LockKeyhole,
  Radio,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Waypoints
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { StatusBadge } from "@/components/StatusBadge";
import { UnavailableControlsPanel } from "@/components/UnavailableControlsPanel";
import { translateToZh, type SiteLocale } from "@/lib/site-i18n";

type Tone = "normal" | "info" | "warning" | "private";
type CommandMode = string;
type CommandAgentRole = "Orchestrator" | "Product" | "Implementation" | "Evidence" | "Research-only";
type CommandModeIcon = "radio" | "waypoints" | "clipboard" | "file_search" | "shield";
type CommandStatusItem = {
  title?: string;
  label?: string;
  state: string;
  tone: string;
  detail: string;
};

export type OwnerCommandSurfaceData = {
  surfaceStatus: {
    mode: string;
    runtime: string;
    posture: string;
    dispatch: string;
  };
  copy: {
    badges: readonly string[];
    surfaceLabel: string;
    heroTitle: string;
    heroDetail: string;
    draftLabel: string;
    draftAriaLabel: string;
    draftPlaceholder: string;
    preparePacketAction: string;
    resetAction: string;
    dispatchUnavailable: string;
    lensGroupLabel: string;
    activeLensLabel: string;
    reviewPacketLabel: string;
    planEyebrow: string;
    planTitle: string;
    planDetail: string;
    approvalTitle: string;
    approvalDetail: string;
    approvalStatus: string;
    blockedActionsEyebrow: string;
    blockedActionsTitle: string;
    blockedActionsNote: string;
    agentTitle: string;
    agentDetail: string;
    agentStatus: string;
    agentNextLabel: string;
    evidenceTitle: string;
    evidenceDetail: string;
    outputTitle: string;
    auditTitle: string;
    auditDetail: string;
    auditBadge: string;
  };
  draft: {
    title: string;
    prompt: string;
    boundary: string;
  };
  reviewPacket: {
    title: string;
    summary: string;
    sections: readonly {
      label: string;
      value: string;
    }[];
  };
  readinessChecks: readonly CommandStatusItem[];
  modeTabs: readonly {
    key: CommandMode;
    label: string;
    icon: CommandModeIcon;
  }[];
  modePanels: Record<string, CommandStatusItem & { title: string }>;
  reviewPacketModeKey: CommandMode;
  planStages: readonly (CommandStatusItem & {
    label: string;
    owner: string;
    proof: string;
  })[];
  approvals: readonly (CommandStatusItem & {
    title: string;
    decision: string;
  })[];
  agents: readonly {
    name: string;
    role: CommandAgentRole;
    state: string;
    tone: string;
    focus: string;
    next: string;
  }[];
  evidenceRequirements: readonly CommandStatusItem[];
  outputShelf: readonly {
    title: string;
    state: string;
    detail: string;
  }[];
  unavailableActions: readonly string[];
  auditRules: readonly string[];
};

const agentIcons = {
  Orchestrator: Bot,
  Product: Sparkles,
  Implementation: Boxes,
  Evidence: GitBranch,
  "Research-only": FileSearch
} as const;

const modeIcons = {
  radio: Radio,
  waypoints: Waypoints,
  clipboard: ClipboardCheck,
  file_search: FileSearch,
  shield: ShieldCheck
} as const satisfies Record<CommandModeIcon, typeof Radio>;

const commandZhOverrides: Partial<Record<string, string>> = {
  "Required before execution APIs": "执行类 API 上线前的前置条件",
  "Local mission packet": "本地任务包",
  "Browser-local preview": "浏览器本地预览",
  "This preview turns the current draft into a reviewable packet without saving, sending, approving, or dispatching work.":
    "这个预览把当前草稿整理成可审核任务包，但不会保存、发送、审批或派发工作。",
  "Draft intent": "草稿意图",
  "Selected lens": "当前视角",
  "Draft size": "草稿体量",
  "No draft text yet.": "还没有草稿内容。",
  "Not saved, sent, approved, or dispatched.": "不会保存、发送、审批或派发。"
};

function commandText(value: string | undefined, locale: SiteLocale) {
  if (!value) return "";
  if (locale !== "zh") return value;
  return commandZhOverrides[value] ?? translateToZh(value) ?? value;
}

function draftExcerpt(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();
  const characters = Array.from(normalized);

  if (characters.length === 0) {
    return null;
  }

  const clipped = characters.slice(0, 220).join("");
  return characters.length > 220 ? `${clipped}...` : clipped;
}

function draftSizeLabel({
  lines,
  locale,
  primary
}: {
  lines: number;
  locale: SiteLocale;
  primary: {
    label: string;
    value: number;
  };
}) {
  const lineLabel = locale === "zh" ? "行有效内容" : lines === 1 ? "active line" : "active lines";

  return `${primary.value} ${primary.label} · ${lines} ${lineLabel}`;
}

function safeTone(tone: string): Tone {
  if (tone === "normal" || tone === "warning" || tone === "private") {
    return tone;
  }

  return "info";
}

function CommandStatusBadge({ children, tone }: { children: React.ReactNode; tone: Tone }) {
  const className = {
    normal: "border-emerald-200/25 bg-emerald-300/10 text-emerald-100",
    info: "border-sky-200/25 bg-sky-300/10 text-sky-100",
    warning: "border-yellow-200/30 bg-yellow-300/10 text-yellow-100",
    private: "border-violet-200/25 bg-violet-300/10 text-violet-100"
  }[tone];

  return (
    <span className={`inline-flex items-center rounded-[8px] border px-2.5 py-1 text-xs font-bold uppercase ${className}`}>
      {children}
    </span>
  );
}

function CommandWorkspace({
  activeMode,
  setActiveMode,
  data,
  locale
}: {
  activeMode: CommandMode;
  setActiveMode: (mode: CommandMode) => void;
  data: OwnerCommandSurfaceData;
  locale: SiteLocale;
}) {
  const t = (value: string | undefined) => commandText(value, locale);
  const defaultDraft = useMemo(() => t(data.draft.prompt), [data.draft.prompt, locale]);
  const [draft, setDraft] = useState<string>(defaultDraft);
  const [draftWasEdited, setDraftWasEdited] = useState(false);
  const fallbackMode = data.modeTabs[0]?.key ?? data.reviewPacketModeKey;
  const activePanel = data.modePanels[activeMode] ?? data.modePanels[fallbackMode];
  const draftWords = useMemo(() => draft.trim().split(/\s+/).filter(Boolean).length, [draft]);
  const draftCharacters = useMemo(() => Array.from(draft.replace(/\s/g, "")).length, [draft]);
  const draftLines = useMemo(() => draft.split(/\n/).filter((line) => line.trim().length > 0).length, [draft]);
  const localDraftExcerpt = useMemo(() => draftExcerpt(draft), [draft]);
  const commandMetrics = [
    {
      label: "Plan gates",
      value: data.planStages.length.toString(),
      detail: "Visible before work moves",
      toneClass: "border-sky-200/25 bg-sky-300/10 text-sky-100"
    },
    {
      label: "Owner checkpoints",
      value: data.approvals.length.toString(),
      detail: "Review states, not execution",
      toneClass: "border-yellow-200/30 bg-yellow-300/10 text-yellow-100"
    },
    {
      label: "Evidence checks",
      value: data.evidenceRequirements.length.toString(),
      detail: "Required before PR/deploy",
      toneClass: "border-emerald-200/25 bg-emerald-300/10 text-emerald-100"
    },
    {
      label: "Blocked actions",
      value: data.unavailableActions.length.toString(),
      detail: "No dispatch in this slice",
      toneClass: "border-violet-200/25 bg-violet-300/10 text-violet-100"
    }
  ] as const;
  const primaryDraftMetric = locale === "zh"
    ? { value: draftCharacters, label: "字符" }
    : { value: draftWords, label: "words" };
  const lineMetricLabel = locale === "zh" ? "行有效内容" : draftLines === 1 ? "active line" : "active lines";

  useEffect(() => {
    if (!draftWasEdited) {
      setDraft(defaultDraft);
    }
  }, [defaultDraft, draftWasEdited]);

  return (
    <section
      className="panel relative isolate overflow-hidden p-0"
      aria-labelledby="owner-command-title"
    >
      <div
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-2/3 bg-[radial-gradient(circle_at_68%_16%,rgba(56,189,248,0.22),transparent_34%),radial-gradient(circle_at_84%_74%,rgba(250,204,21,0.13),transparent_30%),linear-gradient(135deg,transparent,rgba(59,130,246,0.10))]"
        aria-hidden
      />
      <div className="grid min-h-[34rem] gap-0 xl:grid-cols-[minmax(0,1.08fr)_32rem]">
        <div className="relative overflow-hidden p-6 md:p-8">
          <div
            className="pointer-events-none absolute -right-28 -top-32 size-96 rounded-full bg-sky-500/14 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 left-1/2 h-44 w-[46rem] -translate-x-1/2 rounded-t-full border border-sky-200/10 bg-[radial-gradient(circle_at_50%_100%,rgba(56,189,248,0.12),transparent_62%)]"
            aria-hidden
          />

          <div className="relative inline-flex items-center gap-2 rounded-[8px] border border-sky-200/25 bg-sky-300/10 px-3 py-2 text-xs font-bold uppercase text-sky-100">
            <Radio size={14} aria-hidden />
            {t(data.copy.surfaceLabel)}
          </div>

          <div className="relative mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-violet-200/25 bg-violet-300/10 px-3 py-1.5 text-xs font-bold uppercase text-violet-100">
              <LockKeyhole size={14} aria-hidden />
              {t(data.copy.badges[0])}
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-emerald-200/25 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold uppercase text-emerald-100">
              <Radio size={14} aria-hidden />
              {t(data.copy.badges[1])}
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 px-3 py-1.5 text-xs font-bold uppercase text-yellow-100">
              <ShieldCheck size={14} aria-hidden />
              {t(data.copy.badges[2])}
            </span>
          </div>

          <div className="relative mt-8 max-w-4xl">
            <p className="eyebrow">{t(data.surfaceStatus.posture)}</p>
            <h2 id="owner-command-title" className="mt-2 max-w-4xl text-3xl font-semibold leading-[1.04] text-white md:text-5xl">
              {t(data.copy.heroTitle)}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
              {t(data.copy.heroDetail)}
            </p>
          </div>

          <div className="relative mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {commandMetrics.map((metric) => (
              <div key={metric.label} className={`rounded-[8px] border p-4 ${metric.toneClass}`}>
                <p className="text-xs font-bold uppercase text-current">{t(metric.label)}</p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <p className="text-xs leading-5 text-slate-200/85">{t(metric.detail)}</p>
                  <p className="text-3xl font-semibold leading-none text-white">{metric.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative mt-5 rounded-[8px] border border-slate-700 bg-[#07111f]/76 p-4 shadow-[0_20px_80px_rgba(14,165,233,0.10)] backdrop-blur">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-yellow-100">{t(data.copy.draftLabel)}</p>
                <h3 className="mt-1 text-xl font-semibold text-white">{t(data.draft.title)}</h3>
              </div>
              <CommandStatusBadge tone="private">{t(data.surfaceStatus.mode)}</CommandStatusBadge>
            </div>
            <textarea
              aria-label={t(data.copy.draftAriaLabel)}
              value={draft}
              onChange={(event) => {
                setDraftWasEdited(true);
                setDraft(event.target.value);
              }}
              className="link-focus mt-4 min-h-40 w-full resize-y rounded-[8px] border border-slate-700 bg-black/20 p-4 text-sm leading-7 text-slate-100 transition placeholder:text-slate-500 focus:border-sky-200/50 focus:bg-[#020817]/60"
              placeholder={t(data.copy.draftPlaceholder)}
            />
            <div className="mt-3 grid gap-3 text-sm text-slate-300 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="flex flex-wrap gap-3">
                <span>
                  <strong className="text-white">{primaryDraftMetric.value}</strong> {primaryDraftMetric.label}
                </span>
                <span>
                  <strong className="text-white">{draftLines}</strong> {lineMetricLabel}
                </span>
                <span>{t(data.surfaceStatus.runtime)}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMode(data.reviewPacketModeKey)}
                  className="link-focus inline-flex items-center gap-2 rounded-[8px] bg-sky-300 px-3 py-2 text-sm font-semibold text-slate-950 shadow-[0_16px_36px_rgba(14,165,233,0.18)] transition hover:bg-sky-200"
                >
                  {t(data.copy.preparePacketAction)}
                  <ArrowRight size={15} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraftWasEdited(false);
                    setDraft(defaultDraft);
                  }}
                  className="link-focus inline-flex items-center gap-2 rounded-[8px] border border-slate-700 bg-white/[0.045] px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-200/35 hover:text-white"
                >
                  <RotateCcw size={15} aria-hidden />
                  {t(data.copy.resetAction)}
                </button>
                <span className="inline-flex items-center gap-2 rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 px-3 py-2 text-sm font-semibold text-yellow-50">
                  <LockKeyhole size={15} aria-hidden />
                  {t(data.copy.dispatchUnavailable)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <section
          className="relative border-t border-slate-700/70 bg-[#07111f]/45 p-5 md:p-6 xl:border-l xl:border-t-0"
          aria-labelledby="command-mode-title"
        >
          <div
            className="pointer-events-none absolute inset-x-6 top-6 h-48 rounded-full bg-sky-500/12 blur-3xl"
            aria-hidden
          />
          <div
            className="relative mb-4 grid gap-2 rounded-[8px] border border-slate-700 bg-[#07111f]/76 p-2 shadow-[0_16px_48px_rgba(14,165,233,0.08)] sm:grid-cols-5"
            role="group"
            aria-label={t(data.copy.lensGroupLabel)}
          >
            {data.modeTabs.map((mode) => {
              const Icon = modeIcons[mode.icon] ?? Radio;
              const active = activeMode === mode.key;

              return (
                <button
                  key={mode.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveMode(mode.key)}
                  className={`link-focus inline-flex items-center justify-center gap-2 rounded-[8px] border px-3 py-2 text-xs font-semibold transition ${
                    active
                      ? "border-sky-200/45 bg-sky-300/14 text-white shadow-[0_10px_24px_rgba(14,165,233,0.08)]"
                      : "border-transparent bg-transparent text-slate-300 hover:border-sky-200/25 hover:bg-white/[0.055] hover:text-white"
                  }`}
                >
                  <Icon size={15} aria-hidden />
                  {t(mode.label)}
                </button>
              );
            })}
          </div>
          <div className="relative rounded-[8px] border border-slate-700 bg-[#07111f]/76 p-5 shadow-[0_20px_80px_rgba(14,165,233,0.10)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-yellow-100">{t(data.copy.activeLensLabel)}</p>
                <h3 id="command-mode-title" className="mt-1 text-xl font-semibold text-white">
                  {t(activePanel.title)}
                </h3>
              </div>
              <span className="flex size-11 items-center justify-center rounded-[8px] border border-sky-200/25 bg-sky-300/10 text-sky-100">
                <Sparkles size={21} aria-hidden />
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">{t(activePanel.detail)}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <CommandStatusBadge tone={safeTone(activePanel.tone)}>{t(activePanel.state)}</CommandStatusBadge>
              <CommandStatusBadge tone="private">{t(data.surfaceStatus.dispatch)}</CommandStatusBadge>
            </div>
          </div>

          <section
            className="relative mt-4 rounded-[8px] border border-slate-700 bg-white/[0.045] p-5"
            aria-labelledby="command-review-packet-title"
          >
            <p className="text-xs font-bold uppercase text-yellow-100">{t(data.copy.reviewPacketLabel)}</p>
            <h3 id="command-review-packet-title" className="mt-1 text-xl font-semibold text-white">
              {t(data.reviewPacket.title)}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{t(data.reviewPacket.summary)}</p>
            <div className="mt-4 grid gap-3">
              {data.reviewPacket.sections.map((section) => (
                <div key={section.label} className="grid grid-cols-[5.5rem_1fr] gap-3 rounded-[8px] border border-slate-700 bg-black/15 p-3">
                  <span className="text-xs font-bold uppercase text-slate-400">{t(section.label)}</span>
                  <span className="text-sm font-semibold text-white">{t(section.value)}</span>
                </div>
              ))}
            </div>
          </section>

          <section
            className="relative mt-4 rounded-[8px] border border-sky-200/25 bg-sky-300/10 p-5"
            aria-labelledby="command-local-packet-title"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-sky-100">{t("Browser-local preview")}</p>
                <h3 id="command-local-packet-title" className="mt-1 text-xl font-semibold text-white">
                  {t("Local mission packet")}
                </h3>
              </div>
              <CommandStatusBadge tone="private">{t(data.surfaceStatus.dispatch)}</CommandStatusBadge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {t("This preview turns the current draft into a reviewable packet without saving, sending, approving, or dispatching work.")}
            </p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-3">
                <p className="text-xs font-bold uppercase text-slate-400">{t("Draft intent")}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-white">
                  {localDraftExcerpt ?? t("No draft text yet.")}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-3">
                  <p className="text-xs font-bold uppercase text-slate-400">{t("Selected lens")}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-white">{t(activePanel.title)}</p>
                </div>
                <div className="rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-3">
                  <p className="text-xs font-bold uppercase text-slate-400">{t("Draft size")}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-white">
                    {draftSizeLabel({ lines: draftLines, locale, primary: primaryDraftMetric })}
                  </p>
                </div>
              </div>
              <div className="rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 p-3">
                <p className="text-xs font-bold uppercase text-yellow-100">{t("Boundary")}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-yellow-50">{t(data.draft.boundary)}</p>
              </div>
            </div>
            <p className="mt-4 text-xs font-semibold uppercase text-slate-400">
              {t("Not saved, sent, approved, or dispatched.")}
            </p>
          </section>

          <div className="relative mt-4 grid gap-3">
            {data.readinessChecks.map((check) => (
              <article key={check.label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-white">{t(check.label)}</h4>
                  <CommandStatusBadge tone={safeTone(check.tone)}>{t(check.state)}</CommandStatusBadge>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-300">{t(check.detail)}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function PlanPreview({ data, locale }: { data: OwnerCommandSurfaceData; locale: SiteLocale }) {
  const t = (value: string | undefined) => commandText(value, locale);

  return (
    <section className="panel overflow-hidden p-0" aria-labelledby="command-plan-title">
      <div className="grid gap-0 xl:grid-cols-[20rem_minmax(0,1fr)]">
        <div className="border-b border-slate-700 bg-white/[0.035] p-5 md:p-6 xl:border-b-0 xl:border-r">
          <div className="flex size-11 items-center justify-center rounded-[8px] border border-sky-200/25 bg-sky-300/10 text-sky-100">
            <Waypoints size={22} aria-hidden />
          </div>
          <p className="eyebrow mt-5">{t(data.copy.planEyebrow)}</p>
          <h2 id="command-plan-title" className="mt-2 text-2xl font-semibold text-white">
            {t(data.copy.planTitle)}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {t(data.copy.planDetail)}
          </p>
        </div>
        <div className="grid gap-3 p-4 md:p-5 xl:grid-cols-5">
          {data.planStages.map((stage, index) => (
            <article key={stage.label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <div className="flex items-start justify-between gap-3">
                <span
                  className="flex size-9 items-center justify-center rounded-[8px] border border-sky-200/35 bg-sky-200/16 text-xs font-semibold text-white"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <StatusBadge tone={safeTone(stage.tone)}>{t(stage.state)}</StatusBadge>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{t(stage.label)}</h3>
              <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{t(stage.owner)}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{t(stage.detail)}</p>
              <p className="mt-4 rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-3 text-xs leading-5 text-slate-400">
                {t(stage.proof)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ApprovalGate({ data, locale }: { data: OwnerCommandSurfaceData; locale: SiteLocale }) {
  const t = (value: string | undefined) => commandText(value, locale);

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="panel p-5" aria-labelledby="command-approval-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-yellow-100">
              <ClipboardCheck size={22} aria-hidden />
              <h2 id="command-approval-title" className="text-2xl font-semibold text-white">
                {t(data.copy.approvalTitle)}
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              {t(data.copy.approvalDetail)}
            </p>
          </div>
          <StatusBadge tone="warning">{t(data.copy.approvalStatus)}</StatusBadge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {data.approvals.map((approval) => (
            <article key={approval.title} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-white">{t(approval.title)}</h3>
                <StatusBadge tone={safeTone(approval.tone)}>{t(approval.state)}</StatusBadge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{t(approval.detail)}</p>
              <p className="mt-3 rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-3 text-xs leading-5 text-slate-400">
                {t(approval.decision)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <UnavailableControlsPanel
        eyebrow={t(data.copy.blockedActionsEyebrow)}
        title={t(data.copy.blockedActionsTitle)}
        items={data.unavailableActions.map((item) => t(item))}
        note={t(data.copy.blockedActionsNote)}
        unavailableLabel={t("unavailable")}
      />
    </section>
  );
}

function AgentRouting({ data, locale }: { data: OwnerCommandSurfaceData; locale: SiteLocale }) {
  const t = (value: string | undefined) => commandText(value, locale);

  return (
    <section className="panel p-5" aria-labelledby="command-agent-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Bot size={22} aria-hidden />
            <h2 id="command-agent-title" className="text-2xl font-semibold text-white">
              {t(data.copy.agentTitle)}
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {t(data.copy.agentDetail)}
          </p>
        </div>
        <StatusBadge tone="info">{t(data.copy.agentStatus)}</StatusBadge>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {data.agents.map((agent) => {
          const Icon = agentIcons[agent.role] ?? Bot;

          return (
            <article key={agent.name} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-10 items-center justify-center rounded-[8px] bg-sky-300/10 text-sky-100">
                  <Icon size={19} aria-hidden />
                </span>
                <StatusBadge tone={safeTone(agent.tone)}>{t(agent.state)}</StatusBadge>
              </div>
              <h3 className="mt-4 font-semibold text-white">{t(agent.name)}</h3>
              <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{t(agent.role)}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{t(agent.focus)}</p>
              <p className="mt-3 rounded-[8px] border border-slate-700 bg-black/15 p-3 text-xs leading-5 text-slate-400">
                {t(data.copy.agentNextLabel)}: {t(agent.next)}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function EvidenceShelf({ data, locale }: { data: OwnerCommandSurfaceData; locale: SiteLocale }) {
  const t = (value: string | undefined) => commandText(value, locale);

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="panel p-5" aria-labelledby="command-evidence-title">
        <div className="flex items-center gap-2 text-yellow-100">
          <FileSearch size={22} aria-hidden />
          <h2 id="command-evidence-title" className="text-2xl font-semibold text-white">
            {t(data.copy.evidenceTitle)}
          </h2>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          {t(data.copy.evidenceDetail)}
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {data.evidenceRequirements.map((item) => (
            <article key={item.title} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold text-white">{t(item.title)}</h3>
                <StatusBadge tone={safeTone(item.tone)}>{t(item.state)}</StatusBadge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{t(item.detail)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel p-5" aria-labelledby="command-output-title">
        <div className="flex items-center gap-2 text-sky-100">
          <ClipboardCheck size={20} aria-hidden />
          <h2 id="command-output-title" className="text-xl font-semibold text-white">
            {t(data.copy.outputTitle)}
          </h2>
        </div>
        <div className="mt-4 grid gap-3">
          {data.outputShelf.map((item) => (
            <article key={item.title} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-white">{t(item.title)}</h3>
                <span className="text-xs font-bold uppercase text-yellow-100">{t(item.state)}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{t(item.detail)}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function AuditBoundary({ data, locale }: { data: OwnerCommandSurfaceData; locale: SiteLocale }) {
  const t = (value: string | undefined) => commandText(value, locale);

  return (
    <section className="panel p-5" aria-labelledby="command-audit-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-200">
            <CheckCircle2 size={22} aria-hidden />
            <h2 id="command-audit-title" className="text-2xl font-semibold text-white">
              {t(data.copy.auditTitle)}
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {t(data.copy.auditDetail)}
          </p>
        </div>
        <div className="rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 px-4 py-3">
          <div className="flex items-center gap-2 text-yellow-50">
            <LockKeyhole size={17} aria-hidden />
            <span className="text-sm font-semibold">{t(data.copy.auditBadge)}</span>
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {data.auditRules.map((rule) => (
          <div key={rule} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 text-sm leading-6 text-slate-300">
            {t(rule)}
          </div>
        ))}
      </div>
    </section>
  );
}

export function OwnerCommandSurface({ data }: { data: OwnerCommandSurfaceData }) {
  const { locale } = useLanguage();
  const [activeMode, setActiveMode] = useState<CommandMode>(data.modeTabs[0]?.key ?? data.reviewPacketModeKey);
  const t = (value: string | undefined) => commandText(value, locale);

  return (
    <div className="grid gap-5" data-i18n-skip>
      <CommandWorkspace activeMode={activeMode} setActiveMode={setActiveMode} data={data} locale={locale} />
      <PlanPreview data={data} locale={locale} />
      <ApprovalGate data={data} locale={locale} />
      <AgentRouting data={data} locale={locale} />
      <EvidenceShelf data={data} locale={locale} />
      <AuditBoundary data={data} locale={locale} />

      <section className="rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 p-4 text-sm font-semibold leading-6 text-yellow-50">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 shrink-0" size={18} aria-hidden />
          <p>{t(data.draft.boundary)}</p>
        </div>
      </section>
    </div>
  );
}
