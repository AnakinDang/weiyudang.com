import Link from "next/link";
import { ArrowRight, LockKeyhole, Sparkles } from "lucide-react";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/dora", label: "Dora" },
  { href: "/lab", label: "Lab Notes" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-700/40 bg-[#0b1220]/86 backdrop-blur-xl">
      <div className="container flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="link-focus flex items-center gap-3" aria-label="Weiyu Dang home">
          <span className="flex size-9 items-center justify-center rounded-[8px] border border-sky-300/30 bg-sky-400/10 text-sky-100">
            <Sparkles size={18} aria-hidden />
          </span>
          <span>
            <span className="block text-sm font-semibold text-slate-50">Weiyu Dang</span>
            <span className="block text-xs text-slate-400">AI one-person company</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-focus rounded-[8px] px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/app"
          className="link-focus inline-flex items-center gap-2 rounded-[8px] border border-yellow-300/30 bg-yellow-300/10 px-3 py-2 text-sm font-semibold text-yellow-100 transition hover:bg-yellow-300/16"
        >
          <LockKeyhole size={16} aria-hidden />
          <span className="hidden sm:inline">Command Center</span>
          <ArrowRight size={15} aria-hidden />
        </Link>
      </div>
    </header>
  );
}
