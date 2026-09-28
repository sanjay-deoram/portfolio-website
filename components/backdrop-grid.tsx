const MOBILE_LINES = [0, 77, 89, 165, 177, 254, 266, 342];
const DESKTOP_LINES = [0, 16, 123, 139, 245, 261, 368, 384, 491, 507, 613, 629, 736, 752];

const lineClass =
  "absolute inset-y-0 w-px bg-[repeating-linear-gradient(to_bottom,var(--color-hairline)_0_8px,transparent_8px_16px)]";

/**
 * Fixed dashed column grid behind the page content. DESIGN.md §4.
 * Purely decorative — hidden from assistive tech and never intercepts clicks.
 */
export function BackdropGrid() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div className="relative mx-auto h-full w-[342px] md:hidden">
        {MOBILE_LINES.map((x) => (
          <div key={x} className={lineClass} style={{ left: x }} />
        ))}
      </div>
      <div className="relative mx-auto hidden h-full w-frame md:block">
        {DESKTOP_LINES.map((x) => (
          <div key={x} className={lineClass} style={{ left: x }} />
        ))}
      </div>
    </div>
  );
}
