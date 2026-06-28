"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CircleDashed,
  Eye,
  FileSearch,
  LockKeyhole,
  Palette,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  Waypoints,
  XCircle,
  ArrowRight,
  CalendarClock,
  ClipboardCheck,
  Gauge
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { StatusBadge } from "@/components/StatusBadge";
import { translateToZh, type SiteLocale } from "@/lib/site-i18n";

type SettingsTone = "normal" | "info" | "warning" | "private" | "danger";
type SettingsLifecycle = "held" | "status-only" | "planned" | "blocked";

type OwnerSettingMetric = {
  lifecycle: SettingsLifecycle;
  label: string;
  value: string;
  detail: string;
};

type OwnerSettingLane = {
  label: string;
  owner: string;
  state: string;
  tone: SettingsTone;
  detail: string;
};

type OwnerProfileSetting = {
  id: string;
  label: string;
  value: string;
  status: string;
  tone: SettingsTone;
  detail: string;
};

type OwnerSettingsPacket = {
  id: string;
  lifecycle: SettingsLifecycle;
  title: string;
  domain: string;
  state: string;
  tone: SettingsTone;
  summary: string;
  visibleValue: string;
  ownerGate: string;
  evidence: readonly {
    label: string;
    state: string;
    tone: SettingsTone;
    detail: string;
  }[];
  risks: readonly string[];
  noGo: readonly string[];
};

type OwnerNotificationPreference = {
  id: string;
  label: string;
  state: string;
  tone: SettingsTone;
  cadence: string;
  detail: string;
  boundary: string;
};

export type OwnerSettingsSurfaceData = {
  profile: readonly OwnerProfileSetting[];
  packets: readonly OwnerSettingsPacket[];
  notifications: readonly OwnerNotificationPreference[];
  metrics: readonly OwnerSettingMetric[];
  lanes: readonly OwnerSettingLane[];
  policy: readonly string[];
  unavailableControls: readonly string[];
};

type SettingsContextLink = {
  label: string;
  href: string;
  tone: SettingsTone;
  icon: LucideIcon;
  detail: string;
  boundary: string;
};

const settingsMetricIcons = {
  held: ShieldCheck,
  "status-only": Eye,
  planned: CircleDashed,
  blocked: LockKeyhole
} as const satisfies Record<SettingsLifecycle, LucideIcon>;

const settingsMetricToneClass = {
  held: "border-emerald-200/25 bg-emerald-300/10 text-emerald-100",
  "status-only": "border-sky-200/25 bg-sky-300/10 text-sky-100",
  planned: "border-yellow-200/30 bg-yellow-300/10 text-yellow-100",
  blocked: "border-violet-200/25 bg-violet-300/10 text-violet-100"
} as const satisfies Record<SettingsLifecycle, string>;

const settingsContextLinks = [
  {
    label: "Open system health",
    href: "/app/system",
    tone: "info",
    icon: Gauge,
    detail: "Check owner-only diagnostics before changing any future setting behavior.",
    boundary: "No repair control"
  },
  {
    label: "Open schedules",
    href: "/app/schedules",
    tone: "warning",
    icon: CalendarClock,
    detail: "Review recurring work rhythm without mutating cron, delivery, or reminder state.",
    boundary: "No scheduler mutation"
  },
  {
    label: "Open review queue",
    href: "/app/review",
    tone: "private",
    icon: ClipboardCheck,
    detail: "Route settings-related questions into explicit owner review instead of silent preference writes.",
    boundary: "No silent auto-promotion"
  }
] as const satisfies readonly SettingsContextLink[];

const settingsZhOverrides: Partial<Record<string, string>> = {
  "Settings context bridge": "设置上下文桥",
  "Move from settings posture into owner-only context without changing preferences, credentials, accounts, notifications, or schedules.":
    "从设置姿态进入仅本人可见的上下文，但不变更偏好、凭据、账户、通知或日程。",
  "Owner context": "本人上下文",
  "Open schedules": "打开日程",
  "Open review queue": "打开审核队列",
  "Check owner-only diagnostics before changing any future setting behavior.":
    "在未来改变任何设置行为前，先检查仅本人可见的诊断。",
  "Review recurring work rhythm without mutating cron, delivery, or reminder state.":
    "查看周期性工作节奏，但不变更 cron、投递或提醒状态。",
  "Route settings-related questions into explicit owner review instead of silent preference writes.":
    "把设置相关问题送入明确的本人审核，而不是静默写入偏好。",
  "No repair control": "不提供修复控制",
  "No silent auto-promotion": "不静默自动推进",
  "No scheduler mutation": "不修改调度器",
  "Read-only": "只读",
  Unavailable: "不可用",
  "Reveal credential": "显示凭据",
  "Copy credential": "复制凭据",
  "Rotate token": "轮换令牌",
  "Connect account": "连接账户",
  "Save preference": "保存偏好",
  "Send notification": "发送通知",
  "Owner visible": "本人可见",
  Curated: "已精选",
  "No-go actions": "禁止动作",
  "Owner-only": "仅本人",
  "Status-only": "仅状态",
  held: "保持",
  "status-only": "仅状态",
  planned: "计划中",
  blocked: "阻塞",
  Active: "活跃",
  Hidden: "隐藏",
  "Owner gated": "本人门禁",
  "No mutation path": "没有变更路径"
};

function settingsText(value: string | undefined, locale: SiteLocale) {
  if (!value) return "";
  return locale === "zh" ? settingsZhOverrides[value] ?? translateToZh(value) ?? value : value;
}

function MetricCard({ metric }: { metric: OwnerSettingMetric }) {
  const { locale } = useLanguage();
  const t = (value: string | undefined) => settingsText(value, locale);
  const Icon = settingsMetricIcons[metric.lifecycle] ?? Settings2;
  const toneClass = settingsMetricToneClass[metric.lifecycle] ?? settingsMetricToneClass["status-only"];

  return (
    <article className={`rounded-[8px] border p-4 ${toneClass}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase text-current">{t(metric.label)}</p>
        <Icon size={17} aria-hidden />
      </div>
      <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-200/85">{t(metric.detail)}</p>
    </article>
  );
}

function SettingsHero({ data, primaryPacket }: { data: OwnerSettingsSurfaceData; primaryPacket: OwnerSettingsPacket }) {
  const { locale } = useLanguage();
  const t = (value: string | undefined) => settingsText(value, locale);

  return (
    <section className="panel relative isolate overflow-hidden" aria-labelledby="settings-title">
      <div
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-2/3 bg-[radial-gradient(circle_at_64%_18%,rgba(56,189,248,0.22),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(250,204,21,0.12),transparent_30%),linear-gradient(135deg,transparent,rgba(59,130,246,0.10))]"
        aria-hidden
      />
      <div className="grid min-h-[30rem] gap-0 xl:grid-cols-[minmax(0,1fr)_30rem]">
        <div className="relative overflow-hidden p-6 md:p-7">
          <div
            className="pointer-events-none absolute bottom-0 left-0 h-52 w-[42rem] rounded-tr-full border border-sky-200/10 bg-[radial-gradient(circle_at_35%_100%,rgba(56,189,248,0.12),rgba(250,204,21,0.10)_45%,transparent_70%)]"
            aria-hidden
          />

          <div className="relative inline-flex items-center gap-2 rounded-[8px] border border-sky-200/25 bg-sky-300/10 px-3 py-2 text-xs font-bold uppercase text-sky-100">
            <Settings2 size={14} aria-hidden />
            {t("Owner Settings")}
          </div>

          <div className="relative mt-5 max-w-4xl">
            <h2 id="settings-title" className="max-w-4xl text-3xl font-semibold leading-[1.04] text-white md:text-5xl">
              {t("Settings describe posture. They do not become controls.")}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
              {t("Settings show profile posture, session status, display modes, and notification intent. They do not reveal token material, connect accounts, send notifications, edit schedules, or write preferences.")}
            </p>
          </div>

          <div className="relative mt-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-violet-200/25 bg-violet-300/10 px-3 py-1.5 text-xs font-bold uppercase text-violet-100">
              <LockKeyhole size={14} aria-hidden />
              {t("Owner-only")}
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-emerald-200/25 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold uppercase text-emerald-100">
              <ShieldCheck size={14} aria-hidden />
              {t("Status-only")}
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 px-3 py-1.5 text-xs font-bold uppercase text-yellow-100">
              <XCircle size={14} aria-hidden />
              {t("No secret display")}
            </span>
          </div>

          <div className="relative mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {data.metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
          </div>
        </div>

        <div className="relative border-t border-slate-700/70 bg-[#07111f]/45 p-5 md:p-6 xl:border-l xl:border-t-0">
          <div className="pointer-events-none absolute inset-x-6 top-6 h-48 rounded-full bg-sky-500/12 blur-3xl" aria-hidden />
          <div className="relative rounded-[8px] border border-slate-700 bg-[#07111f]/76 p-5 shadow-[0_20px_80px_rgba(14,165,233,0.10)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-yellow-100">{t("Primary boundary")}</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{t(primaryPacket.title)}</h3>
                <p className="mt-1 text-xs font-bold uppercase text-sky-100">{t(primaryPacket.domain)}</p>
              </div>
              <span className="flex size-12 items-center justify-center rounded-[8px] border border-sky-200/25 bg-sky-300/10 text-sky-100">
                <Settings2 size={23} aria-hidden />
              </span>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-300">{t(primaryPacket.summary)}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <StatusBadge tone={primaryPacket.tone}>{t(primaryPacket.state)}</StatusBadge>
              <StatusBadge tone="private">{t("Owner gated")}</StatusBadge>
            </div>
          </div>

          <div className="relative mt-4 grid gap-3">
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">{t("Visible value")}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-white">{t(primaryPacket.visibleValue)}</p>
            </div>
            <div className="rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 p-4">
              <p className="text-xs font-bold uppercase text-yellow-100">{t("Owner gate")}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-yellow-50">{t(primaryPacket.ownerGate)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SettingsLanes({ lanes }: { lanes: readonly OwnerSettingLane[] }) {
  const { locale } = useLanguage();
  const t = (value: string | undefined) => settingsText(value, locale);

  return (
    <section className="panel p-5" aria-labelledby="settings-lanes-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Waypoints size={22} aria-hidden />
            <h2 id="settings-lanes-title" className="text-2xl font-semibold text-white">{t("Settings lanes")}</h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {t("Each lane describes a preference surface and the boundary that keeps settings from becoming a credential, account, notification, or runtime control panel.")}
          </p>
        </div>
        <StatusBadge tone="private">{t("Owner visible")}</StatusBadge>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {lanes.map((lane, index) => (
          <article key={lane.label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-9 items-center justify-center rounded-[8px] border border-sky-200/35 bg-sky-200/16 text-xs font-semibold text-white" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <StatusBadge tone={lane.tone}>{t(lane.state)}</StatusBadge>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">{t(lane.label)}</h3>
            <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{t(lane.owner)}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{t(lane.detail)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SettingsContextBridge() {
  const { locale } = useLanguage();
  const t = (value: string | undefined) => settingsText(value, locale);

  return (
    <section className="panel p-5" aria-labelledby="settings-context-bridge-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Waypoints size={22} aria-hidden />
            <h2 id="settings-context-bridge-title" className="text-2xl font-semibold text-white">
              {t("Settings context bridge")}
            </h2>
          </div>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
            {t("Move from settings posture into owner-only context without changing preferences, credentials, accounts, notifications, or schedules.")}
          </p>
        </div>
        <StatusBadge tone="info">{t("Owner context")}</StatusBadge>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {settingsContextLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              className="link-focus group rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 transition hover:border-sky-200/35 hover:bg-sky-300/10"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] border border-sky-200/30 bg-sky-300/12 text-sky-100">
                  <Icon size={18} aria-hidden />
                </span>
                <StatusBadge tone={link.tone}>{t(link.boundary)}</StatusBadge>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-white">{t(link.label)}</h3>
                <ArrowRight className="shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-sky-100" size={16} aria-hidden />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{t(link.detail)}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function SettingsPacket({ packet, index }: { packet: OwnerSettingsPacket; index: number }) {
  const { locale } = useLanguage();
  const t = (value: string | undefined) => settingsText(value, locale);

  return (
    <article className="panel p-5" aria-labelledby={`settings-packet-${packet.id}`}>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">{String(index + 1).padStart(2, "0")} - {t(packet.domain)}</p>
              <h3 id={`settings-packet-${packet.id}`} className="mt-2 text-2xl font-semibold text-white">{t(packet.title)}</h3>
              <p className="mt-2 text-xs font-bold uppercase text-slate-400">
                {t(packet.lifecycle)} - {t(packet.state)}
              </p>
            </div>
            <StatusBadge tone={packet.tone}>{t(packet.state)}</StatusBadge>
          </div>

          <p className="mt-5 max-w-4xl text-sm leading-6 text-slate-300">{t(packet.summary)}</p>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">{t("Visible value")}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{t(packet.visibleValue)}</p>
            </div>
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">{t("Owner gate")}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{t(packet.ownerGate)}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {packet.evidence.map((evidence) => (
              <div key={`${packet.id}-${evidence.label}`} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase text-slate-400">{t(evidence.label)}</p>
                  <StatusBadge tone={evidence.tone}>{t(evidence.state)}</StatusBadge>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{t(evidence.detail)}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="grid content-start gap-4">
          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 text-yellow-100">
              <FileSearch size={17} aria-hidden />
              <p className="text-sm font-semibold">{t("Watch items")}</p>
            </div>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-300">
              {packet.risks.map((risk) => (
                <li key={`${packet.id}-${risk}`} className="flex gap-2">
                  <Eye className="mt-1 shrink-0 text-yellow-100" size={15} aria-hidden />
                  <span>{t(risk)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 text-yellow-100">
              <XCircle size={17} aria-hidden />
              <p className="text-sm font-semibold">{t("No-go actions")}</p>
            </div>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-300">
              {packet.noGo.map((item) => (
                <li key={`${packet.id}-${item}`} className="flex gap-2">
                  <LockKeyhole className="mt-1 shrink-0 text-yellow-100" size={15} aria-hidden />
                  <span>{t(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </article>
  );
}

function SettingsPackets({ packets }: { packets: readonly OwnerSettingsPacket[] }) {
  const { locale } = useLanguage();
  const t = (value: string | undefined) => settingsText(value, locale);

  return (
    <section className="panel p-5" aria-labelledby="settings-packets-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Palette size={22} aria-hidden />
            <h2 id="settings-packets-title" className="text-2xl font-semibold text-white">{t("Settings packets")}</h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {t("Each packet describes visible preference posture, owner gate, evidence, watch items, and actions that must remain unavailable.")}
          </p>
        </div>
        <StatusBadge tone="warning">{t("No mutation path")}</StatusBadge>
      </div>

      <div className="mt-5 grid gap-4">
        {packets.map((packet, index) => <SettingsPacket key={packet.id} packet={packet} index={index} />)}
      </div>
    </section>
  );
}

function ProfileAndNotifications({ data }: { data: OwnerSettingsSurfaceData }) {
  const { locale } = useLanguage();
  const t = (value: string | undefined) => settingsText(value, locale);

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="panel p-5" aria-labelledby="profile-posture-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-100">
              <UserRound size={22} aria-hidden />
              <h2 id="profile-posture-title" className="text-2xl font-semibold text-white">{t("Profile posture")}</h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              {t("Profile fields identify the owner and public posture without exposing private channels or account details.")}
            </p>
          </div>
          <StatusBadge tone="normal">{t("Curated")}</StatusBadge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {data.profile.map((item) => (
            <article key={item.id} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase text-slate-400">{t(item.label)}</p>
                <StatusBadge tone={item.tone}>{t(item.status)}</StatusBadge>
              </div>
              <h3 className="mt-3 text-xl font-semibold text-white">{t(item.value)}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{t(item.detail)}</p>
            </article>
          ))}
        </div>
      </section>

      <aside className="panel p-5" aria-labelledby="notification-preferences-title">
        <div className="flex items-center gap-2 text-yellow-100">
          <Bell size={20} aria-hidden />
          <h2 id="notification-preferences-title" className="text-2xl font-semibold text-white">{t("Notification intent")}</h2>
        </div>
        <div className="mt-5 grid gap-3">
          {data.notifications.map((item) => (
            <article key={item.id} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-white">{t(item.label)}</h3>
                <StatusBadge tone={item.tone}>{t(item.state)}</StatusBadge>
              </div>
              <p className="mt-2 text-xs font-bold uppercase text-yellow-100">{t(item.cadence)}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{t(item.detail)}</p>
              <p className="mt-3 rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-3 text-xs leading-5 text-slate-400">
                {t(item.boundary)}
              </p>
            </article>
          ))}
        </div>
      </aside>
    </section>
  );
}

function SettingsBoundary({ data }: { data: OwnerSettingsSurfaceData }) {
  const { locale } = useLanguage();
  const t = (value: string | undefined) => settingsText(value, locale);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="panel p-5" aria-labelledby="settings-boundary-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-yellow-100">
              <ShieldCheck size={22} aria-hidden />
              <h2 id="settings-boundary-title" className="text-2xl font-semibold text-white">{t("Settings boundary")}</h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              {t("This page can summarize current preference posture. It cannot reveal credentials, mutate accounts, save preferences, or send notifications.")}
            </p>
          </div>
          <StatusBadge tone="private">{t("Read-only")}</StatusBadge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {data.policy.map((rule) => (
            <div key={rule} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 text-sm leading-6 text-slate-300">
              {t(rule)}
            </div>
          ))}
        </div>
      </section>

      <aside className="panel p-5" aria-labelledby="settings-unavailable-title">
        <div className="flex items-center gap-2 text-yellow-100">
          <SlidersHorizontal size={20} aria-hidden />
          <h2 id="settings-unavailable-title" className="text-2xl font-semibold text-white">{t("Unavailable")}</h2>
        </div>
        <div className="mt-5 grid gap-2">
          {data.unavailableControls.map((item) => (
            <div key={item} className="flex items-center justify-between gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] px-3 py-2 text-sm text-slate-300">
              <span>{t(item)}</span>
              <StatusBadge tone="private">{t("Unavailable")}</StatusBadge>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function EmptySettingsRegister() {
  const { locale } = useLanguage();
  const t = (value: string | undefined) => settingsText(value, locale);

  return (
    <section className="panel p-6 md:p-7" aria-labelledby="settings-empty-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Settings2 size={22} aria-hidden />
            <h2 id="settings-empty-title" className="text-2xl font-semibold text-white">{t("Settings register empty")}</h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {t("No owner-visible settings packets are available in this private mock source. The page remains read-only and never exposes credentials, account details, provider secrets, or mutation controls.")}
          </p>
        </div>
        <StatusBadge tone="private">{t("Owner-only")}</StatusBadge>
      </div>
    </section>
  );
}

export function OwnerSettingsSurface({ data }: { data: OwnerSettingsSurfaceData }) {
  const { locale } = useLanguage();
  const t = (value: string | undefined) => settingsText(value, locale);
  const primaryPacket = data.packets[0];

  if (!primaryPacket) {
    return (
      <div className="grid gap-5" data-i18n-skip>
        <h1 className="sr-only">{t("Private settings register")}</h1>
        <EmptySettingsRegister />
      </div>
    );
  }

  return (
    <div className="grid gap-5" data-i18n-skip>
      <h1 className="sr-only">{t("Private settings register")}</h1>
      <SettingsHero data={data} primaryPacket={primaryPacket} />
      <SettingsLanes lanes={data.lanes} />
      <SettingsContextBridge />
      <SettingsPackets packets={data.packets} />
      <ProfileAndNotifications data={data} />
      <SettingsBoundary data={data} />
    </div>
  );
}
