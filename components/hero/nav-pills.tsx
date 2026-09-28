"use client";

import { useLayoutEffect, useRef } from "react";
import { Pill } from "@/components/ui/pill";
import { nav } from "@/content/site";

/**
 * Desktop nav pills, DESIGN.md §5/§6. On mount they slide out from behind
 * the first pill: pill *i* starts translated left by its own `offsetLeft`
 * (measured before paint, so there's no flash) and animates to `0` via
 * WAAPI, with z-index decreasing left-to-right so earlier pills stack on
 * top while sliding out from underneath.
 */
export function NavPills() {
  const navRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const container = navRef.current;
    if (!container) return;

    const items = Array.from(
      container.querySelectorAll<HTMLElement>("[data-nav-pill-wrap]"),
    );

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const offsets = items.map((item) => item.offsetLeft);
    items.forEach((item, i) => {
      item.style.transform = `translateX(-${offsets[i]}px)`;
    });

    const players = items.map((item, i) =>
      item.animate(
        [{ transform: `translateX(-${offsets[i]}px)` }, { transform: "translateX(0)" }],
        {
          duration: 550,
          delay: 250,
          easing: "cubic-bezier(0.23, 1, 0.32, 1)",
          fill: "forwards",
        },
      ),
    );

    return () => {
      players.forEach((player) => player.cancel());
    };
  }, []);

  return (
    <nav ref={navRef} aria-label="Page" className="relative flex items-center gap-2">
      {nav.map((item, index) => (
        <div
          key={item.href}
          data-nav-pill-wrap
          className="relative"
          style={{ zIndex: 100 - index }}
        >
          <Pill data-testid="nav-pill" variant="glass" href={item.href} external={item.external}>
            {item.label}
          </Pill>
        </div>
      ))}
    </nav>
  );
}
