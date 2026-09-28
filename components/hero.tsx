import { Fragment } from "react";
import { nav, site } from "@/content/site";
import { Pill } from "@/components/ui/pill";
import { Typewriter } from "@/components/hero/typewriter";
import { TextReveal } from "@/components/hero/text-reveal";
import { NavPills } from "@/components/hero/nav-pills";

const linkClasses =
  "underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

/** `#about` — DESIGN.md §5. Server component; the interactive bits (typing
 * role, nav pill entrance, statement reveal) are isolated in `hero/`. */
export function Hero() {
  const [projectsLink, experienceLink] = nav;

  return (
    <section id="about" className="relative pt-[216px] md:pt-[200px]">
      <div className="flex flex-col gap-12 md:flex-row md:items-center md:gap-[165px] md:px-4">
        {/* Left column */}
        <div className="flex w-[172px] flex-col gap-3 motion-safe:animate-fade-up md:w-[203px] md:gap-[106px]">
          <div className="flex flex-col gap-1.5 md:gap-1">
            <h1 data-testid="hero-name" className="type-heading-lg text-ink">
              {site.name}
            </h1>
            <p
              data-testid="hero-role"
              className="type-label min-h-[20px] whitespace-nowrap text-ink-3 md:min-h-[18px]"
            >
              <Typewriter text={site.role} />
            </p>
          </div>
          <div className="hidden md:block">
            <p className="flex items-center gap-2 whitespace-nowrap text-ink-3">
              <span className="type-label-light">based in</span>
              <span className="type-label">{site.location}</span>
            </p>
          </div>
        </div>

        {/* Right column */}
        <div className="flex w-full flex-col gap-6 motion-safe:animate-fade-up [animation-delay:80ms] md:w-[352px] md:gap-3">
          <div className="hidden md:block">
            <NavPills />
          </div>

          <TextReveal
            data-testid="hero-statement"
            className="hidden type-heading-lg text-ink md:block"
          >
            {site.statementLines.map((line, index) => (
              <Fragment key={line}>
                {line}
                {index < site.statementLines.length - 1 && <br />}
              </Fragment>
            ))}
          </TextReveal>

          <TextReveal
            data-testid="hero-statement"
            className="type-heading-sm text-ink md:hidden"
          >
            {site.statementMobile.prefix}
            <span className="text-ink-3">{site.statementMobile.lead}</span>
            {site.statementMobile.rest}
          </TextReveal>

          <p className="hidden type-label text-ink-3 md:block">
            currently at{" "}
            <a
              href={site.current.url}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
            >
              {site.current.company}
            </a>
          </p>

          <div data-testid="mobile-cta" className="flex gap-3 md:hidden">
            <Pill variant="primary" href={projectsLink.href}>
              {projectsLink.label}
            </Pill>
            <Pill variant="secondary" href={experienceLink.href}>
              {experienceLink.label}
            </Pill>
          </div>
        </div>
      </div>
    </section>
  );
}
