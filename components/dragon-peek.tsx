"use client";

import { useEffect } from "react";
import { asciiDragonHead } from "@/components/ascii-dragon-head-art";

// -z-10 paints the head under the card's tray (same stacking context), so the
// tray's top edge hides the neck until it rises; `group` is on the card link.
const PEEK_CLASSES =
  "type-ascii-sm pointer-events-none absolute top-0 right-[12%] -z-10 select-none text-ink-3 transition-transform duration-500 ease-out-strong group-hover:-translate-y-[66%]";

/**
 * Hover a project card and the dragon's head rises from behind its image tray
 * — DESIGN.md §4 "ASCII dragon", §6. Appended to each card after hydration
 * (the cards are server components, never re-rendered on the client), so
 * work.tsx stays untouched; hover-capable pointers only, via group-hover.
 */
export function DragonPeek() {
  useEffect(() => {
    const cards = [...document.querySelectorAll<HTMLElement>('[data-testid="project-card"]')];
    const heads = cards.map((card) => {
      card.style.position = "relative";
      const head = document.createElement("pre");
      head.setAttribute("aria-hidden", "true");
      head.className = PEEK_CLASSES;
      head.textContent = asciiDragonHead;
      card.append(head);
      return head;
    });
    return () => {
      heads.forEach((head) => head.remove());
      cards.forEach((card) => card.style.removeProperty("position"));
    };
  }, []);
  return null;
}
