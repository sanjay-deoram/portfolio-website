"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { education, experience, projects, sideNav } from "@/content/site";
import { BranchedMenu, type BranchedMenuSection } from "@/components/nav/branched-menu";

// Page order, so scroll-spy moves the line top to bottom (DESIGN.md §5 "Side nav").
const sections: BranchedMenuSection[] = [
  {
    label: sideNav.experienceLabel,
    children: experience.map((r) => ({ value: `experience-${r.id}`, label: r.navLabel ?? r.company, href: `#experience-${r.id}` })),
  },
  {
    label: sideNav.projectsLabel,
    children: projects.map((p) => ({ value: `project-${p.id}`, label: p.name, href: `#project-${p.id}` })),
  },
  {
    label: sideNav.educationLabel,
    children: education.map((r) => ({
      value: `education-${r.id}`,
      label: sideNav.educationShort,
      href: `#education-${r.id}`,
      icon: r.logo ? <Image src={r.logo.src} alt="" width={16} height={16} /> : undefined,
    })),
  },
];

const targetIds = sections.flatMap((section) => section.children.map((child) => child.value));

// A target becomes active once its top passes this line.
const SPY_LINE = 0.35;

function currentTarget(): string {
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  let current = "";
  for (const id of targetIds) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (atBottom || el.getBoundingClientRect().top <= window.innerHeight * SPY_LINE) current = id;
  }
  return current;
}

/** Fixed scroll-spy table of contents, left of the frame. Desktop ≥ 1280px only. */
export function SideNav() {
  const [active, setActive] = useState("");
  // While a click-triggered smooth scroll runs, scroll-spy would sweep the
  // line through every item in between — so it's paused until scrolling ends.
  const paused = useRef(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!paused.current) setActive(currentTarget());
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const select = (value: string, event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(value);
    if (!target) return;
    event.preventDefault();

    setActive(value);
    paused.current = true;
    const resume = () => {
      paused.current = false;
      window.removeEventListener("scrollend", resume);
      clearTimeout(fallback);
    };
    const fallback = setTimeout(resume, 1000);
    window.addEventListener("scrollend", resume);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${value}`);
  };

  return (
    <div
      data-testid="side-nav"
      className="fixed top-1/2 left-[max(16px,calc(50%-656px))] z-30 hidden w-[176px] -translate-y-1/2 motion-safe:animate-nav-in xl:block"
    >
      <BranchedMenu items={sections} active={active} onSelect={select} ariaLabel="Sections" />
    </div>
  );
}
