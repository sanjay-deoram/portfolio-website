import { projects } from "@/content/site";
import { ArrowUpRight } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { MediaCard } from "@/components/work/media-card";
import { cn } from "@/lib/cn";

// Shared hover-nudge treatment for the arrow icon (DESIGN.md §6).
const ARROW =
  "size-6 shrink-0 text-ink-3 transition-transform duration-200 ease-out-strong group-hover:-translate-y-0.5 group-hover:translate-x-0.5";

// Accessible name: the pre-line title alone can read oddly with the forced
// line break, so combine it with the project name and flatten the break.
function accessibleName(name: string, title: string) {
  return `${name}: ${title.replace(/\n/g, " ")}`;
}

export function Work() {
  const featured = projects.filter((project) => project.featured);
  const other = projects.filter((project) => !project.featured);

  return (
    <section id="projects" className="mt-[64px] flex scroll-mt-24 flex-col gap-12 md:mt-[72px] md:gap-24">
      {featured.map((project) => (
        <a
          key={project.id}
          id={`project-${project.id}`}
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={accessibleName(project.name, project.title)}
          data-testid="project-card"
          className="group flex w-full scroll-mt-24 flex-col gap-6 rounded-tray focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:gap-8 md:rounded-tray-lg"
        >
          <MediaCard project={project} variant="featured" />
          <div className="flex items-start justify-between gap-4 px-0 md:flex-col md:gap-3 md:px-4">
            <div className="flex min-w-0 flex-1 flex-col gap-2 md:gap-3">
              <p className="type-label text-ink-3">{project.name}</p>
              <div className="flex gap-4">
                <h2 className="type-heading-lg w-[240px] whitespace-pre-line text-ink md:w-[352px]">
                  {project.title}
                </h2>
                <div className="hidden flex-1 items-start justify-between gap-6 md:flex">
                  <p className="type-body w-[304px] text-ink-2">{project.description}</p>
                  <ArrowUpRight className={ARROW} />
                </div>
              </div>
              <p className="type-body text-ink-2 md:hidden">{project.description}</p>
            </div>
            <ArrowUpRight className={cn(ARROW, "md:hidden")} />
          </div>
          <Separator />
        </a>
      ))}

      {other.length > 0 && (
        <section aria-label="Other projects" className="flex flex-col gap-6">
          <p className="type-label px-0 text-ink-3 md:px-4">Other projects</p>
          <div className="flex flex-col gap-12 md:flex-row md:gap-4">
            {other.map((project) => (
              <a
                key={project.id}
                id={`project-${project.id}`}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={accessibleName(project.name, project.title)}
                data-testid="project-card"
                className="group flex min-w-0 flex-1 scroll-mt-24 flex-col gap-6 rounded-tray focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <MediaCard project={project} variant="other" />
                <div className="flex items-start justify-between gap-4 px-0 md:px-4">
                  <div className="flex min-w-0 flex-col gap-2">
                    <p className="type-label text-ink-3">{project.name}</p>
                    <h2 className="type-heading-lg whitespace-pre-line text-ink">{project.title}</h2>
                    <p className="type-body text-ink-2">{project.description}</p>
                  </div>
                  <ArrowUpRight className={ARROW} />
                </div>
              </a>
            ))}
          </div>
          <Separator />
        </section>
      )}
    </section>
  );
}
