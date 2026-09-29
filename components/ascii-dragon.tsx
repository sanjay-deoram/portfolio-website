import type { CSSProperties } from "react";
import { CornerDragon } from "@/components/dragon-corner";
import { DragonFlyby } from "@/components/dragon-flyby";
import { DragonPeek } from "@/components/dragon-peek";

/**
 * The ASCII dragon layer — DESIGN.md §4 "ASCII dragon", §6. Everything is
 * decorative: aria-hidden, pointer-events-none, behind the content (z-0), and
 * still or absent under prefers-reduced-motion. Nothing here moves with the
 * scroll. The art is generated from an illustration by scripts/ascii-art.mjs
 * and scripts/ascii-flying.mjs.
 */
export function AsciiDragon() {
  return (
    <>
      <CornerDragon />
      <Embers />
      <DragonFlyby />
      <DragonPeek />
    </>
  );
}

// Seeded PRNG, so the server and client agree on the embers (no hydration drift).
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const EMBER_GLYPHS = [".", "'", "*", "+", ",", "."];

const EMBERS = (() => {
  const rand = mulberry32(7);
  return Array.from({ length: 18 }, () => {
    // Two thirds on the right, where the corner dragon is.
    const right = rand() < 0.66;
    const duration = 11 + rand() * 9;
    return {
      glyph: EMBER_GLYPHS[Math.floor(rand() * EMBER_GLYPHS.length)],
      style: {
        "--x": `${(right ? 55 + rand() * 43 : 2 + rand() * 40).toFixed(1)}%`,
        "--dur": `${duration.toFixed(2)}s`,
        "--delay": `${(-rand() * duration).toFixed(2)}s`,
        "--drift": `${Math.round((rand() - 0.5) * 120)}px`,
        "--s": (1.1 + rand() * 1.1).toFixed(2),
      } as CSSProperties,
    };
  });
})();

/** Faint ASCII sparks drifting up the page (negative delays, so they're
 * already mid-flight on load). */
function Embers() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 hidden overflow-hidden select-none motion-safe:block"
    >
      {EMBERS.map((ember, i) => (
        <span key={i} className="ember type-ascii-md text-ink-3" style={ember.style}>
          <span className="ember-sway" style={{ animationDelay: `${(-i * 0.37).toFixed(2)}s` }}>
            {ember.glyph}
          </span>
        </span>
      ))}
    </div>
  );
}
