"use client";

import { useState, type PointerEvent } from "react";
import { github } from "@/content/site";
import { cn } from "@/lib/cn";
import { CELL, STEP, levelFill, type Day } from "@/lib/contributions";

const GAP = 6; // tooltip sits this many px above the hovered cell
const EDGE = 6; // columns from either edge where the tooltip aligns to the cell instead of centring

// Near the edges the pill hugs the cell instead of centring: shift it so its
// rounded end overhangs the cell by this much.
const nudge = { start: -12, center: 0, end: 12 } as const;

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

function countLabel(count: number) {
  if (count === 0) return github.tooltip.none;
  if (count === 1) return github.tooltip.one;
  return github.tooltip.many.replace("{n}", count.toLocaleString("en-US"));
}

type Active = { x: number; y: number; day: Day; left: number; top: number };

/**
 * The contribution SVG plus a hover tooltip (mouse only). One tooltip stays
 * mounted: it fades/scales in once, then jumps cell to cell with no
 * re-animation so scanning the graph stays instant.
 */
export function ContributionGrid({ weeks, className }: { weeks: (Day | null)[][]; className: string }) {
  const [active, setActive] = useState<Active | null>(null);
  const [open, setOpen] = useState(false);

  const width = weeks.length * STEP - (STEP - CELL);
  const height = 7 * STEP - (STEP - CELL);

  function onPointerMove(e: PointerEvent<SVGSVGElement>) {
    if (e.pointerType !== "mouse") return;
    const box = e.currentTarget.getBoundingClientRect();
    const scale = box.width / width;
    // Resolve from coordinates, not the event target, so the 3px gaps between
    // cells snap to the nearest cell instead of flickering the tooltip shut.
    const x = Math.min(weeks.length - 1, Math.max(0, Math.floor(((e.clientX - box.left) / scale + 1.5) / STEP)));
    const y = Math.min(6, Math.max(0, Math.floor(((e.clientY - box.top) / scale + 1.5) / STEP)));
    const day = weeks[x]?.[y];
    if (!day) return setOpen(false);
    setOpen(true);
    if (active?.day === day) return;
    setActive({ x, y, day, left: (x * STEP + CELL / 2) * scale, top: y * STEP * scale - GAP });
  }

  const align = !active ? "center" : active.x < EDGE ? "start" : active.x >= weeks.length - EDGE ? "end" : "center";

  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block h-auto w-full overflow-visible"
        aria-hidden="true"
        onPointerMove={onPointerMove}
        onPointerLeave={() => setOpen(false)}
      >
        {weeks.map((week, x) =>
          week.map((day, y) =>
            day ? (
              <rect
                key={day.date}
                x={x * STEP}
                y={y * STEP}
                width={CELL}
                height={CELL}
                rx={2}
                className={levelFill[day.level] ?? levelFill[0]}
              />
            ) : null,
          ),
        )}
        {/* Hover ring: drawn in the gap around the cell, so it reads on every level. */}
        {active && (
          <rect
            x={active.x * STEP - 1.5}
            y={active.y * STEP - 1.5}
            width={CELL + 3}
            height={CELL + 3}
            rx={3}
            strokeWidth={1}
            className={cn(
              "pointer-events-none fill-none stroke-ink transition-opacity ease-out-strong starting:opacity-0",
              open ? "opacity-100 duration-150" : "opacity-0 duration-100",
            )}
          />
        )}
      </svg>

      {active && (
        // Outer: follows the cell, no transition (instant between cells).
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 z-10"
          style={{ transform: `translate(${active.left + nudge[align]}px, ${active.top}px)` }}
        >
          {/* Middle: aligns the pill above the cell — centred, or hugging it near the edges. */}
          <div
            className={cn(
              "-translate-y-full",
              align === "center" && "-translate-x-1/2",
              align === "end" && "-translate-x-full",
            )}
          >
            {/* Inner: the entrance. Scales from the edge nearest the cell; exit is faster than enter. */}
            <div
              data-open={open || undefined}
              className={cn(
                "type-label flex items-baseline gap-2 whitespace-nowrap rounded-pill bg-ink px-3 py-1.5 text-paper tabular-nums shadow-card",
                "translate-y-0.5 scale-96 opacity-0 transition-[opacity,transform] duration-100 ease-out-strong",
                "data-open:translate-y-0 data-open:scale-100 data-open:opacity-100 data-open:duration-150",
                // First hover mounts it already open — @starting-style gives that frame an entrance too.
                "starting:data-open:translate-y-0.5 starting:data-open:scale-96 starting:data-open:opacity-0",
                align === "center" && "origin-bottom",
                align === "start" && "origin-bottom-left",
                align === "end" && "origin-bottom-right",
              )}
            >
              <span>{countLabel(active.day.count)}</span>
              <span className="text-paper/60">{dateFormat.format(new Date(active.day.date))}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
