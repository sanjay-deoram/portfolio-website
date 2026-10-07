import { github } from "@/content/site";
import { ContributionGrid } from "@/components/contribution-grid";
import { CELL, STEP, levelFill, type Day } from "@/lib/contributions";

type Calendar = { total: number; weeks: (Day | null)[][] };

// GitHub's public contributions calendar (no token needed). Each day is a
// <td id="contribution-day-component-<weekday>-<week>" data-date data-level>,
// and its count lives in a sibling <tool-tip for="<that id>">.
async function getCalendar(): Promise<Calendar | null> {
  try {
    const res = await fetch(`https://github.com/users/${github.username}/contributions`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const counts = new Map<string, number>();
    for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>\s*(No|[\d,]+) contribution/g)) {
      counts.set(m[1], m[2] === "No" ? 0 : Number(m[2].replace(/,/g, "")));
    }

    const weeks: (Day | null)[][] = [];
    for (const m of html.matchAll(/<td[^>]*ContributionCalendar-day[^>]*>/g)) {
      const tag = m[0];
      const id = /id="(contribution-day-component-(\d+)-(\d+))"/.exec(tag);
      const date = /data-date="([^"]+)"/.exec(tag);
      const level = /data-level="(\d)"/.exec(tag);
      if (!id || !date || !level) continue;
      const [weekday, week] = [Number(id[2]), Number(id[3])];
      weeks[week] ??= Array(7).fill(null);
      weeks[week][weekday] = { date: date[1], level: Number(level[1]), count: counts.get(id[1]) ?? 0 };
    }
    if (weeks.length === 0) return null;

    const total = /([\d,]+)\s+contributions\s+in the last year/.exec(html);
    return {
      total: total ? Number(total[1].replace(/,/g, "")) : weeks.flat().reduce((n, d) => n + (d?.count ?? 0), 0),
      weeks: Array.from(weeks, (w) => w ?? Array(7).fill(null)),
    };
  } catch {
    return null;
  }
}

/** `#github` — contribution graph above the footer, drawn in DESIGN.md tokens. */
export async function GithubGraph() {
  const calendar = await getCalendar();
  if (!calendar) return null;

  const total = calendar.total.toLocaleString("en-US");

  return (
    <section id="github" aria-label={github.heading} className="mt-16 flex scroll-mt-24 flex-col gap-6 md:mt-24">
      <div className="flex items-baseline justify-between gap-4 md:px-4">
        <a
          href={github.href}
          target="_blank"
          rel="noopener noreferrer"
          className="type-label text-ink-3 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {github.heading}
        </a>
        <p className="type-label whitespace-nowrap text-ink-3">
          <span className="md:hidden">{github.totalShort.replace("{n}", total)}</span>
          <span className="hidden md:inline">{github.total.replace("{n}", total)}</span>
        </p>
      </div>

      <div className="md:px-4">
        {/* Mobile: the last half year, so cells stay legible at 342px. */}
        <ContributionGrid weeks={calendar.weeks.slice(-26)} className="md:hidden" />
        <ContributionGrid weeks={calendar.weeks} className="hidden md:block" />
      </div>

      <div className="flex items-center justify-end gap-2 md:px-4" aria-hidden="true">
        <span className="type-label text-ink-3">{github.less}</span>
        <svg viewBox={`0 0 ${5 * STEP - 3} ${CELL}`} className="h-2.5 w-auto">
          {levelFill.map((fill, i) => (
            <rect key={fill} x={i * STEP} y={0} width={CELL} height={CELL} rx={2} className={fill} />
          ))}
        </svg>
        <span className="type-label text-ink-3">{github.more}</span>
      </div>
    </section>
  );
}
