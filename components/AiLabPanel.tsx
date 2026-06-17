"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Bot, Network, ShieldCheck, Sparkles, Workflow } from "lucide-react";

const labModes = [
  {
    id: "dora",
    label: "Doraemon",
    icon: Bot,
    title: "Public companion",
    summary: "A warm guide for explaining public projects, answering safe questions, and routing visitors.",
    intent: "Make the personal site feel alive without exposing private systems.",
    link: "/dora",
    linkLabel: "Meet Doraemon",
    events: ["Read public project index", "Match visitor intent", "Return bounded answer"]
  },
  {
    id: "minidora",
    label: "MiniDora",
    icon: Network,
    title: "Specialist helpers",
    summary: "Small agent roles for research, code, media, and trading research, all framed around owner review.",
    intent: "Expand execution capacity while keeping Weiyu's judgment central.",
    link: "/projects/doraemon-agent-system",
    linkLabel: "Agent system",
    events: ["Break task into artifacts", "Collect evidence", "Wait for owner review"]
  },
  {
    id: "weiyu-ai",
    label: "Weiyu AI",
    icon: Sparkles,
    title: "Personal AI lab",
    summary: "The umbrella for experiments in AI workflows, creative systems, and research tools.",
    intent: "Keep the company idea as one lab inside a personal website until weiyudang.ai exists.",
    link: "/projects/weiyu-ai",
    linkLabel: "Weiyu AI",
    events: ["Map project boundary", "Publish public note", "Keep private app separate"]
  }
];

export function AiLabPanel() {
  const [activeId, setActiveId] = useState(labModes[0].id);
  const active = useMemo(() => labModes.find((mode) => mode.id === activeId) ?? labModes[0], [activeId]);
  const Icon = active.icon;

  return (
    <div className="panel p-5">
      <div className="flex flex-wrap gap-2">
        {labModes.map((mode) => {
          const ModeIcon = mode.icon;
          const isActive = mode.id === activeId;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => setActiveId(mode.id)}
              className={`inline-flex items-center gap-2 rounded-[8px] px-3 py-2 text-sm font-bold transition ${
                isActive
                  ? "bg-[#2563eb] text-white shadow-[0_10px_24px_rgba(37,99,235,0.2)]"
                  : "border border-[#dde7f0] bg-[#f8fafc] text-slate-700 hover:border-[#bfdbfe] hover:bg-[#e0f2fe]"
              }`}
            >
              <ModeIcon size={15} aria-hidden />
              {mode.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-[8px] border border-[#dde7f0] bg-[#f8fafc] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex size-11 items-center justify-center rounded-[8px] border border-[#bfdbfe] bg-[#e0f2fe] text-[#2563eb]">
              <Icon size={22} aria-hidden />
            </span>
            <div>
              <p className="text-xs font-bold uppercase text-[#9a6a08]">active layer</p>
              <h3 className="mt-1 text-2xl font-semibold text-slate-950">{active.title}</h3>
            </div>
          </div>
          <div className="rounded-[8px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800">
            frontend simulation
          </div>
        </div>

        <p className="mt-5 text-sm leading-6 text-slate-600">{active.summary}</p>
        <div className="mt-5 rounded-[8px] border border-[#f4b740]/35 bg-[#fff8e5] p-4 text-sm leading-6 text-slate-700">
          <ShieldCheck className="mb-2 text-[#9a6a08]" size={18} aria-hidden />
          {active.intent}
        </div>

        <div className="mt-5 space-y-3">
          {active.events.map((event, index) => (
            <div key={event} className="flex items-center gap-3 rounded-[8px] border border-[#dde7f0] bg-white px-3 py-3">
              <span className="mono flex size-7 items-center justify-center rounded-[8px] bg-[#e0f2fe] text-xs font-bold text-[#1d4ed8]">
                {index + 1}
              </span>
              <span className="text-sm font-semibold text-slate-700">{event}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
            <Workflow size={14} aria-hidden />
            no backend calls
          </div>
          <Link
            href={active.link}
            className="link-focus inline-flex items-center gap-2 rounded-[8px] bg-[#2563eb] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#1d4ed8]"
          >
            {active.linkLabel}
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
