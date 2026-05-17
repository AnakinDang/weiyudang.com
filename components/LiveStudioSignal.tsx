"use client";

import { useEffect, useState } from "react";
import { Activity, Atom, LineChart, PenLine, Workflow } from "lucide-react";

const signals = [
  {
    icon: Atom,
    label: "Reading",
    title: "Quantum computing notes",
    detail: "Turning formal ideas into usable intuition."
  },
  {
    icon: Workflow,
    label: "Building",
    title: "Personal AI workflows",
    detail: "Keeping the owner in the loop while tools do more of the carrying."
  },
  {
    icon: LineChart,
    label: "Researching",
    title: "Trading evidence desk",
    detail: "Paper-only observation, source review, and decision support."
  },
  {
    icon: PenLine,
    label: "Writing",
    title: "Lab notes",
    detail: "Small public records of what changed and why."
  }
];

export function LiveStudioSignal() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % signals.length);
    }, 2800);

    return () => window.clearInterval(timer);
  }, []);

  const signal = signals[active];
  const Icon = signal.icon;

  return (
    <div className="mt-8 max-w-xl rounded-[8px] border border-[#dde7f0] bg-white/76 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="relative flex size-9 items-center justify-center rounded-[8px] bg-[#e0f2fe] text-[#2563eb]">
            <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.16)]" />
            <Activity size={17} aria-hidden />
          </span>
          <div>
            <p className="mono text-[0.68rem] font-semibold uppercase text-slate-500">Live studio signal</p>
            <p className="text-sm font-semibold text-slate-950">Rotating front-end state, no backend attached</p>
          </div>
        </div>
        <div className="rounded-[8px] border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
          public-safe
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[2.2rem_1fr] gap-3">
        <span className="flex size-9 items-center justify-center rounded-[8px] border border-[#bfdbfe] bg-[#f8fafc] text-[#2563eb]">
          <Icon size={17} aria-hidden />
        </span>
        <div>
          <p className="text-xs font-bold uppercase text-[#9a6a08]">{signal.label}</p>
          <p className="mt-1 text-base font-semibold text-slate-950">{signal.title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{signal.detail}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {signals.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setActive(index)}
            className={`h-1.5 rounded-full transition ${index === active ? "bg-[#2563eb]" : "bg-[#dde7f0] hover:bg-[#bfdbfe]"}`}
            aria-label={`Show ${item.label}`}
          />
        ))}
      </div>
    </div>
  );
}
