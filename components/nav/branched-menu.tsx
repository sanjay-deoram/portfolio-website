"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

// Port of React Bits' Branched Menu (reactbits.dev), adapted to this site:
// TypeScript, controlled `active`, links instead of buttons, tokens instead of
// hex (styles live in app/globals.css under "Branched menu"), no icon library.

export type BranchedMenuChild = { value: string; label: string; href: string; icon?: ReactNode };
export type BranchedMenuSection = { label: string; children: BranchedMenuChild[] };

type BranchedMenuProps = {
  items: BranchedMenuSection[];
  /** Controlled active child value ("" = none). */
  active: string;
  onSelect?: (value: string, event: MouseEvent<HTMLAnchorElement>) => void;
  /** Section index (or indices) open at first. Defaults to all. */
  defaultOpen?: number | number[];
  rowHeight?: number;
  indent?: number;
  trunk?: number;
  radius?: number;
  lineWidth?: number;
  ariaLabel: string;
  className?: string;
  style?: CSSProperties;
};

const PAD = 6;
const MARK = 16;

export function BranchedMenu({
  items,
  active,
  onSelect,
  defaultOpen,
  rowHeight = 32,
  indent = 40,
  trunk = 14,
  radius = 10,
  lineWidth = 1.5,
  ariaLabel,
  className,
  style,
}: BranchedMenuProps) {
  const [open, setOpen] = useState(() => {
    if (defaultOpen === undefined) return new Set(items.map((_, i) => i));
    return new Set(Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen]);
  });
  const navRef = useRef<HTMLElement>(null);
  const heads = useRef<(HTMLButtonElement | null)[]>([]);
  const markerRef = useRef<HTMLSpanElement>(null);

  const activeSection = items.findIndex((section) => section.children.some((child) => child.value === active));
  const markerShown = activeSection >= 0 && open.has(activeSection);

  // Rail marker glides to the head of the section holding the active child.
  // Layout changes (fold/unfold, resize) re-place it without the glide.
  useLayoutEffect(() => {
    const place = (glide: boolean) => {
      const marker = markerRef.current;
      const head = heads.current[activeSection];
      if (!marker) return;
      const on = Boolean(markerShown && head);
      if (!glide) marker.style.transition = "none";
      if (on && head) marker.style.top = `${head.offsetTop + (head.offsetHeight - MARK) / 2}px`;
      marker.toggleAttribute("data-on", on);
      if (!glide) {
        void marker.offsetHeight;
        marker.style.transition = "";
      }
    };
    place(true);
    let first = true;
    const observer = new ResizeObserver(() => {
      if (first) {
        first = false;
        return;
      }
      place(false);
    });
    if (navRef.current) observer.observe(navRef.current);
    return () => observer.disconnect();
  }, [activeSection, markerShown, items, rowHeight]);

  const toggle = (index: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const r = Math.min(radius, rowHeight / 2 - 2);
  const endX = indent - 8;
  const rowY = (k: number) => PAD + k * rowHeight + rowHeight / 2;
  const branch = (k: number) => `M ${trunk} ${rowY(k) - r} A ${r} ${r} 0 0 0 ${trunk + r} ${rowY(k)} H ${endX}`;
  const reach = (k: number) => `M ${trunk} 0 V ${rowY(k) - r} A ${r} ${r} 0 0 0 ${trunk + r} ${rowY(k)} H ${endX}`;
  const length = (k: number) => rowY(k) - r + (Math.PI * r) / 2 + (endX - trunk - r);

  return (
    <nav
      ref={navRef}
      aria-label={ariaLabel}
      className={cn("branched-menu", className)}
      style={
        {
          ...style,
          "--bm-row": `${rowHeight}px`,
          "--bm-indent": `${indent}px`,
          "--bm-line-w": lineWidth,
        } as CSSProperties
      }
    >
      <span ref={markerRef} className="branched-menu__marker" aria-hidden="true" />
      {items.map((section, i) => {
        const isOpen = open.has(i);
        const bodyHeight = PAD * 2 + section.children.length * rowHeight;
        return (
          <div
            key={section.label}
            className="branched-menu__section"
            data-open={isOpen ? "" : undefined}
            data-current={i === activeSection ? "" : undefined}
          >
            <button
              ref={(el) => {
                heads.current[i] = el;
              }}
              type="button"
              className="branched-menu__head"
              aria-expanded={isOpen}
              onClick={() => toggle(i)}
            >
              {section.label}
            </button>
            <div className="branched-menu__body" aria-hidden={isOpen ? undefined : true}>
              <div className="branched-menu__fold">
                <div className="branched-menu__tree" style={{ height: bodyHeight }}>
                  <svg className="branched-menu__lines" width={indent} height={bodyHeight} aria-hidden="true">
                    <path className="branched-menu__base" d={`M ${trunk} 0 V ${rowY(section.children.length - 1) - r}`} />
                    {section.children.map((child, k) => (
                      <path key={child.value} className="branched-menu__base" d={branch(k)} />
                    ))}
                    {section.children.map((child, k) => (
                      <path
                        key={child.value}
                        className="branched-menu__reach"
                        d={reach(k)}
                        style={{ strokeDasharray: length(k), strokeDashoffset: child.value === active ? 0 : length(k) }}
                      />
                    ))}
                  </svg>
                  {section.children.map((child) => {
                    const isActive = child.value === active;
                    return (
                      <a
                        key={child.value}
                        href={child.href}
                        data-testid="side-nav-item"
                        className="branched-menu__item"
                        aria-current={isActive ? "location" : undefined}
                        data-active={isActive ? "" : undefined}
                        tabIndex={isOpen ? undefined : -1}
                        onClick={(event) => onSelect?.(child.value, event)}
                      >
                        {child.icon ? (
                          <span className="branched-menu__icon" aria-hidden="true">
                            {child.icon}
                          </span>
                        ) : null}
                        <span className="branched-menu__label">{child.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
