"use client";

import { ArrowUpRight } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import { companyDirections } from "@/lib/company-content";
import { DirectionArtwork } from "./DirectionArtwork";

export function CompanyCapabilities() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = companyDirections[selected];
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (["ArrowDown", "ArrowRight"].includes(event.key)) next = (index + 1) % companyDirections.length;
    else if (["ArrowUp", "ArrowLeft"].includes(event.key)) next = (index - 1 + companyDirections.length) % companyDirections.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = companyDirections.length - 1;
    else return;
    event.preventDefault();setSelected(next);tabs.current[next]?.focus();
  }
  return (
    <div className="capability-browser">
      <div className="capability-tabs" role="tablist" aria-label="业务与技术方向">
        {companyDirections.map((item,index) => <button key={item.id} id={"capability-" + item.id} type="button" role="tab" aria-selected={selected===index} aria-controls="capability-panel" tabIndex={selected===index?0:-1} ref={element=>{tabs.current[index]=element;}} onClick={()=>setSelected(index)} onKeyDown={event=>onKeyDown(event,index)}>{item.label}</button>)}
      </div>
      <div className="capability-panel" id="capability-panel" role="tabpanel" aria-labelledby={"capability-" + active.id} tabIndex={0}>
        <div className="capability-content" key={active.id}>
          <div className="capability-detail">
            <h3>{active.headline[0]}<br />{active.headline[1]}</h3>
            <p>{active.lead}</p>
            <dl className="capability-pillars">{active.pillars.map(item=><div key={item.title}><dt>{item.title}</dt><dd>{item.body}</dd></div>)}</dl>
            <a className="accent-link" href={"/technology/"+active.id}>{"了解" + active.label}<ArrowUpRight size={22} strokeWidth={1.15} aria-hidden="true" /></a>
          </div>
          <div className="capability-visual"><DirectionArtwork direction={active} /></div>
        </div>
      </div>
      <noscript><style>{".capability-tabs,.capability-panel{display:none!important}"}</style><div className="noscript-capabilities">{companyDirections.map(item=><section key={item.id}><h3><a href={"/technology/"+item.id}>{item.label}<ArrowUpRight size={19} aria-hidden="true" /></a></h3><p>{item.lead}</p></section>)}</div></noscript>
    </div>
  );
}
