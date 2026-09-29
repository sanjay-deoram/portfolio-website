import Image from "next/image";
import { nav, site } from "@/content/site";
import { Pill } from "@/components/ui/pill";
import { Typewriter } from "@/components/hero/typewriter";
import { NavPills } from "@/components/hero/nav-pills";

const linkClasses =
  "underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

/** `#about` — DESIGN.md §5. Server component; the interactive bits (typing
 * role, nav pill entrance) are isolated in `hero/`. */
export function Hero() {
  const [experienceLink, projectsLink, resumeLink] = nav;

  return (
    <section id="about" className="relative pt-[136px] md:pt-[128px]">
      <div className="flex flex-col gap-12 md:flex-row md:items-start md:gap-[165px] md:px-4">
        {/* Left column */}
        <div className="flex w-[172px] flex-col gap-3 motion-safe:animate-fade-up md:w-[203px] md:gap-3">
          <div className="group relative w-fit">
            <Avatar />
            <div className="flex flex-col gap-1.5 md:gap-1">
              <h1 data-testid="hero-name" className="type-heading-lg text-ink">
                <span className="motion-safe:shine">{site.name}</span>
              </h1>
              <p
                data-testid="hero-role"
                className="type-label min-h-[20px] whitespace-nowrap text-ink-3 md:min-h-[18px]"
              >
                <Typewriter text={site.role} />
              </p>
              <p className="hidden items-center gap-2 whitespace-nowrap text-ink-3 md:flex">
                <span className="type-label-light">based in</span>
                <span className="type-label">{site.location}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex w-full flex-col gap-6 motion-safe:animate-fade-up [animation-delay:80ms] md:w-[352px] md:gap-3">
          <div className="hidden md:block">
            <NavPills />
          </div>

          <div data-testid="mobile-cta" className="flex flex-wrap gap-3 md:hidden">
            <Pill variant="primary" href={experienceLink.href}>
              {experienceLink.label}
            </Pill>
            <Pill variant="secondary" href={projectsLink.href}>
              {projectsLink.label}
            </Pill>
            <Pill variant="secondary" href={resumeLink.href} external={resumeLink.external}>
              {resumeLink.label}
            </Pill>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Photo above the name, desktop only: hidden until the name/role block is
 * hovered, then rises, grows and fades in from its bottom-left corner
 * (DESIGN.md §6). Not rendered on mobile. Decorative — the name is the label. */
function Avatar() {
  const { desktop } = site.avatar;

  return (
    <div
      aria-hidden="true"
      data-testid="hero-avatar"
      className="pointer-events-none absolute bottom-full left-0 z-20 mb-1.5 hidden origin-bottom-left translate-y-2 scale-[0.94] opacity-0 transition-[opacity,translate,scale] duration-800 ease-standard group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 motion-reduce:transition-none md:block"
    >
      <div className="relative h-[88px] w-[107px] overflow-hidden rounded-oval border-3 border-surface shadow-card">
        <Image src={desktop.src} alt="" fill sizes="107px" className="object-cover" />
      </div>
    </div>
  );
}
