import { ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  return (
    <section className="panel p-6">
      <ShieldCheck className="text-yellow-100" size={28} aria-hidden />
      <p className="eyebrow mt-4">Settings</p>
      <h2 className="mt-2 text-3xl font-semibold text-white">Private configuration placeholder</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
        API keys, broker credentials, agent memory, email, calendar, and filesystem integrations should never be exposed in the public website. This MVP only shows the boundary.
      </p>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {["Auth provider", "Rate limits", "Public Dora API", "Local runtime bridge"].map((item) => (
          <div key={item} className="rounded-[8px] border border-slate-700 bg-white/5 px-4 py-3 text-sm text-slate-300">
            {item}: not connected
          </div>
        ))}
      </div>
    </section>
  );
}
