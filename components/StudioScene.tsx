import Image from "next/image";
import { Atom, BrainCircuit, LineChart, NotebookPen, Workflow } from "lucide-react";

const studioSignals = [
  { label: "Physics notes", icon: Atom },
  { label: "AI workflow", icon: Workflow },
  { label: "Trading research", icon: LineChart }
];

export function StudioScene() {
  return (
    <div className="relative overflow-hidden rounded-[8px] border border-[#dde7f0] bg-white p-3 shadow-[0_28px_90px_rgba(15,23,42,0.12)]">
      <div className="warm-grid absolute inset-0 opacity-70" aria-hidden />
      <div className="relative overflow-hidden rounded-[8px] border border-[#dde7f0] bg-[#f8fafc]">
        <Image
          src="/visuals/weiyu-bright-studio.png"
          alt="Bright personal research studio with notes, screens, AI workflows, quantum grid hints, and trading research references."
          width={1536}
          height={1024}
          priority
          sizes="(min-width: 1024px) 44vw, 100vw"
          className="aspect-[1.18/1] w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white/92 to-transparent" aria-hidden />
      </div>

      <div className="relative mt-3 grid gap-3 sm:grid-cols-3">
        {studioSignals.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded-[8px] border border-[#dde7f0] bg-[#f8fafc]/88 px-3 py-2 text-xs font-semibold text-slate-700"
            >
              <Icon className="text-[#2563eb]" size={15} aria-hidden />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>

      <div className="absolute right-6 top-6 hidden rounded-[8px] border border-white/70 bg-white/84 px-3 py-2 shadow-[0_14px_40px_rgba(15,23,42,0.12)] backdrop-blur md:block">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <BrainCircuit className="text-[#f4b740]" size={15} aria-hidden />
          Owner-led AI lab
        </div>
      </div>
      <div className="absolute bottom-24 left-6 hidden rounded-[8px] border border-[#dde7f0] bg-white/88 p-3 shadow-[0_14px_40px_rgba(15,23,42,0.1)] backdrop-blur md:block">
        <NotebookPen className="text-[#2563eb]" size={18} aria-hidden />
        <p className="mt-2 max-w-36 text-xs font-semibold leading-5 text-slate-700">Lightweight research, code, and creative systems.</p>
      </div>
    </div>
  );
}
