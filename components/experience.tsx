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

// Role details on the left (475px, ending on the x = 491 grid line), dates flush
// right in the 507 → 736 column (DESIGN.md §4). Dates come first in the DOM so
// they read (and stack on mobile) as a label above the role.
function Row({ id, dates, isLast, children }: { id: string; dates: string; isLast: boolean; children: ReactNode }) {
  return (
    <li id={id} data-testid="experience-row" className="scroll-mt-24">
      <div className="flex flex-col gap-2 py-5 md:flex-row-reverse md:gap-4 md:px-4 md:py-6">
        <p className="type-label text-ink-3 md:flex-1 md:text-right">{dates}</p>
        <div className="shrink-0 md:w-[475px]">{children}</div>
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
        <h3 className="type-heading-sm text-ink">
          {role.title} <span className="text-ink-3">@</span>{" "}
          <CompanyLink role={role} className="underline-offset-2" />
        </h3>
        {role.summary ? <p className="type-body-sm text-ink-2">{role.summary}</p> : null}
      </div>
    </div>
  );
}

// Sections stack at 88 (mobile) / 64 (≥ md).
export function Experience() {
  return (
    <section id="experience" className="mt-[40px] flex scroll-mt-24 flex-col gap-2 md:mt-[48px]">
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

export function Education() {
  return (
    <section id="education" className="mt-[40px] flex scroll-mt-24 flex-col gap-2 md:mt-[48px]">
      <p className="type-label text-ink-3 md:px-4">Education</p>
      <ol className="flex flex-col">
        {education.map((role, index) => (
          <Row key={role.id} id={`education-${role.id}`} dates={role.dates} isLast={index === education.length - 1}>
            <RoleDetails role={role} />
          </Row>
        ))}
      </ol>
    </section>
  );
}
