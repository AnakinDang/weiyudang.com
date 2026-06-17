import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Private Owner Area",
  description: "Owner-only access for Weiyu Dang."
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
    config?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params.next?.startsWith("/app") ? params.next : "/app";
  const error = params.error === "1";
  const missingConfig = params.config === "missing";
  const showDevTokenHint = process.env.NODE_ENV === "development";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08111f] px-5 py-12 text-slate-100">
      <section className="panel w-full max-w-md p-6">
        <Link href="/" className="link-focus inline-flex items-center gap-2 text-sm font-semibold text-sky-100 hover:text-sky-50">
          <ArrowLeft size={16} aria-hidden />
          Back to public site
        </Link>
        <div className="mt-8 flex size-14 items-center justify-center rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 text-yellow-100">
          <LockKeyhole size={28} aria-hidden />
        </div>
        <h1 className="mt-5 text-3xl font-semibold text-white">Private owner area</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          This gate protects owner-only routes. Private app content is not rendered until the owner session is valid.
        </p>
        {error ? (
          <div className="mt-5 rounded-[8px] border border-red-300/30 bg-red-300/10 p-3 text-sm text-red-100">
            Access token did not match.
          </div>
        ) : null}
        {missingConfig ? (
          <div className="mt-5 rounded-[8px] border border-yellow-300/30 bg-yellow-300/10 p-3 text-sm text-yellow-100">
            APP_ACCESS_TOKEN is missing in this environment.
          </div>
        ) : null}
        <form action="/api/login" method="post" className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next} />
          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Access token</span>
            <input
              type="password"
              name="token"
              autoComplete="current-password"
              className="mt-2 w-full rounded-[8px] border border-slate-600 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300"
              placeholder="Enter private token"
            />
          </label>
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-yellow-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-200">
            <ShieldCheck size={17} aria-hidden />
            Enter app
          </button>
        </form>
        <p className="mt-5 text-xs leading-5 text-slate-500">
          {showDevTokenHint
            ? "Local development accepts demo-access when APP_ACCESS_TOKEN is not set."
            : "Production access requires a configured owner token."}{" "}
          The session cookie is HttpOnly and scoped to `/app`.
        </p>
      </section>
    </main>
  );
}
