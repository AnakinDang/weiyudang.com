"use client";

import { useEffect } from "react";

// On narrow screens the office route dock is a horizontal rail. Keep the
// active route visible without forcing it to the center; centering can clip
// earlier routes and make the rail look broken on first paint.
export function DoraOfficeRouteScroller({ active }: { active: string }) {
  useEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;
    let cancelled = false;

    const revealActiveRoute = () => {
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
      const gutter = 8;

      if (linkRect.left < listRect.left + gutter) {
        const nextScrollLeft = Math.max(0, routeList.scrollLeft + (linkRect.left - listRect.left) - gutter);
        if (nextScrollLeft !== routeList.scrollLeft) {
          routeList.scrollLeft = nextScrollLeft;
        }
        return;
      }

      if (linkRect.right > listRect.right - gutter) {
        const maxScrollLeft = routeList.scrollWidth - routeList.clientWidth;
        const nextScrollLeft = Math.min(maxScrollLeft, routeList.scrollLeft + linkRect.right - listRect.right + gutter);
        if (nextScrollLeft !== routeList.scrollLeft) {
          routeList.scrollLeft = nextScrollLeft;
        }
      }
    };

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(revealActiveRoute);
    });
    // Re-check once web fonts settle: before they load the links are narrower
    // and the rail is not yet scrollable, so an early reveal can clamp to 0.
    if (typeof document !== "undefined" && document.fonts?.ready) {
      void document.fonts.ready.then(revealActiveRoute).catch(() => {});
    }
    window.addEventListener("resize", revealActiveRoute);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.removeEventListener("resize", revealActiveRoute);
    };
  }, [active]);

  return null;
}
