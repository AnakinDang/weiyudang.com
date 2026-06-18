import { CalendarClock } from "lucide-react";
import { PrivateDesktopSidebar, PrivateMobileHeader } from "@/components/PrivateAppNavigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell min-h-screen bg-[#08111f] text-slate-100">
      <div className="min-h-screen lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
        <PrivateDesktopSidebar />
        <div className="min-w-0">
          <PrivateMobileHeader />
          <main className="min-w-0">
            <header className="hidden border-b border-slate-700/50 bg-[#0b1220]/76 px-5 py-4 backdrop-blur lg:block">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Owner session</p>
                  <h1 className="text-xl font-semibold text-white">Personal OS Cockpit</h1>
                </div>
                <div className="inline-flex items-center gap-2 rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 px-3 py-2 text-sm font-semibold text-yellow-100">
                  <CalendarClock size={16} aria-hidden />
                  Private mock mode
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
