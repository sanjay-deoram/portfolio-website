"use client";

import { useLayoutEffect, useState } from "react";
import { cn } from "@/lib/cn";

type TypewriterProps = {
  text: string;
  className?: string;
};

const START_DELAY_MS = 400;
const CHAR_DELAY_MS = 45;

/**
 * Types `text` out character by character, then leaves a blinking caret.
 * DESIGN.md §5/§6 (hero role). SSR, no-JS and reduced-motion all render the
 * full text immediately — the typing animation is a progressive enhancement
 * that resets to empty and replays once JS confirms motion is allowed.
 * The full text is always present for assistive tech via an `sr-only` span;
 * the animated text is `aria-hidden` so it is never announced twice.
 */
export function Typewriter({ text, className }: TypewriterProps) {
  // Default state matches SSR / no-JS / reduced-motion: fully visible, no caret.
  const [visibleChars, setVisibleChars] = useState(text.length);
  const [animating, setAnimating] = useState(false);
  const [caretBlinking, setCaretBlinking] = useState(false);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | undefined;
    let startTimeout: ReturnType<typeof setTimeout> | undefined;

    // Defer the "arm" state (reset to empty, then start typing) into a
    // microtask so it's a reaction to the media-query read above, not a
    // synchronous setState at the top of the effect body.
    queueMicrotask(() => {
      if (cancelled) return;
      setAnimating(true);
      setVisibleChars(0);

      startTimeout = setTimeout(() => {
        let count = 0;
        interval = setInterval(() => {
          if (cancelled) return;
          count += 1;
          setVisibleChars(count);
          if (count >= text.length) {
            if (interval) clearInterval(interval);
            setCaretBlinking(true);
          }
        }, CHAR_DELAY_MS);
      }, START_DELAY_MS);
    });

    return () => {
      cancelled = true;
      if (startTimeout) clearTimeout(startTimeout);
      if (interval) clearInterval(interval);
    };
  }, [text]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={className}>
        {text.slice(0, visibleChars)}
        {animating && (
          <span className={cn(caretBlinking && "motion-safe:animate-caret-blink")}>|</span>
        )}
      </span>
    </>
  );
}
