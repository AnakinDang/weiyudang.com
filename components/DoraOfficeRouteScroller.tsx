"use client";

import { useEffect } from "react";

// On narrow screens the office route dock is a horizontal rail. Center the
// active route so visitors always see where they are (IA: active navigation
// must stay visible when the rail scrolls). Sets scrollLeft directly — so it
// only moves the rail, never the window.
export function DoraOfficeRouteScroller({ active }: { active: string }) {
  useEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;
    let cancelled = false;

    const centerActiveRoute = () => {
      if (cancelled) return;
      const routeList = document.querySelector<HTMLElement>("[data-dora-office-route-list]");
      const activeLink = routeList?.querySelector<HTMLElement>('[aria-current="page"]');

      if (!routeList || !activeLink || !window.matchMedia("(max-width: 900px)").matches) {
        return;
      }

      // Use rect deltas so the math is independent of which ancestor is the
      // positioned offsetParent (offsetLeft would otherwise add the dock
      // border/gap as a constant error).
      const listRect = routeList.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      const centered =
        routeList.scrollLeft + (linkRect.left - listRect.left) - (routeList.clientWidth - activeLink.clientWidth) / 2;
      routeList.scrollLeft = Math.max(0, centered);
    };

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(centerActiveRoute);
    });
    // Re-center once web fonts settle: before they load the links are narrower
    // and the rail is not yet scrollable, so an early center would clamp to 0.
    if (typeof document !== "undefined" && document.fonts?.ready) {
      void document.fonts.ready.then(centerActiveRoute).catch(() => {});
    }
    window.addEventListener("resize", centerActiveRoute);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.removeEventListener("resize", centerActiveRoute);
    };
  }, [active]);

  return null;
}
