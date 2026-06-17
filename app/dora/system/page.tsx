import type { Metadata } from "next";
import { Database, Radio, ShieldCheck, Signal } from "lucide-react";
import { DoraOfficeShell } from "@/components/DoraOfficeShell";
import { StatusBadge } from "@/components/StatusBadge";
import { publicSystemBoundaries, publicSystemStatus } from "@/lib/dora-office";

export const metadata: Metadata = {
  title: "Dora System",
  description: "Public-safe Dora Office system status without internal hostnames, ports, paths, tokens, or repair controls."
};

const systemIcons = {
  Mode: Radio,
  "Public schema": ShieldCheck,
  "Event freshness": Signal,
  "Buffer and dedupe": Database
} as const;

export default function DoraSystemPage() {
  return (
    <DoraOfficeShell
      active="/dora/system"
      title="System"
      summary="Public Dora Office health at a safe abstraction level: mode, schema posture, freshness, and sanitized replay."
    >
      <div className="grid gap-5">
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {publicSystemStatus.map((item) => {
            const Icon = systemIcons[item.label];

            return (
              <article key={item.label} className="panel p-5">
                <div className="flex items-start justify-between gap-3">
                  <Icon className="text-[#2563eb]" size={24} aria-hidden />
                  <StatusBadge tone={item.tone}>public-safe</StatusBadge>
                </div>
                <p className="mt-5 text-sm font-semibold text-slate-500">{item.label}</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">{item.value}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.detail}</p>
              </article>
            );
          })}
        </section>

        <section className="panel p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 shrink-0 text-[#2563eb]" size={22} aria-hidden />
            <div>
              <p className="eyebrow">System boundary</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Status without internals</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {publicSystemBoundaries.map((rule) => (
                  <div key={rule} className="rounded-[8px] border border-[#dde7f0] bg-[#f8fafc] p-3 text-sm leading-6 text-slate-600">
                    {rule}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </DoraOfficeShell>
  );
}
