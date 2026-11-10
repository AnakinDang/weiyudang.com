"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { CompanyDirection } from "@/lib/company-content";
import { startQuantumFlow } from "@/lib/quantum-flow-renderer";

export function QuantumArtwork({ direction, src, children }: { direction: CompanyDirection["id"]; src: string; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const motion = useRef<ReturnType<typeof startQuantumFlow> | null>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!root.current || !canvas.current) return;
    const node = root.current;
    const controller = startQuantumFlow(canvas.current, src, direction, state => { node.dataset.motion = state; });
    motion.current = controller;
    return () => { controller.dispose(); motion.current = null; };
  }, [src, direction]);
  useEffect(() => { motion.current?.setPaused(paused); }, [paused, src, direction]);
  return (
    <div ref={root} className="quantum-artwork" data-quantum-artwork={direction} data-motion="loading">
      {children}
      <canvas ref={canvas} aria-hidden="true" />
      <button type="button" className="artwork-motion-control" onClick={() => setPaused(value => !value)} aria-pressed={paused} aria-label={paused ? "播放图形动效" : "暂停图形动效"}>
        {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}<span>{paused ? "播放动效" : "暂停动效"}</span>
      </button>
    </div>
  );
}
