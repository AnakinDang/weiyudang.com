"use client";

import { useEffect } from "react";

export function DoraOfficeRouteScroller({ active }: { active: string }) {
  useEffect(() => {
    const scrollActiveRoute = () => {
      const routeList = document.querySelector<HTMLElement>("[data-dora-office-route-list]");
      const activeLink = routeList?.querySelector<HTMLElement>('[aria-current="page"]');

      if (!routeList || !activeLink || !window.matchMedia("(max-width: 900px)").matches) {
        return;
      }

      activeLink.scrollIntoView({ block: "nearest", inline: "center" });
    };

    const frame = window.requestAnimationFrame(scrollActiveRoute);
    window.addEventListener("resize", scrollActiveRoute);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", scrollActiveRoute);
    };
  }, [active]);

  return null;
}
