import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-700/40 bg-[#0b1220] px-5 py-10">
      <div className="container flex flex-col gap-5 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-slate-100">Weiyu Dang</p>
          <p>Building an AI-augmented one-person company.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link className="link-focus hover:text-white" href="/projects">
            Projects
          </Link>
          <Link className="link-focus hover:text-white" href="/dora">
            Dora
          </Link>
          <Link className="link-focus hover:text-white" href="/contact">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
