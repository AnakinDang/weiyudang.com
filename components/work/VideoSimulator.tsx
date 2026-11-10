"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { VideoPlan } from "@/lib/demo-workflows";

export function VideoSimulator({ plan, compact = false }: { plan: VideoPlan; compact?: boolean }) {
  const [playing, setPlaying] = useState(false), [time, setTime] = useState(0);
  const clock = useRef(0);
  useEffect(() => { clock.current = 0; setTime(0); setPlaying(false); }, [plan]);
  useEffect(() => {
    if (!playing) return;
    let frame = 0, last = performance.now(), published = 0;
    const tick = (now: number) => {
      clock.current = Math.min(plan.duration, clock.current + (now - last) / 1000); last = now;
      if (now - published >= 100 || clock.current >= plan.duration) { setTime(clock.current); published = now; }
      if (clock.current >= plan.duration) setPlaying(false); else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, plan.duration]);
  useEffect(() => { const stop = () => { if (document.hidden) setPlaying(false); }; document.addEventListener("visibilitychange", stop); return () => document.removeEventListener("visibilitychange", stop); }, []);
  const segment = plan.duration / 3, index = Math.min(2, Math.floor(time / segment)), clip = plan.clips[index];
  const labels = clip.id === "knowledge" ? ["企业知识", "业务规则", "专家经验"] : clip.id === "agents" ? ["理解任务", "执行工作流", "人工复核"] : ["运行记录", "持续评测", "下一次行动"];
  function seek(value: number) { setPlaying(false); clock.current = value; setTime(value); }
  return (
    <div className={"html-video-simulator" + (compact ? " simulator-compact" : "")} data-simulator-time={time.toFixed(2)} data-simulator-scene={clip.id}>
      <div className="sim-stage" data-playing={playing}>
        <div className="sim-scene-index"><span>0{index + 1} / 03</span><span>{clip.label}</span></div>
        <div className={"sim-diagram sim-diagram-" + clip.id} aria-hidden="true"><i /><i /><i /><div className="sim-diagram-core">∞</div>{labels.map((label, at) => <span className={"sim-node sim-node-" + at} key={label}>{label}</span>)}</div>
        <p className="sim-caption">{plan.captions[index]}</p>
        <p className="sim-stage-note">镜头预演</p>
      </div>
      <div className="sim-player-controls"><button type="button" aria-label={playing ? "暂停剪辑预演" : "播放剪辑预演"} onClick={() => { if (clock.current >= plan.duration) seek(0); setPlaying(value => !value); }}>{playing ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}<span>{playing ? "暂停" : "播放"}</span></button><span className="sim-time">00:{String(Math.floor(time)).padStart(2, "0")} / 00:{plan.duration}</span><button type="button" aria-label="从头预演" onClick={() => seek(0)}><RotateCcw size={16} aria-hidden="true" /></button></div>
      <input className="sim-scrubber" type="range" min="0" max={plan.duration} step=".1" value={time} aria-label="剪辑预演进度" onChange={event => seek(Number(event.target.value))} />
      <ol className="sim-timeline" aria-label="剪辑镜头">{plan.clips.map((item, at) => <li key={item.id}><button type="button" aria-pressed={index === at} aria-label={"预演镜头：" + item.label} onClick={() => seek(at * segment)}><span>00:{String(at * segment).padStart(2, "0")}</span><strong>{item.label}</strong></button></li>)}</ol>
    </div>
  );
}
