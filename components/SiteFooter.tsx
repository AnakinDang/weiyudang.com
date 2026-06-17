import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#dde7f0] bg-white px-5 py-10">
      <div className="container flex flex-col gap-5 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-slate-950">Weiyu Dang</p>
          <p>Physics, quantum computing, AI systems, and research tools.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link className="link-focus hover:text-[#2563eb]" href="/projects">
            Projects
          </Link>
          <Link className="link-focus hover:text-[#2563eb]" href="/dora">
            Doraemon
          </Link>
          <Link className="link-focus hover:text-[#2563eb]" href="/journal">
            Journal
          </Link>
          <Link className="link-focus hover:text-[#2563eb]" href="/contact">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
