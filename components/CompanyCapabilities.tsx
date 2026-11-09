"use client";

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
        <div className="capability-relationships" aria-hidden="true">
          <svg className="relationship-wide" viewBox="0 0 740 330" fill="none">
            <path d="M170 96C245 60 295 160 330 160M135 165C135 230 160 240 185 240M232 240C280 250 304 230 332 205M494 170C545 190 559 157 587 157" />
            <circle cx="105" cy="100" r="65" /><circle cx="185" cy="240" r="48" /><circle cx="410" cy="165" r="86" /><circle cx="650" cy="165" r="63" />
            <text x="105" y="106" textAnchor="middle">{active.nodes[0]}</text><text x="185" y="246" textAnchor="middle">{active.nodes[1]}</text><text x="410" y="171" textAnchor="middle">{active.nodes[2]}</text><text x="650" y="171" textAnchor="middle">{active.nodes[3]}</text>
          </svg>
          <svg className="relationship-narrow" viewBox="0 0 400 240" fill="none">
            <path d="M122 75C156 72 169 110 177 116M75 124C75 145 85 149 91 150M153 188C170 190 185 177 195 166M295 166C305 174 305 180 308 183" />
            <circle cx="70" cy="70" r="54" /><circle cx="110" cy="190" r="44" /><circle cx="245" cy="120" r="68" /><circle cx="350" cy="200" r="45" />
            <text x="70" y="76" textAnchor="middle">{active.nodes[0]}</text><text x="110" y="196" textAnchor="middle">{active.nodes[1]}</text><text x="245" y="126" textAnchor="middle">{active.nodes[2]}</text><text x="350" y="206" textAnchor="middle">{active.nodes[3]}</text>
          </svg>
        </div>
        <div className="capability-detail" key={active.id}>
          <h3>{active.title}</h3><p>{active.description}</p>
          <a className="accent-link" href="#contact">从业务场景开始<ArrowRight size={21} strokeWidth={1.3} aria-hidden="true" /></a>
        </div>
      </div>
      <noscript><style>{`.capability-tabs,.capability-panel{display:none!important}.capability-browser{grid-template-columns:1fr!important}`}</style><div className="noscript-capabilities">{companyCapabilities.map((item) => <section key={item.id}><h3>{item.label}</h3><p>{item.description}</p></section>)}</div></noscript>
    </div>
  );
}
