"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type TextRevealProps = {
  className?: string;
  children: ReactNode;
  "data-testid"?: string;
};

const REVEAL_DELAY_MS = 400;
const REVEAL_DURATION_MS = 700;
const REVEAL_EASING = "cubic-bezier(0.77, 0, 0.175, 1)";

/**
 * DESIGN.md §6 "Block reveal implementation". The real text renders
 * normally (and carries `data-testid`); an `aria-hidden` overlay duplicates
 * it behind an accent-colored block (`box-decoration-break: clone` gives
 * each wrapped line its own block) and wipes away left-to-right via WAAPI
 * `clip-path`. Reduced motion never renders the overlay. A CSS fallback
 * animation fades the overlay out for the no-JS case; `motion-reduce:hidden`
 * removes it immediately when the OS prefers reduced motion, even before JS runs.
 */
export function TextReveal({ className, children, ...rest }: TextRevealProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  // Rendered on the server too, so first paint shows the covering block.
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      // Defer so this is a callback reacting to the media query, not a
      // synchronous setState at the top of the effect body.
      let cancelled = false;
      queueMicrotask(() => {
        if (!cancelled) setShowOverlay(false);
      });
      return () => {
        cancelled = true;
      };
    }

    const el = overlayRef.current;
    if (!el) return;

    const animation = el.animate(
      [{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(0 0 0 100%)" }],
      {
        duration: REVEAL_DURATION_MS,
        delay: REVEAL_DELAY_MS,
        easing: REVEAL_EASING,
        fill: "forwards",
      },
    );

    let cancelled = false;
    animation.finished
      .then(() => {
        if (!cancelled) setShowOverlay(false);
      })
      .catch(() => {
        // Cancelled (e.g. unmount) — nothing to do.
      });

    return () => {
      cancelled = true;
      animation.cancel();
    };
  }, []);

  return (
    <div className="relative">
      <p className={className} {...rest}>
        {children}
      </p>
      {showOverlay && (
        <div
          ref={overlayRef}
          aria-hidden="true"
          data-reveal-overlay=""
          className="pointer-events-none absolute inset-0 motion-reduce:hidden [animation:hero-reveal-fallback_2s_ease-out_forwards]"
        >
          <style>{`
            @keyframes hero-reveal-fallback {
              0%, 80% { opacity: 1; }
              100% { opacity: 0; }
            }
          `}</style>
          <p className={cn(className, "[&_*]:text-transparent!")}>
            <span className="bg-accent text-transparent [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
              {children}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
