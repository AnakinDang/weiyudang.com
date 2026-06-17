import type { Metadata } from "next";
import { Bell, Eye, LockKeyhole, Palette, ShieldCheck, UserRound } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import {
  ownerAccessStatuses,
  ownerDisplayModes,
  ownerNotificationPreferences,
  ownerProfileSettings,
  ownerSettingsPolicy
} from "@/lib/settings";

export const metadata: Metadata = {
  title: "Private Settings",
  description: "Owner-only settings status for profile, access posture, display modes, and notification preferences."
};

export default function SettingsPage() {
  return (
    <section className="space-y-5">
      <div className="panel p-6">
        <ShieldCheck className="text-yellow-100" size={28} aria-hidden />
        <p className="eyebrow mt-4">Settings</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Owner preferences and access posture</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Settings are currently a read-only status surface. They show profile, display, notification, and access
          posture without exposing credential material, account details, or runtime controls.
        </p>
      </div>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="grid self-start gap-5 md:grid-cols-3">
          {ownerProfileSettings.map((item) => (
            <article key={item.label} className="panel p-5">
              <div className="flex items-start justify-between gap-3">
                <UserRound className="text-yellow-100" size={22} aria-hidden />
                <StatusBadge tone={item.tone}>{item.status}</StatusBadge>
              </div>
              <p className="mt-5 text-sm font-semibold text-slate-400">{item.label}</p>
              <h3 className="mt-1 text-xl font-semibold text-white">{item.value}</h3>
            </article>
          ))}
        </div>

        <aside className="panel p-5">
          <div className="flex items-start gap-3">
            <LockKeyhole className="mt-0.5 shrink-0 text-yellow-100" size={22} aria-hidden />
            <div>
              <p className="eyebrow">Settings boundary</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Status-only until audited</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {ownerSettingsPolicy.map((rule) => (
              <div key={rule} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-3 text-sm leading-6 text-slate-300">
                {rule}
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="panel p-5">
          <div className="flex items-center gap-3">
            <Eye className="text-sky-100" size={22} aria-hidden />
            <div>
              <p className="eyebrow">Access posture</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">Private integrations are not exposed</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {ownerAccessStatuses.map((item) => (
              <article key={item.label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white">{item.label}</h3>
                  <StatusBadge tone={item.tone}>{item.state}</StatusBadge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="panel p-5">
          <div className="flex items-center gap-3">
            <Palette className="text-yellow-100" size={22} aria-hidden />
            <div>
              <p className="eyebrow">Display modes</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">Presentation preferences</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {ownerDisplayModes.map((item) => (
              <div key={item.label} className="flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                <div>
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="mt-1 text-xs uppercase text-slate-400">{item.value}</p>
                </div>
                <StatusBadge tone={item.tone}>{item.value}</StatusBadge>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel p-5">
        <div className="flex items-center gap-3">
          <Bell className="text-sky-100" size={22} aria-hidden />
          <div>
            <p className="eyebrow">Notifications</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">Preference preview</h2>
          </div>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {ownerNotificationPreferences.map((item) => (
            <article key={item.label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">{item.label}</h3>
                <StatusBadge tone={item.tone}>{item.state}</StatusBadge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
