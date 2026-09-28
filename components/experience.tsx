import { education, experience, type Role } from "@/content/site";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/cn";

// Same 203 / 165 / 352 column split as the hero (DESIGN.md §4) so dates and
// role titles sit on the same verticals as the hero's left/right columns.
function ExperienceRow({ role, isLast }: { role: Role; isLast: boolean }) {
  return (
    <li data-testid="experience-row">
      <div className="flex flex-col gap-2 py-8 md:flex-row md:gap-[165px] md:px-4 md:py-10">
        <p className="type-label shrink-0 text-ink-3 md:w-[203px]">{role.dates}</p>
        <div className="flex flex-col gap-1 md:w-[352px]">
          <h3 className="type-heading-sm text-ink">{role.title}</h3>
          {role.companyUrl ? (
            <a
              href={role.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="type-label w-fit text-ink-3 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {role.company}
            </a>
          ) : (
            <p className="type-label text-ink-3">{role.company}</p>
          )}
          {role.summary ? <p className="type-body-sm mt-2 text-ink-2">{role.summary}</p> : null}
        </div>
      </div>
      {isLast ? null : <Separator />}
    </li>
  );
}

function ExperienceGroup({ heading, roles, className }: { heading: string; roles: Role[]; className?: string }) {
  return (
    <>
      <p className={cn("type-label text-ink-3 md:px-4", className)}>{heading}</p>
      <ol className="m-0 flex list-none flex-col p-0">
        {roles.map((role, index) => (
          <ExperienceRow key={`${role.company}-${role.title}-${role.dates}`} role={role} isLast={index === roles.length - 1} />
        ))}
      </ol>
    </>
  );
}

export function Experience() {
  return (
    <section id="experience" className="mt-[120px] flex flex-col gap-6 md:mt-[204px]">
      <ExperienceGroup heading="Experience" roles={experience} />
      <ExperienceGroup heading="Education" roles={education} className="mt-12 md:mt-16" />
    </section>
  );
}
