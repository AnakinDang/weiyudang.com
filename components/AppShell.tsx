import Link from "next/link";
import { CalendarClock, ExternalLink, LockKeyhole, ShieldCheck } from "lucide-react";
import { PrivateDesktopSidebar, PrivateMobileHeader } from "@/components/PrivateAppNavigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell min-h-screen overflow-hidden bg-[#08111f] text-slate-100">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(135deg,rgba(37,99,235,0.18),transparent_28%),linear-gradient(180deg,#f8fbff_0%,#eaf3ff_22%,#111827_22%,#08111f_100%)] lg:bg-[linear-gradient(135deg,rgba(37,99,235,0.2),transparent_30%),linear-gradient(180deg,#f8fbff_0%,#eff6ff_20%,#111827_20%,#08111f_100%)]"
        aria-hidden
      />
      <div className="min-h-screen lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
        <PrivateDesktopSidebar />
        <div className="min-w-0">
          <PrivateMobileHeader />
          <main className="min-w-0">
            <header className="hidden border-b border-white/45 bg-white/82 px-6 py-5 text-slate-950 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:block">
              <div className="flex flex-wrap items-center justify-between gap-5">
                <div>
                  <p className="text-xs font-bold uppercase text-blue-700">Owner session</p>
                  <h1 className="mt-1 text-2xl font-semibold text-slate-950">Personal OS Cockpit</h1>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                    Private cockpit for approvals, research posture, schedules, and system health.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <div className="inline-flex items-center gap-2 rounded-[8px] border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800">
                    <LockKeyhole size={16} aria-hidden />
                    Owner-only
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-[8px] border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
                    <ShieldCheck size={16} aria-hidden />
                    Read-only
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-[8px] border border-amber-100 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
                    <CalendarClock size={16} aria-hidden />
                    Private mock mode
                  </div>
                  <Link
                    href="/dora"
                    className="link-focus inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                  >
                    Public Doraemon
                    <ExternalLink size={15} aria-hidden />
                  </Link>
                </div>
              </div>
            </header>
            <div className="min-w-0 p-4 sm:p-5 md:p-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
