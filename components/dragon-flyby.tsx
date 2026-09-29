"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import {
  asciiDragonFlying,
  asciiDragonFlyingJointCol,
  asciiDragonFlyingNeckCol,
  asciiDragonFlyingSpineRow,
} from "@/components/ascii-dragon-flying-art";

// The corner dragon, straightened (scripts/ascii-flying.mjs), cut into
// one-glyph columns — tail first — plus the head as one rigid block. Each
// column is a slice across the body; turning and moving the slices bends the
// body into coils. Lengths are in em: a glyph is 0.6em wide and 1em tall.
const ROWS = asciiDragonFlying.split("\n");
const GLYPH = 0.6;
const NECK = asciiDragonFlyingNeckCol;
const JOINT = asciiDragonFlyingJointCol;
const SPINE_Y = asciiDragonFlyingSpineRow + 0.5;
const COLUMNS = Array.from({ length: NECK }, (_, col) => ROWS.map((row) => row[col] ?? " ").join("\n"));
const HEAD = ROWS.map((row) => row.slice(NECK)).join("\n");
/** How far along the body (from the joint the head turns on) the rigid neck
 * inside the head block reaches, and where the tail ends. */
const RIGID = (JOINT - NECK) * GLYPH;
const LENGTH = (JOINT - 0.5) * GLYPH;

// The coils: a wave runs from the head down to the tail every PERIOD ms,
// swinging the body's heading up to SWING degrees either way. WAVES
// wavelengths fit on the body. The head rides the wave too — it rises and dips
// with its neck and nods the way it's going — but the neck only swings CALM of
// the way (so the head nods ±26°, not ±48°), easing up to the full swing over
// a RAMP share of the body, so the neck curves into the head without a kink.
// FRAMES keyframes per wave (29ms apart), played linearly — close enough that
// the speed never visibly steps.
const PERIOD = 2800;
const WAVES = 1.8;
const SWING = 48;
const CALM = 0.55;
const RAMP = 0.3;
const FRAMES = 96;

// The crossing: first pass DELAY ms after load, then one every pass + GAP ms.
// Its speed isn't fixed — see DragonFlyby.
const DELAY = 1200;
const GAP = 12000;

const COLUMN_STYLE: CSSProperties = { transformOrigin: `50% ${SPINE_Y}em` };
const HEAD_STYLE: CSSProperties = { transformOrigin: `${RIGID}em ${SPINE_Y}em` };

const smoothstep = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

/** The body's heading (radians, clockwise) at distance `s` behind the joint,
 * `t` of the way through a wave. */
function heading(s: number, t: number) {
  const along = Math.max(s, RIGID);
  const swing = CALM + (1 - CALM) * smoothstep((along - RIGID) / (RAMP * LENGTH));
  return ((SWING * Math.PI) / 180) * swing * Math.sin((2 * Math.PI * WAVES * along) / LENGTH - 2 * Math.PI * t);
}

/** How much of the body's length its bends leave for crossing the screen:
 * the average cos(heading) along it, over a wave. */
function level() {
  let sum = 0;
  let samples = 0;
  for (let f = 0; f < FRAMES; f++)
    for (let s = 0; s < LENGTH; s += GLYPH) {
      sum += Math.cos(heading(s, f / FRAMES));
      samples++;
    }
  return sum / samples;
}

const degrees = (radians: number) => `${((radians * 180) / Math.PI).toFixed(2)}deg`;

/** One frame: a transform per column (tail first), then the head's. Walks
 * back from the joint, laying each column where the bent body puts it, then
 * shifts everything so the body's average height holds still — the coils stay
 * level and the head rises and dips with the wave. */
function pose(t: number) {
  const STEP = GLYPH / 4;
  const columns: { x: number; y: number; h: number }[] = new Array(NECK);
  let x = 0;
  let y = 0;
  let s = 0;
  for (let col = NECK - 1; col >= 0; col--) {
    const centre = (JOINT - col - 0.5) * GLYPH;
    for (; s < centre - 1e-9; s += STEP) {
      const h = heading(s + STEP / 2, t);
      x -= Math.cos(h) * STEP;
      y -= Math.sin(h) * STEP;
    }
    // Straight, this column's centre sits `centre` behind the joint, level.
    columns[col] = { x: x + centre, y, h: heading(centre, t) };
  }
  const lift = columns.reduce((sum, column) => sum + column.y, 0) / NECK;
  return [
    ...columns.map((c) => `translate(${c.x.toFixed(3)}em, ${(c.y - lift).toFixed(3)}em) rotate(${degrees(c.h)})`),
    `translate(0, ${(-lift).toFixed(3)}em) rotate(${degrees(heading(0, t))})`,
  ];
}

/**
 * The corner dragon flying across the screen — DESIGN.md §4 "ASCII dragon",
 * §6. The coils are a Web Animation per column, the crossing one more, all
 * transform-only (they run on the compositor) and computed once on mount.
 * Hidden, and never started, under reduced motion.
 */
export function DragonFlyby() {
  const flight = useRef<HTMLDivElement>(null);
  const sprite = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = flight.current;
    const body = sprite.current;
    if (!wrapper || !body || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frames = Array.from({ length: FRAMES + 1 }, (_, f) => pose(f / FRAMES));
    const animations = ([...body.children] as HTMLElement[]).map((part, i) =>
      part.animate(
        frames.map((frame) => ({ transform: frame[i] })),
        { duration: PERIOD, iterations: Infinity },
      ),
    );
    // It flies exactly as fast as the wave runs back down its body, so every
    // part of the body passes through the same points in the air as the head
    // did: it flows along one path instead of wiggling in place while it
    // slides. The wave covers a wavelength of body per PERIOD, but the bends
    // take up length, so across the screen that's only level() of it. That
    // fixes the speed, so the crossing takes as long as the screen is wide.
    const wavelength = (LENGTH / WAVES) * level() * parseFloat(getComputedStyle(body).fontSize);
    const crossing = ((innerWidth + wrapper.offsetWidth) / wavelength) * PERIOD;
    animations.push(
      wrapper.animate(
        [
          { transform: "translateX(-100%)" },
          { transform: "translateX(100vw)", offset: crossing / (crossing + GAP) },
          { transform: "translateX(100vw)" },
        ],
        { duration: crossing + GAP, delay: DELAY, iterations: Infinity, fill: "backwards" },
      ),
    );
    // All in step, whenever each one got created.
    const start = document.timeline.currentTime;
    if (start !== null) animations.forEach((animation) => (animation.startTime = start));
    return () => animations.forEach((animation) => animation.cancel());
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed top-24 left-0 z-0 hidden w-max select-none motion-safe:block">
      {/* px-8: room so no sliver shows before or after a pass. Parked off
          screen until the crossing starts. */}
      <div ref={flight} className="w-max px-8" style={{ transform: "translateX(-100%)" }}>
        {/* 55% vs the corner's 30%: the smaller glyphs are thinner. */}
        <div ref={sprite} className="type-ascii-xs flex text-ink-3 opacity-55">
          {COLUMNS.map((column, i) => (
            <span key={i} style={COLUMN_STYLE}>
              {column}
            </span>
          ))}
          <span style={HEAD_STYLE}>{HEAD}</span>
        </div>
      </div>
    </div>
  );
}
