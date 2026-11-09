"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import { companyCapabilities } from "@/lib/company-capabilities";

export function CompanyCapabilities() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = companyCapabilities[selected];

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (["ArrowDown", "ArrowRight"].includes(event.key)) next = (index + 1) % companyCapabilities.length;
    else if (["ArrowUp", "ArrowLeft"].includes(event.key)) next = (index - 1 + companyCapabilities.length) % companyCapabilities.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = companyCapabilities.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className="capability-browser">
      <div className="capability-tabs" role="tablist" aria-label="业务与技术方向" aria-orientation="vertical">
        {companyCapabilities.map((item, index) => (
          <button key={item.id} id={`capability-${item.id}`} type="button" role="tab" aria-selected={selected === index}
            aria-controls="capability-panel" tabIndex={selected === index ? 0 : -1}
            ref={(element) => { tabs.current[index] = element; }}
            onClick={() => setSelected(index)} onKeyDown={(event) => onKeyDown(event, index)}>
            <span className="selection-dot" aria-hidden="true" /><span>{item.label}</span><ArrowRight size={21} strokeWidth={1.2} aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className="capability-panel" id="capability-panel" role="tabpanel" aria-labelledby={`capability-${active.id}`} tabIndex={0}>
        <div className="capability-orbit" aria-hidden="true">
          <Image className="particle-loop capability-particle" src="/company/mobius-particles.webp" alt="" width={1536} height={1024} sizes="(max-width: 760px) 75vw, 35vw" quality={95} />
          <svg viewBox="0 0 700 320" fill="none"><ellipse cx="350" cy="160" rx="270" ry="90" transform="rotate(-10 350 160)" /></svg>
          {active.nodes.map((label, index) => <span className={`orbit-label orbit-label-${index}`} key={index}><i />{label}</span>)}
        </div>
        <div className="capability-detail" key={active.id}>
          <h3>{active.title}</h3><p>{active.description}</p>
          <a className="accent-link" href="#contact">从业务场景开始<ArrowRight size={21} strokeWidth={1.3} aria-hidden="true" /></a>
        </div>
      </div>
      <noscript><div className="noscript-capabilities">{companyCapabilities.slice(1).map((item) => <section key={item.id}><h3>{item.label}</h3><p>{item.description}</p></section>)}</div></noscript>
    </div>
  );
}
