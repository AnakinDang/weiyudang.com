"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Bot, LockKeyhole, Network, ShieldCheck, Sparkles, Workflow } from "lucide-react";

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
  const activeIndex = labModes.findIndex((mode) => mode.id === active.id);
  const Icon = active.icon;

  function selectAdjacentMode(offset: number) {
    const nextIndex = (activeIndex + offset + labModes.length) % labModes.length;
    const nextId = labModes[nextIndex].id;
    document.getElementById(`home-ai-tab-${nextId}`)?.focus();
    setActiveId(nextId);
  }

  return (
    <div className="home-ai-panel">
      <div className="home-ai-tabs" role="tablist" aria-label="AI Lab layers">
        {labModes.map((mode) => {
          const ModeIcon = mode.icon;
          const isActive = mode.id === activeId;
          return (
            <button
              key={mode.id}
              id={`home-ai-tab-${mode.id}`}
              type="button"
              onClick={() => setActiveId(mode.id)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  selectAdjacentMode(1);
                }

                if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  selectAdjacentMode(-1);
                }
              }}
              role="tab"
              aria-selected={isActive}
              aria-controls="home-ai-detail-panel"
              tabIndex={isActive ? 0 : -1}
              className={`home-ai-tab${isActive ? " is-active" : ""}`}
            >
              <ModeIcon size={15} aria-hidden />
              {mode.label}
            </button>
          );
        })}
      </div>

      <div className="home-agent-map" aria-label="AI Lab relationship map">
        <div className="home-agent-orbit" aria-hidden="true">
          <span className="home-agent-orbit-ring home-agent-orbit-ring-one" />
          <span className="home-agent-orbit-ring home-agent-orbit-ring-two" />
          <span className="home-agent-pulse home-agent-pulse-one" />
          <span className="home-agent-pulse home-agent-pulse-two" />
          <span className="home-agent-pulse home-agent-pulse-three" />
        </div>

        <div className="home-agent-node home-agent-node-left">
          <Network size={25} aria-hidden />
          <strong>MiniDoras</strong>
          <span>Specialists</span>
        </div>
        <div className="home-agent-node home-agent-node-center">
          <Bot size={31} aria-hidden />
          <strong>Doraemon</strong>
          <span>Orchestrator</span>
        </div>
        <div className="home-agent-node home-agent-node-right">
          <Sparkles size={25} aria-hidden />
          <strong>Weiyu AI</strong>
          <span>Lab umbrella</span>
        </div>
      </div>

      <div
        id="home-ai-detail-panel"
        className="home-ai-detail"
        role="tabpanel"
        aria-labelledby={`home-ai-tab-${active.id}`}
      >
        <div className="home-ai-detail-head">
          <span>
            <Icon size={19} aria-hidden />
            active layer
          </span>
          <strong>{active.title}</strong>
        </div>
        <p>{active.summary}</p>
        <div className="home-ai-intent">
          <ShieldCheck size={18} aria-hidden />
          {active.intent}
        </div>

        <div className="home-ai-events">
          {active.events.map((event, index) => (
            <div key={event}>
              <span className="mono">{index + 1}</span>
              <span>{event}</span>
            </div>
          ))}
        </div>

        <div className="home-ai-boundary-strip">
          <span>
            <ShieldCheck size={15} aria-hidden />
            Owner review
          </span>
          <span>
            <Workflow size={15} aria-hidden />
            Audit trails
          </span>
          <span>
            <LockKeyhole size={15} aria-hidden />
            Public / Private
          </span>
          <span>
            <Workflow size={14} aria-hidden />
            No execution
          </span>
        </div>

        <div className="home-ai-footer">
          <span>No fake metrics. State, evidence, and boundaries first.</span>
          <Link
            href={active.link}
            className="link-focus home-text-action"
          >
            {active.linkLabel}
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
