import Link from "next/link";
import { ArrowRight, LockKeyhole, Sparkles } from "lucide-react";

const defaultNavItems = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/dora", label: "Doraemon" },
  { href: "/lab", label: "Research" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" }
];

const doraemonNavItems = [
  { href: "/", label: "Home" },
  { href: "/dora", label: "Doraemon" },
  { href: "/journal", label: "Writing" },
  { href: "/projects", label: "Projects" },
  { href: "/lab", label: "Research" }
];

export function SiteHeader({
  variant = "default",
  activeHref = "/dora"
}: {
  variant?: "default" | "doraemon";
  activeHref?: string;
}) {
  if (variant === "doraemon") {
    return (
      <header className="site-header site-header-doraemon">
        <div className="container site-header-doraemon-inner">
          <Link href="/" className="link-focus site-signature-brand" aria-label="Weiyu Dang home">
            <span className="site-signature-mark" aria-hidden>
              Wy
            </span>
            <span>WEIYU DANG</span>
          </Link>
          <nav className="site-doraemon-nav" aria-label="Primary navigation">
            {doraemonNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.href === activeHref ? "page" : undefined}
                className={`link-focus${item.href === activeHref ? " is-active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/app" className="link-focus site-owner-signin">
            Owner Sign in
            <ArrowRight size={15} aria-hidden />
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="site-header sticky top-0 z-40 border-b border-[#dde7f0]/80 bg-white/86 backdrop-blur-xl">
      <div className="container flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="link-focus flex items-center gap-3" aria-label="Weiyu Dang home">
          <span className="flex size-9 items-center justify-center rounded-[8px] border border-[#bfdbfe] bg-[#e0f2fe] text-[#2563eb]">
            <Sparkles size={18} aria-hidden />
          </span>
          <span>
            <span className="block text-sm font-semibold text-slate-950">Weiyu Dang</span>
            <span className="block text-xs text-slate-500">Physics, AI, research tools</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {defaultNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-focus rounded-[8px] px-3 py-2 text-sm text-slate-600 transition hover:bg-[#f1f7fb] hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/app"
          className="link-focus inline-flex items-center gap-2 rounded-[8px] border border-[#f4b740]/40 bg-[#fff8e5] px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-[#fff2c7]"
        >
          <LockKeyhole size={16} aria-hidden />
          <span className="hidden sm:inline">Owner area</span>
          <ArrowRight size={15} aria-hidden />
        </Link>
      </div>
    </header>
  );
}
