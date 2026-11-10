"use client";

import { useEffect, useRef, useState } from "react";

const chapters = ["work", "technology", "solutions", "delivery", "about", "contact"] as const;

export function CompanyHeader({ light = false, context }: { light?: boolean; context?: "technology" | "work" }) {
  const header = useRef<HTMLElement>(null);
  const fallback = context ?? (light ? "technology" : "");
  const [activeChapter, setActiveChapter] = useState(fallback);
  useEffect(() => {
    let previous = window.scrollY;
    let current = fallback;
    setActiveChapter(fallback);
    const sections = chapters.map(id => document.getElementById(id)).filter((node): node is HTMLElement => node !== null);
    const updateChapter = () => {
      let next = fallback;
      const readingLine = (header.current?.offsetHeight ?? 78) + 32;
      for (const section of sections) if (section.getBoundingClientRect().top <= readingLine) next = section.id;
      if (next !== current) { current = next; setActiveChapter(next); }
    };
    if (header.current) header.current.dataset.scrolled = String(previous > 40);
    updateChapter();
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const next = window.scrollY;
        const node = header.current;
        if (node && Math.abs(next - previous) > 4) {
          node.dataset.hidden = String(next > previous && next > 180);
          node.dataset.scrolled = String(next > 40);
          previous = next;
        }
        updateChapter();
        frame = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("hashchange", onScroll); cancelAnimationFrame(frame); };
  }, [fallback]);
  return (
    <header ref={header} className={"company-header" + (light ? " header-light" : "")}>
      <div className="wrap header-inner">
        <a className="wordmark" href="/" aria-label="莫比乌斯项目首页">
          <svg viewBox="0 0 72 34" fill="none" aria-hidden="true">
            <path d="M36 17C27 9 20 3 13 5C5 7 2 12 3 18C4 25 10 30 17 28C24 27 30 21 36 17C45 9 53 3 60 5C68 7 71 13 69 19C67 26 61 30 55 28C49 26 42 21 36 17Z" stroke="currentColor" strokeWidth="1.15" />
            <path d="M7 11C16 5 25 13 36 19C46 25 57 32 66 23" stroke="currentColor" strokeWidth=".65" opacity=".55" />
          </svg>
        </a>
        <nav aria-label="主导航">
          <a href="/#technology" aria-label="业务与技术" aria-current={activeChapter === "technology" ? "location" : undefined}><span className="nav-text-desktop">业务与技术</span><span className="nav-text-mobile">业务</span></a>
          <a href="/work" aria-label="演示案例" aria-current={activeChapter === "work" ? context === "work" ? "page" : "location" : undefined}><span className="nav-text-desktop">演示案例</span><span className="nav-text-mobile">演示</span></a>
          <a href="/#solutions" aria-label="解决方案" aria-current={activeChapter === "solutions" ? "location" : undefined}><span className="nav-text-desktop">解决方案</span><span className="nav-text-mobile">方案</span></a>
          <a href="/#delivery" aria-current={activeChapter === "delivery" ? "location" : undefined}>交付方式</a>
          <a href="/#about" aria-current={activeChapter === "about" ? "location" : undefined}>关于我们</a>
          <a href="/#contact" aria-label="联系合作" aria-current={activeChapter === "contact" ? "location" : undefined}><span className="nav-text-desktop">联系合作</span><span className="nav-text-mobile">合作</span></a>
        </nav>
      </div>
    </header>
  );
}
