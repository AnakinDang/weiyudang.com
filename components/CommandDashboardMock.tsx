import { Bot, Boxes, FileText, GitBranch, UserCheck } from "lucide-react";
import { Timeline } from "@/components/Timeline";

const agents = [
  { name: "Doraemon CEO Agent", state: "planning", icon: Bot },
  { name: "Research MiniDora", state: "researching", icon: GitBranch },
  { name: "Dev MiniDora", state: "coding", icon: Boxes },
  { name: "Media MiniDora", state: "writing", icon: FileText }
];

export function CommandDashboardMock() {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.8fr_1.25fr_0.9fr]">
      <section className="panel p-5">
        <p className="eyebrow">Agent List</p>
        <div className="mt-5 space-y-3">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <div key={agent.name} className="flex items-center gap-3 rounded-[8px] border border-slate-700 px-3 py-3">
                <span className="flex size-9 items-center justify-center rounded-[8px] bg-sky-300/10 text-sky-100">
                  <Icon size={18} aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{agent.name}</span>
                  <span className="block text-xs text-slate-400">{agent.state}</span>
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel p-5">
        <p className="eyebrow">Current Mission</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Turn the personal website into a working AI command surface.</h2>
        <div className="mt-6 grid gap-3">
          {["Public pages explain the system clearly.", "Private app stays behind auth.", "Trading dashboard remains read-only.", "Future runtime connects through event streams."].map((item) => (
            <div key={item} className="rounded-[8px] border border-slate-700 bg-white/5 px-4 py-3 text-sm text-slate-300">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-5">
        <p className="eyebrow">Owner Review</p>
        <div className="mt-5 rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 p-4">
          <UserCheck className="text-yellow-100" size={24} aria-hidden />
          <h3 className="mt-3 font-semibold text-white">Deployment approval required</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Domain and production changes should be confirmed before publishing externally.
          </p>
        </div>
      </section>

      <section className="xl:col-span-3">
        <div className="panel p-5">
          <div className="mb-5">
            <p className="eyebrow">Event Timeline</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Recent agent events</h2>
          </div>
          <Timeline />
        </div>
      </section>
    </div>
  );
}
