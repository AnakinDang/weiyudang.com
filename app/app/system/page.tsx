import type { Metadata } from "next";
import { Gauge, Server, ShieldCheck } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { UnavailableControlsPanel } from "@/components/UnavailableControlsPanel";
import { privateSystemDiagnostics, privateSystemServices, privateSystemSignals } from "@/lib/operations";

export const metadata: Metadata = {
  title: "System Health",
  description: "Owner-only system health summary for Weiyu Personal OS."
};

export default function SystemPage() {
  return (
    <div className="grid gap-5">
      <section className="panel p-6 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">System Health</p>
            <h2 className="mt-2 max-w-4xl text-3xl font-semibold text-white md:text-4xl">
              Owner-only health summary for service posture, event lag, queue health, and diagnostics.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
              This surface is safe diagnostics only. It does not render internal hostnames, ports, filesystem paths,
              tokens, raw logs, or repair controls.
            </p>
          </div>
          <div className="rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 px-4 py-3">
            <p className="text-xs font-bold uppercase text-yellow-100">Mode</p>
            <p className="mt-2 max-w-xs text-sm font-semibold leading-6 text-white">Summary-level diagnostics.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_24rem]">
        <div className="grid gap-5 md:grid-cols-2">
          {privateSystemServices.map((service) => (
            <article key={service.label} className="panel p-5">
              <div className="flex items-start justify-between gap-3">
                <Server className="text-sky-100" size={24} aria-hidden />
                <StatusBadge tone={service.tone}>{service.state}</StatusBadge>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{service.label}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{service.detail}</p>
            </article>
          ))}
        </div>

        <aside className="grid content-start gap-4">
          <section className="panel p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">Signals</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Lag, queue, failures</h2>
              </div>
              <Gauge className="text-yellow-100" size={24} aria-hidden />
            </div>
            <div className="mt-5 grid gap-3">
              {privateSystemSignals.map((signal) => (
                <article key={signal.label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-white">{signal.label}</h3>
                    <StatusBadge tone={signal.tone}>{signal.value}</StatusBadge>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{signal.detail}</p>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="panel p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-sky-100" size={22} aria-hidden />
            <div>
              <p className="eyebrow">Diagnostic boundary</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">What this page can safely say</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {privateSystemDiagnostics.map((item) => (
              <div key={item} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 text-sm leading-6 text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </article>

        <UnavailableControlsPanel
          title="No repair controls"
          items={["Restart service", "Deploy worker", "Purge queue", "Open raw logs"]}
          note="Any future repair workflow needs a separate authenticated API, audit log, and rollback design."
        />
      </section>
    </div>
  );
}
