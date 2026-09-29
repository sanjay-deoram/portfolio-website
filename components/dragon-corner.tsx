"use client";

import { useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { asciiDragon } from "@/components/ascii-dragon-art";
import { cn } from "@/lib/cn";

// ogl and the shaders load on the client, after hydration.
const DitherVeil = dynamic(() => import("@/components/dither-veil").then((m) => m.DitherVeil), { ssr: false });

const COLOR_SRC = "/assets/dragon-color.png";

const noop = () => () => {};
const readPalette = () => {
  const style = getComputedStyle(document.documentElement);
  return `${style.getPropertyValue("--color-ink-3").trim()} ${style.getPropertyValue("--color-paper").trim()}`;
};

/**
 * The corner dragon — DESIGN.md §4 "ASCII dragon". Rests in the bottom-right,
 * whole and slightly tilted: the colour Chinese dragon dithered into faint
 * ink-3 dots (React Bits' DitherVeil, drawn from public/assets/dragon-color.png
 * — scripts/dragon-color.mjs). Hover it (hover-capable pointers only) and the
 * dots darken and a full-colour window opens under the cursor, knitting back
 * into dots behind it. Multiply-blended, so the paper vanishes and the column
 * grid shows through. Hidden until the veil has drawn its first real frame
 * (before that its canvas is a flat box), then fades in.
 */
export function CornerDragon() {
  // The shader wants the token values, which live in CSS — client only.
  const palette = useSyncExternalStore(noop, readPalette, () => null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(false);
  const [ink, paper] = palette?.split(" ") ?? [];

  const enter = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    setActive(true);
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-6 bottom-6 z-0 origin-bottom-right -rotate-3 mix-blend-multiply select-none"
    >
      <div
        className="relative [@media(hover:hover)]:pointer-events-auto"
        onPointerEnter={enter}
        onPointerLeave={() => setActive(false)}
      >
        {/* Never shown: the ASCII art only gives the dragon its frame. */}
        <pre className="type-ascii-lg invisible">{asciiDragon}</pre>
        {palette && (
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-500 ease-out-strong",
              !ready ? "opacity-0" : active ? "opacity-100" : "opacity-25",
            )}
          >
            <DitherVeil
              src={COLOR_SRC}
              fit="cover"
              intro={false}
              pattern="floyd"
              pixelSize={2}
              inkColor={ink}
              paperColor={paper}
              contrast={1.3}
              brightness={-0.08}
              revealRadius={150}
              softness={0.6}
              linger={1.4}
              clickBurst={false}
              onReady={() => setReady(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
