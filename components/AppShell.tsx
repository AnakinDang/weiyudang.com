import { PrivateDesktopSidebar, PrivateMobileHeader } from "@/components/PrivateAppNavigation";
import { PrivateAppTopHeader } from "@/components/PrivateAppTopHeader";

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
            <PrivateAppTopHeader />
            <div className="min-w-0 p-4 sm:p-5 md:p-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
