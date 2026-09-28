import { cn } from "@/lib/cn";

type SeparatorProps = {
  className?: string;
};

/**
 * Dashed 1px rule used between cards, rows and sections. DESIGN.md §4.
 * The outer element carries `md:px-4` so the visible line insets to match
 * the 720px content column on desktop; the inner element paints the dashes.
 */
export function Separator({ className }: SeparatorProps) {
  return (
    <div className={cn("md:px-4", className)} role="separator">
      <div
        aria-hidden="true"
        className="h-px w-full bg-hairline [mask-image:repeating-linear-gradient(90deg,#000_0_8px,transparent_8px_16px)] [-webkit-mask-image:repeating-linear-gradient(90deg,#000_0_8px,transparent_8px_16px)]"
      />
    </div>
  );
}
