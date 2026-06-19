import type { ReactNode } from "react";
import {
  Bell,
  Eye,
  FileSearch,
  LockKeyhole,
  Palette,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  Waypoints,
  XCircle
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import {
  ownerNotificationPreferences,
  ownerProfileSettings,
  ownerSettingsLanes,
  ownerSettingsMetrics,
  ownerSettingsPackets,
  ownerSettingsPolicy,
  type OwnerSettingsPacket,
  type SettingsTone
} from "@/lib/private/settings";

export const dynamic = "force-dynamic";

const unavailableControls = [
  "Reveal credential",
  "Copy credential",
  "Rotate token",
  "Connect account",
  "Save preference",
  "Send notification"
] as const;

function LightStatusBadge({ children, tone }: { children: ReactNode; tone: SettingsTone }) {
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

function SettingsHero({ primaryPacket }: { primaryPacket: OwnerSettingsPacket }) {
  return (
    <section
      className="overflow-hidden rounded-[8px] border border-white/70 bg-white text-slate-950 shadow-[0_34px_120px_rgba(15,23,42,0.18)]"
      aria-labelledby="settings-title"
    >
      <div className="grid min-h-[30rem] gap-0 xl:grid-cols-[minmax(0,1.08fr)_31rem]">
        <div className="relative overflow-hidden p-6 md:p-8">
          <div
            className="pointer-events-none absolute -right-28 -top-32 size-96 rounded-full bg-blue-500/12 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 left-0 h-52 w-[42rem] rounded-tr-full border border-blue-100 bg-[radial-gradient(circle_at_35%_100%,rgba(37,99,235,0.12),rgba(250,204,21,0.12)_45%,transparent_70%)]"
            aria-hidden
          />

          <div className="relative flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase text-blue-800">
              <LockKeyhole size={14} aria-hidden />
              Owner-only
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase text-emerald-800">
              <ShieldCheck size={14} aria-hidden />
              Status-only
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-bold uppercase text-amber-800">
              <XCircle size={14} aria-hidden />
              No secret display
            </span>
          </div>

          <div className="relative mt-10 max-w-4xl">
            <p className="text-sm font-semibold text-blue-700">Read-only settings register</p>
            <h2 id="settings-title" className="mt-3 max-w-4xl text-4xl font-semibold leading-[1.02] text-slate-950 md:text-5xl">
              Keep owner preferences visible without exposing credentials or adding mutation controls.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
              Settings show profile posture, session status, display modes, and notification intent. They do not reveal
              token material, connect accounts, send notifications, edit schedules, or write preferences.
            </p>
          </div>

          <div className="relative mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {ownerSettingsMetrics.map((metric) => (
              <div key={metric.label} className="rounded-[8px] border border-slate-200 bg-white/82 p-4 shadow-[0_18px_70px_rgba(37,99,235,0.08)] backdrop-blur">
                <p className="text-xs font-bold uppercase text-slate-500">{metric.label}</p>
                <strong className="mt-2 block text-3xl font-semibold text-slate-950">{metric.value}</strong>
                <p className="mt-2 text-sm leading-5 text-slate-600">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="relative border-t border-slate-200 bg-[linear-gradient(180deg,#f7fbff,#edf5ff)] p-5 md:p-6 xl:border-l xl:border-t-0"
        >
          <div className="pointer-events-none absolute inset-x-6 top-6 h-48 rounded-full bg-blue-500/12 blur-3xl" aria-hidden />
          <div className="relative rounded-[8px] border border-white bg-white/78 p-5 shadow-[0_20px_80px_rgba(37,99,235,0.1)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">Primary boundary</p>
                <h3 className="mt-1 text-2xl font-semibold text-slate-950">
                  {primaryPacket.title}
                </h3>
                <p className="mt-1 text-xs font-bold uppercase text-blue-700">{primaryPacket.domain}</p>
              </div>
              <span className="flex size-12 items-center justify-center rounded-[8px] bg-blue-600 text-white">
                <Settings2 size={23} aria-hidden />
              </span>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600">{primaryPacket.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <LightStatusBadge tone={primaryPacket.tone}>{primaryPacket.state}</LightStatusBadge>
              <LightStatusBadge tone="private">Owner gated</LightStatusBadge>
            </div>
          </div>

          <div className="relative mt-4 grid gap-3">
            <div className="rounded-[8px] border border-blue-100 bg-white/78 p-4">
              <p className="text-xs font-bold uppercase text-slate-500">Visible value</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">{primaryPacket.visibleValue}</p>
            </div>
            <div className="rounded-[8px] border border-amber-100 bg-amber-50/80 p-4">
              <p className="text-xs font-bold uppercase text-amber-800">Owner gate</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">{primaryPacket.ownerGate}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SettingsLanes() {
  return (
    <section className="panel p-5" aria-labelledby="settings-lanes-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Waypoints size={22} aria-hidden />
            <h2 id="settings-lanes-title" className="text-2xl font-semibold text-white">
              Settings lanes
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Each lane describes a preference surface and the boundary that keeps settings from becoming a credential,
            account, notification, or runtime control panel.
          </p>
        </div>
        <StatusBadge tone="private">Owner visible</StatusBadge>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {ownerSettingsLanes.map((lane, index) => (
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

function SettingsPacket({ packet, index }: { packet: OwnerSettingsPacket; index: number }) {
  return (
    <article className="panel p-5" aria-labelledby={`settings-packet-${packet.id}`}>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">
                {String(index + 1).padStart(2, "0")} - {packet.domain}
              </p>
              <h3 id={`settings-packet-${packet.id}`} className="mt-2 text-2xl font-semibold text-white">
                {packet.title}
              </h3>
              <p className="mt-2 text-xs font-bold uppercase text-slate-400">
                {packet.lifecycle} - {packet.state}
              </p>
            </div>
            <StatusBadge tone={packet.tone}>{packet.state}</StatusBadge>
          </div>

          <p className="mt-5 max-w-4xl text-sm leading-6 text-slate-300">{packet.summary}</p>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">Visible value</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{packet.visibleValue}</p>
            </div>
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">Owner gate</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{packet.ownerGate}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {packet.evidence.map((evidence) => (
              <div key={`${packet.id}-${evidence.label}`} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
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
              <FileSearch size={17} aria-hidden />
              <p className="text-sm font-semibold">Watch items</p>
            </div>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-300">
              {packet.risks.map((risk) => (
                <li key={`${packet.id}-${risk}`} className="flex gap-2">
                  <Eye className="mt-1 shrink-0 text-yellow-100" size={15} aria-hidden />
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
              {packet.noGo.map((item) => (
                <li key={`${packet.id}-${item}`} className="flex gap-2">
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

function ProfileAndNotifications() {
  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="panel p-5" aria-labelledby="profile-posture-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-100">
              <UserRound size={22} aria-hidden />
              <h2 id="profile-posture-title" className="text-2xl font-semibold text-white">
                Profile posture
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Profile fields identify the owner and public posture without exposing private channels or account details.
            </p>
          </div>
          <StatusBadge tone="normal">Curated</StatusBadge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {ownerProfileSettings.map((item) => (
            <article key={item.id} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase text-slate-400">{item.label}</p>
                <StatusBadge tone={item.tone}>{item.status}</StatusBadge>
              </div>
              <h3 className="mt-3 text-xl font-semibold text-white">{item.value}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <aside className="panel p-5" aria-labelledby="notification-preferences-title">
        <div className="flex items-center gap-2 text-yellow-100">
          <Bell size={20} aria-hidden />
          <h2 id="notification-preferences-title" className="text-2xl font-semibold text-white">
            Notification intent
          </h2>
        </div>
        <div className="mt-5 grid gap-3">
          {ownerNotificationPreferences.map((item) => (
            <article key={item.id} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-white">{item.label}</h3>
                <StatusBadge tone={item.tone}>{item.state}</StatusBadge>
              </div>
              <p className="mt-2 text-xs font-bold uppercase text-yellow-100">{item.cadence}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.detail}</p>
              <p className="mt-3 rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-3 text-xs leading-5 text-slate-400">
                {item.boundary}
              </p>
            </article>
          ))}
        </div>
      </aside>
    </section>
  );
}

function SettingsBoundary() {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="panel p-5" aria-labelledby="settings-boundary-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-yellow-100">
              <ShieldCheck size={22} aria-hidden />
              <h2 id="settings-boundary-title" className="text-2xl font-semibold text-white">
                Settings boundary
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              This page can summarize current preference posture. It cannot reveal credentials, mutate accounts, save
              preferences, or send notifications.
            </p>
          </div>
          <StatusBadge tone="private">Read-only</StatusBadge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {ownerSettingsPolicy.map((rule) => (
            <div key={rule} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 text-sm leading-6 text-slate-300">
              {rule}
            </div>
          ))}
        </div>
      </section>

      <aside className="panel p-5" aria-labelledby="settings-unavailable-title">
        <div className="flex items-center gap-2 text-yellow-100">
          <SlidersHorizontal size={20} aria-hidden />
          <h2 id="settings-unavailable-title" className="text-2xl font-semibold text-white">
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

function EmptySettingsRegister() {
  return (
    <section className="panel p-6 md:p-7" aria-labelledby="settings-empty-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Settings2 size={22} aria-hidden />
            <h2 id="settings-empty-title" className="text-2xl font-semibold text-white">
              Settings register empty
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            No owner-visible settings packets are available in this private mock source. The page remains read-only and
            never exposes credentials, account details, provider secrets, or mutation controls.
          </p>
        </div>
        <StatusBadge tone="private">Owner-only</StatusBadge>
      </div>
    </section>
  );
}

export default function SettingsPage() {
  const primaryPacket = ownerSettingsPackets[0];

  if (!primaryPacket) {
    return (
      <div className="grid gap-5">
        <h1 className="sr-only">Private settings register</h1>
        <EmptySettingsRegister />
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <h1 className="sr-only">Private settings register</h1>
      <SettingsHero primaryPacket={primaryPacket} />
      <SettingsLanes />

      <section className="panel p-5" aria-labelledby="settings-packets-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-100">
              <Palette size={22} aria-hidden />
              <h2 id="settings-packets-title" className="text-2xl font-semibold text-white">
                Settings packets
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Each packet describes visible preference posture, owner gate, evidence, watch items, and actions that must
              remain unavailable.
            </p>
          </div>
          <StatusBadge tone="warning">No mutation path</StatusBadge>
        </div>

        <div className="mt-5 grid gap-4">
          {ownerSettingsPackets.map((packet, index) => (
            <SettingsPacket key={packet.id} packet={packet} index={index} />
          ))}
        </div>
      </section>

      <ProfileAndNotifications />
      <SettingsBoundary />
    </div>
  );
}
