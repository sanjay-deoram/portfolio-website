"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Glyph } from "@/components/ui/icons";

type CopyEmailProps = {
  email: string;
  className?: string;
};

const RESET_DELAY_MS = 1600;

/**
 * Footer email logo (DESIGN.md §5/§6). Copies the address to the clipboard
 * and crossfades the envelope to a check for 1.6s. The two glyphs are stacked
 * in one grid cell so the swap never shifts layout; opacity + scale + a
 * `blur(2px)` bridge (200ms ease) smooths it.
 */
export function CopyEmail({ email, className }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleClick() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        window.location.href = `mailto:${email}`;
        return;
      }
    } catch {
      window.location.href = `mailto:${email}`;
      return;
    }

    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), RESET_DELAY_MS);
  }

  return (
    <button
      type="button"
      data-testid="footer-link"
      aria-label="Copy email address"
      onClick={handleClick}
      className={cn("grid [&>*]:[grid-area:1/1]", copied && "text-ink", className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "transition-[opacity,filter,scale] duration-200 ease",
          copied ? "scale-75 opacity-0 blur-[2px]" : "scale-100 opacity-100 blur-none",
        )}
      >
        <Glyph name="email" className="size-4.5" />
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "transition-[opacity,filter,scale] duration-200 ease",
          copied ? "scale-100 opacity-100 blur-none" : "scale-75 opacity-0 blur-[2px]",
        )}
      >
        <Glyph name="check" className="size-4.5" />
      </span>
      <span aria-live="polite" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
    </button>
  );
}
