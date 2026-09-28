import Image from "next/image";
import type { ReactNode } from "react";
import { education, experience, type Logo, type Role } from "@/content/site";
import { Separator } from "@/components/ui/separator";

const linkClasses =
  "underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

function CompanyLink({ role, className }: { role: Role; className: string }) {
  if (!role.companyUrl) return <span className={className}>{role.company}</span>;

  return (
    <a
      href={role.companyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} ${linkClasses}`}
    >
      {role.company}
    </a>
  );
}

// Same 203 / 165 / 352 column split as the hero (DESIGN.md §4) so dates and
// role titles sit on the same verticals as the hero's left/right columns.
function Row({ id, dates, isLast, children }: { id: string; dates: string; isLast: boolean; children: ReactNode }) {
  return (
    <li id={id} data-testid="experience-row" className="scroll-mt-24">
      <div className="flex flex-col gap-2 py-8 md:flex-row md:gap-[165px] md:px-4 md:py-10">
        <p className="type-label shrink-0 text-ink-3 md:w-[203px]">{dates}</p>
        <div className="md:w-[352px]">{children}</div>
      </div>
      {isLast ? null : <Separator />}
    </li>
  );
}

// DESIGN.md §5 "Logo tile": square emblems render at 24px; wide wordmarks
// scale down to fit a 28 × 24 box so they stay legible. Without a logo, the
// company's initial keeps the text column aligned with its neighbours.
function LogoTile({ logo, fallback }: { logo?: Logo; fallback: string }) {
  const scale = logo ? Math.min(28 / logo.width, 24 / logo.height) : 0;
  return (
    <div
      aria-hidden="true"
      className="flex size-10 shrink-0 items-center justify-center rounded-window border-[0.5px] border-stroke bg-paper shadow-card"
    >
      {logo ? (
        <Image src={logo.src} alt="" width={Math.round(logo.width * scale)} height={Math.round(logo.height * scale)} />
      ) : (
        <span className="type-label text-ink-3">{fallback.charAt(0)}</span>
      )}
    </div>
  );
}

function RoleDetails({ role }: { role: Role }) {
  return (
    <div className="flex items-start gap-4">
      <LogoTile logo={role.logo} fallback={role.company} />
      <div className="flex flex-col gap-1">
        <h3 className="type-heading-sm text-ink">{role.title}</h3>
        <CompanyLink role={role} className="type-label w-fit text-ink-3 underline-offset-2" />
        {role.summary ? <p className="type-body-sm mt-2 text-ink-2">{role.summary}</p> : null}
      </div>
    </div>
  );
}

// DESIGN.md §5 "Education row": logo tile + "Degree · School" on one heading.
function EducationDetails({ role }: { role: Role }) {
  return (
    <div className="flex items-start gap-4">
      {role.logo ? <LogoTile logo={role.logo} fallback={role.company} /> : null}
      <h3 className="type-heading-sm text-balance text-ink">
        {/* nbsp keeps the dot on the degree's line when the heading wraps */}
        {role.title}
        <span className="text-ink-3">{"\u00a0·"}</span>{" "}
        <CompanyLink role={role} className="text-ink-3 decoration-stroke underline-offset-4" />
      </h3>
    </div>
  );
}

// Experience follows the hero directly (hero → first section rhythm: 88 / 204).
export function Experience() {
  return (
    <section id="experience" className="mt-[88px] flex scroll-mt-24 flex-col gap-6 md:mt-[204px]">
      <p className="type-label text-ink-3 md:px-4">Experience</p>
      <ol className="flex flex-col">
        {experience.map((role, index) => (
          <Row key={role.id} id={`experience-${role.id}`} dates={role.dates} isLast={index === experience.length - 1}>
            <RoleDetails role={role} />
          </Row>
        ))}
      </ol>
    </section>
  );
}

// Education follows the projects.
export function Education() {
  return (
    <section id="education" className="mt-[120px] flex scroll-mt-24 flex-col gap-6 md:mt-[204px]">
      <p className="type-label text-ink-3 md:px-4">Education</p>
      <ol className="flex flex-col">
        {education.map((role, index) => (
          <Row key={role.id} id={`education-${role.id}`} dates={role.dates} isLast={index === education.length - 1}>
            <EducationDetails role={role} />
          </Row>
        ))}
      </ol>
    </section>
  );
}
