import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DORA_LIVE_BRIDGE_URL, doraOfficeRoutes, type DoraOfficeRoute } from "@/lib/dora-office";
import { SiteChrome } from "@/components/SiteChrome";
import { StatusBadge } from "@/components/StatusBadge";

export function DoraOfficeShell({
  active,
  title,
  summary,
  children
}: {
  active: DoraOfficeRoute;
  title: string;
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <SiteChrome>
      <section className="section">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
            <aside className="h-fit rounded-[8px] border border-[#dde7f0] bg-white/78 p-3 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <div className="p-3">
                <p className="eyebrow">Dora Office</p>
                <h2 className="mt-2 text-lg font-semibold text-slate-950">Public command room</h2>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Native `/dora/*` routes. Display-only, sanitized, and safe for public visitors.
                </p>
              </div>
              <nav className="mt-2 grid gap-1" aria-label="Dora Office navigation">
                {doraOfficeRoutes.map((item) => {
                  const isActive = item.href === active;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`link-focus rounded-[8px] px-3 py-2 text-sm font-semibold transition ${
                        isActive
                          ? "bg-[#2563eb] text-white shadow-[0_10px_24px_rgba(37,99,235,0.18)]"
                          : "text-slate-600 hover:bg-[#e0f2fe] hover:text-[#1d4ed8]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <a
                href={DORA_LIVE_BRIDGE_URL}
                target="_blank"
                rel="noreferrer"
                className="link-focus mt-4 flex items-center justify-between gap-3 rounded-[8px] border border-[#bfdbfe] bg-[#f1f7fb] px-3 py-3 text-sm font-semibold text-[#1d4ed8] transition hover:bg-[#e0f2fe]"
              >
                Current live bridge
                <ArrowUpRight size={15} aria-hidden />
              </a>
            </aside>

            <div>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div className="max-w-3xl">
                  <p className="eyebrow">Public / read-only</p>
                  <h1 className="mt-3 text-4xl font-semibold text-slate-950 md:text-6xl">{title}</h1>
                  <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">{summary}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge tone="info">demo fallback</StatusBadge>
                  <StatusBadge tone="normal">public schema</StatusBadge>
                </div>
              </div>

              <div className="mt-6 rounded-[8px] border border-[#bfdbfe] bg-[#f1f7fb] p-4 text-sm leading-6 text-slate-700">
                Public Dora Office is read-only and sanitized. It does not expose private tasks, prompts, memory,
                credentials, trading data, or owner-only controls.
              </div>

              <div className="mt-8">{children}</div>
            </div>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
