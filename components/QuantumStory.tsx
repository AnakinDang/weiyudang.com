"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { startQuantumStory, storyImages } from "@/lib/quantum-story-renderer";

const chapters = [
  { id: "knowledge", label: "知识汇聚", title: ["让分散的知识，", "汇成共同的理解。"], body: "连接文档、业务数据与专家经验，让每一次判断都有可以回看的依据。" },
  { id: "agents", label: "智能体协作", title: ["让不同的智能，", "围绕同一个目标协作。"], body: "把任务、知识与工具组织起来，让智能体各司其职，也让人的判断始终有位置。" },
  { id: "action", label: "业务行动", title: ["让每一个判断，", "连接真实的业务行动。"], body: "将理解转为可检查的建议、可执行的工作流和清晰的交付结果，进入组织每天的工作。" },
  { id: "feedback", label: "反馈循环", title: ["让每一次反馈，", "成为下一次进化的起点。"], body: "把运行记录、专家复核与新的知识带回系统，让下一次行动建立在已经积累的经验之上。" }
];
export function QuantumStory() {
  const root = useRef<HTMLElement>(null), canvas = useRef<HTMLCanvasElement>(null), progress = useRef(0);
  const renderer = useRef<ReturnType<typeof startQuantumStory> | null>(null);
  const [active, setActive] = useState(0), [paused, setPaused] = useState(false);
  useEffect(() => {
    const node = root.current, surface = canvas.current;
    if (!node || !surface) return;
    const panels = [...node.querySelectorAll<HTMLElement>("[data-story-chapter]")];
    let current = 0, frame = 0;
    const update = () => {
      frame = 0;
      const first = panels[0].getBoundingClientRect();
      const readingLine = innerWidth <= 640 ? innerHeight * .78 : innerHeight * .5;
      const value = Math.max(0, Math.min(3, (readingLine - first.top - first.height / 2) / first.height));
      progress.current = value;
      const next = Math.round(value);
      if (next !== current) { current = next; node.dataset.stage = String(next); setActive(next); }
      renderer.current?.refresh();
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const motion = startQuantumStory(surface, () => progress.current, state => { node.dataset.motion = state; });
    renderer.current = motion;
    update(); window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); motion.dispose(); renderer.current = null; };
  }, []);
  useEffect(() => { renderer.current?.setPaused(paused); }, [paused]);
  return (
    <section id="evolution" ref={root} className="quantum-story technology-light" data-stage="0" data-motion="loading" aria-label="知识与行动的循环">
      <div className="story-grid wrap"><ol className="story-chapters">{chapters.map((chapter, index) => <li key={chapter.id} data-story-chapter={index}><div id={"evolution-" + chapter.id}><h2>{chapter.title[0]}<br />{chapter.title[1]}</h2><p>{chapter.body}</p></div></li>)}</ol>
        <figure className="story-visual"><div className="story-art" aria-hidden="true">{storyImages.map((src, index) => <img key={src} src={src} alt="" width={1254} height={1254} loading="lazy" className={"story-poster story-poster-" + index} />)}<canvas ref={canvas} /></div><figcaption className="story-rail">{chapters.map((chapter, index) => <a key={chapter.id} href={"#evolution-" + chapter.id} aria-current={active === index ? "step" : undefined}>{chapter.label}</a>)}</figcaption><button className="story-motion-control" type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}{paused ? "播放叙事动效" : "暂停叙事动效"}</button></figure>
      </div>
    </section>
  );
}
