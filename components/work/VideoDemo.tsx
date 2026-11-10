"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { subtitles, videoClips, videoPlan, type VideoPlan } from "@/lib/demo-workflows";
import { downloadText } from "./download";
import { VideoSimulator } from "./VideoSimulator";

export function VideoDemo() {
  const [duration, setDuration] = useState(12), [reverse, setReverse] = useState(false);
  const [captions, setCaptions] = useState(() => videoClips.map(clip => clip.caption));
  const plan = useMemo(() => { try { return videoPlan(duration, reverse, captions); } catch { return null; } }, [duration, reverse, captions]);
  const fallback = useMemo(() => videoPlan(12, false, videoClips.map(clip => clip.caption)), []);
  function reset() { setDuration(12); setReverse(false); setCaptions(videoClips.map(clip => clip.caption)); }
  function exportPlan(current: VideoPlan) {
    downloadText(JSON.stringify({ project: "莫比乌斯剪辑方案", simulation: true, durationSeconds: current.duration, scenes: current.clips.map((clip, index) => ({ scene: clip.id, label: clip.label, start: index * current.duration / 3, end: (index + 1) * current.duration / 3, caption: current.captions[index] })) }, null, 2), "mobius-editing-plan.json", "application/json;charset=utf-8");
  }
  return (
    <section className="demo-workbench video-workbench" aria-label="剪辑交互演示">
      <div className="video-preview"><div className="video-preview-title"><h2>剪辑预演</h2><span>交互演示</span></div><VideoSimulator plan={plan ?? fallback} /><p>播放、跳转镜头，预演时长、顺序与字幕的组合。</p></div>
      <div className="video-editor"><div className="video-fields"><label>片长<select value={duration} onChange={event => setDuration(Number(event.target.value))}><option value="12">12 秒</option><option value="18">18 秒</option></select></label><label>镜头顺序<select value={reverse ? "reverse" : "default"} onChange={event => setReverse(event.target.value === "reverse")}><option value="default">知识 → 协作 → 进化</option><option value="reverse">协作 → 知识 → 进化</option></select></label></div>
      <fieldset className="video-captions"><legend>镜头字幕</legend>{videoClips.map((clip, index) => <label key={clip.id}><span>{clip.label}</span><input aria-label={clip.label + "镜头字幕"} aria-invalid={!captions[index].trim()} value={captions[index]} maxLength={26} onChange={event => { const next = [...captions]; next[index] = event.target.value; setCaptions(next); }} /></label>)}</fieldset>
      <div className="editing-outline"><h3>从简报到剪辑方案</h3><ol><li><strong>组织表达</strong><p>用三段可编辑字幕，定义这支短片要表达的内容。</p></li><li><strong>安排镜头</strong><p>选择时长和顺序，在时间线上预演节奏。</p></li><li><strong>交给创作</strong><p>导出镜头方案与字幕，供剪辑、配音与制作继续使用。</p></li></ol></div>
      <p className="demo-status" role="status">{plan ? "修改即时生效，可播放预演并导出当前方案。" : "请为每个镜头填写1至26字字幕；预览暂保留默认示例。"}</p>
      <div className="demo-actions video-actions"><button type="button" className="demo-primary" disabled={!plan} onClick={() => { if (plan) exportPlan(plan); }}><Download size={16} aria-hidden="true" />下载剪辑方案</button><button type="button" disabled={!plan} onClick={() => { if (plan) downloadText(subtitles(plan), "mobius-demo-subtitles.srt", "text/plain;charset=utf-8"); }}>导出字幕</button><button type="button" onClick={reset}>重置</button></div>
      <p className="demo-data-note">预演镜头节奏、顺序与字幕，导出方案后即可继续制作。</p></div>
    </section>
  );
}
