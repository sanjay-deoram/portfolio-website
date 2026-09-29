"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { asciiDragon } from "@/components/ascii-dragon-art";
import { cn } from "@/lib/cn";

// ogl and the shaders only load once someone hovers the dragon.
const DitherVeil = dynamic(() => import("@/components/dither-veil").then((m) => m.DitherVeil), { ssr: false });

const COLOR_SRC = "/assets/dragon-color.png";

const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/**
 * The corner dragon — DESIGN.md §4 "ASCII dragon". Rests as ASCII in the
 * bottom-right, whole and slightly tilted. Hover it (hover-capable pointers
 * only) and it dithers into a Chinese dragon in colour, revealed under the
 * cursor and knitting back into dots behind it (React Bits' DitherVeil, drawn
 * from public/assets/dragon-color.png — scripts/dragon-color.mjs). Multiply-
 * blended, so the white ground vanishes and the column grid shows through.
 */
export function CornerDragon() {
  const [colors, setColors] = useState<{ ink: string; paper: string } | null>(null);
  const [active, setActive] = useState(false);

  // Mount the veil hidden, so it's already drawn when the first hover lands.
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const id = window.setTimeout(
      () => setColors({ ink: token("--color-ink-3"), paper: token("--color-paper") }),
      1500,
    );
    return () => window.clearTimeout(id);
  }, []);

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
        <pre
          className={cn(
            "type-ascii-lg text-ink-3 transition-opacity duration-500 ease-out-strong",
            active ? "opacity-0" : "opacity-30",
          )}
        >
          {asciiDragon}
        </pre>
        {colors && (
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-500 ease-out-strong",
              active ? "opacity-100" : "opacity-0",
            )}
          >
            <DitherVeil
              src={COLOR_SRC}
              fit="cover"
              intro={false}
              pattern="floyd"
              pixelSize={2}
              inkColor={colors.ink}
              paperColor={colors.paper}
              contrast={1.3}
              brightness={-0.08}
              revealRadius={150}
              softness={0.6}
              linger={1.4}
              clickBurst={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
