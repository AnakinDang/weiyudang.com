import { Bot, BrainCircuit, Code2, LineChart, Mic2, Search } from "lucide-react";

const agents = [
  { icon: Search, label: "Research", x: "12%", y: "24%" },
  { icon: Code2, label: "Dev", x: "70%", y: "18%" },
  { icon: Mic2, label: "Media", x: "18%", y: "68%" },
  { icon: LineChart, label: "Trading", x: "74%", y: "66%" }
];

export function StudioScene() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[56vw] overflow-hidden md:block" aria-hidden>
      <div className="grid-floor absolute inset-0 opacity-60" />
      <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#0b1220] to-transparent" />
      <div className="absolute left-1/2 top-[54%] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-300/14 bg-sky-300/5" />
      <div className="absolute left-1/2 top-[54%] h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-200/18" />
      <div className="absolute left-1/2 top-[54%] h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-[8px] border border-sky-200/40 bg-[#0b1220]/72 shadow-[0_0_80px_rgba(56,189,248,0.24)]">
        <div className="flex h-full flex-col items-center justify-center gap-3">
          <span className="flex size-16 items-center justify-center rounded-[8px] border border-sky-200/40 bg-sky-300/12 text-sky-100">
            <Bot size={34} />
          </span>
          <span className="mono text-xs font-semibold uppercase text-sky-100">Dora Core</span>
          <span className="h-1 w-20 rounded-full bg-yellow-300/70" />
        </div>
      </div>
      <div className="absolute left-1/2 top-[54%] h-px w-[58%] -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-200/35 to-transparent" />
      <div className="absolute left-1/2 top-[54%] h-[46%] w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-sky-200/35 to-transparent" />
      {agents.map((agent) => {
        const Icon = agent.icon;
        return (
          <div
            key={agent.label}
            className="absolute flex min-w-32 items-center gap-2 rounded-[8px] border border-slate-500/38 bg-[#0f172a]/78 px-3 py-2 shadow-2xl"
            style={{ left: agent.x, top: agent.y }}
          >
            <Icon size={16} className="text-yellow-200" />
            <span className="text-xs font-semibold text-slate-100">{agent.label}</span>
          </div>
        );
      })}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-[8px] border border-emerald-200/24 bg-emerald-300/10 px-3 py-2 text-xs font-semibold text-emerald-100">
        <BrainCircuit size={14} />
        Owner review required
      </div>
    </div>
  );
}
