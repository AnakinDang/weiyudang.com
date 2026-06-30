"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Bot, LockKeyhole, MonitorPlay, Network, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { localizeSiteText } from "@/lib/site-i18n";

const labModes = [
  {
    id: "office",
    label: "Office",
    icon: MonitorPlay,
    title: "Doraemon Office",
    summary: "A public-safe command room for agent presence, activity, schedules, and system rhythm.",
    intent: "Visitors can understand the operating system without seeing private tasks, prompts, or owner notes.",
    link: "/dora/office",
    linkLabel: "Open office",
    events: ["Show sanitized activity", "Render agent presence", "Keep owner state private"]
  },
  {
    id: "team",
    label: "MiniDoras",
    icon: Network,
    title: "Agent team",
    summary: "Specialized MiniDoras make research, engineering, product, ops, memory, media, and trading research legible.",
    intent: "Agents appear as teammates with roles and audit trails, not anonymous automation.",
    link: "/dora/team",
    linkLabel: "Meet the team",
    events: ["Coordinate handoffs", "Surface public roles", "Separate research from execution"]
  },
  {
    id: "weiyu-ai",
    label: "Weiyu AI",
    icon: Sparkles,
    title: "Personal AI studio",
    summary: "The umbrella for experiments in AI workflows, creative systems, and research tools.",
    intent: "Keep the company idea as one studio inside a personal website until weiyudang.ai exists.",
    link: "/projects/weiyu-ai",
    linkLabel: "Weiyu AI",
    events: ["Map project boundary", "Publish public note", "Keep private app separate"]
  }
];

export function AiLabPanel() {
  const { locale } = useLanguage();
  const t = (value: string) => localizeSiteText(value, locale);
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
      <div className="home-ai-tabs" role="tablist" aria-label={t("Doraemon system layers")}>
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
              {t(mode.label)}
            </button>
          );
        })}
      </div>

      <div className="home-ai-command-room" aria-label={t("Doraemon Office public command-room preview")}>
        <Image
          className="home-ai-command-room-art"
          src="/visuals/doraemon-office-command-room-v2.png"
          alt=""
          width={1536}
          height={1024}
          sizes="(max-width: 1180px) 94vw, 54vw"
          priority={false}
        />

        <div className="home-ai-room-panel">
          <span>
            <Icon size={15} aria-hidden />
            {t(active.label)}
          </span>
          <strong>{t(active.title)}</strong>
          <p>{t(active.summary)}</p>
        </div>

        <div className="home-ai-mini-agent-strip" role="list" aria-label={t("Doraemon Office system pillars")}>
          <span role="listitem"><Bot size={16} aria-hidden />Doraemon</span>
          <span role="listitem"><Network size={16} aria-hidden />MiniDoras</span>
          <span role="listitem"><Sparkles size={16} aria-hidden />Weiyu AI</span>
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
            {t("active layer")}
          </span>
          <strong>{t(active.title)}</strong>
        </div>
        <p>{t(active.summary)}</p>
        <div className="home-ai-intent">
          <ShieldCheck size={18} aria-hidden />
          {t(active.intent)}
        </div>

        <div className="home-ai-events">
          {active.events.map((event, index) => (
            <div key={event}>
              <span className="mono">{index + 1}</span>
              <span>{t(event)}</span>
            </div>
          ))}
        </div>

        <div className="home-ai-boundary-strip">
          <span>
            <ShieldCheck size={15} aria-hidden />
            {t("Public-safe")}
          </span>
          <span>
            <Workflow size={15} aria-hidden />
            {t("Read-only")}
          </span>
          <span>
            <LockKeyhole size={15} aria-hidden />
            {t("Owner-only")}
          </span>
          <span>
            <Workflow size={14} aria-hidden />
            {t("Research-only")}
          </span>
        </div>

        <div className="home-ai-footer">
          <span>{t("Curated public guide. No prompts, credentials, private memory, or execution controls.")}</span>
          <Link
            href={active.link}
            className="link-focus home-text-action"
          >
            {t(active.linkLabel)}
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
