"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

type CopyEmailProps = {
  email: string;
  className?: string;
};

const RESET_DELAY_MS = 1600;

/**
 * Footer "email" link (DESIGN.md §5/§6). Copies the address to the
 * clipboard and crossfades the label to "copied" for 1.6s. The two labels
 * are stacked in one grid cell so the crossfade never shifts layout width;
 * opacity + a `blur(2px)` bridge (200ms ease) smooths the swap.
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
      className={cn("grid [&>*]:[grid-area:1/1]", className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "transition-[opacity,filter] duration-200 ease",
          copied ? "opacity-0 blur-[2px]" : "opacity-100 blur-none",
        )}
      >
        email
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "transition-[opacity,filter] duration-200 ease",
          copied ? "opacity-100 blur-none" : "opacity-0 blur-[2px]",
        )}
      >
        copied
      </span>
      <span aria-live="polite" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
    </button>
  );
}
