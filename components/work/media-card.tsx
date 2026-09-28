import Image from "next/image";

import type { Project } from "@/content/site";
import { cn } from "@/lib/cn";

type MediaCardVariant = "featured" | "other";

type MediaCardProps = {
  project: Project;
  variant: MediaCardVariant;
  /** First featured image loads eagerly; everything else is lazy. */
  priority?: boolean;
};

// DESIGN.md §5 — sheet height per variant.
const SHEET_HEIGHT: Record<MediaCardVariant, string> = {
  featured: "h-[320px] md:h-[488px]",
  other: "h-[240px] md:h-[256px]",
};

// The screenshot must bleed past the sheet's right AND bottom edges (the "peek
// composition"). Our captures are ~2:1, so these widths are tuned so the
// rendered height always overshoots the sheet: featured mobile 190% of ~318px
// → ~604×304 (+32 top > 320), featured desktop 130% of ~720px → ~936×470
// (+48 top > 488), other desktop 130% of ~336px (Geass 1.35:1 → ~324 tall).
const WINDOW_WIDTH: Record<MediaCardVariant, string> = {
  featured: "w-[190%] md:w-[130%]",
  other: "w-[160%] md:w-[130%]",
};

const SIZES: Record<MediaCardVariant, string> = {
  featured: "(min-width: 768px) 940px, 610px",
  other: "(min-width: 768px) 440px, 510px",
};

// Portrait phone captures: centered, fixed width, bleeding off the bottom.
const PHONE_FRAME =
  "top-8 left-1/2 w-[168px] -translate-x-1/2 origin-top rounded-phone md:top-10 md:w-[180px]";
const PHONE_SIZES = "180px";

/**
 * Outer tray → inner sheet → absolutely-positioned "window" holding the
 * screenshot. Our project captures are dark landscape app screenshots (not
 * phone mockups like the reference site), so instead of letterboxing them we
 * peek: the window is wider than the sheet and anchored top-left, cropping
 * into the image's focal corner. Never stretched, never letterboxed.
 */
export function MediaCard({ project, variant, priority }: MediaCardProps) {
  const isFeatured = variant === "featured";
  const isPhone = project.image.frame === "phone";

  return (
    <div
      className={cn(
        "flex w-full overflow-hidden bg-surface p-3 md:p-4",
        isFeatured ? "rounded-tray md:rounded-tray-lg" : "rounded-tray",
      )}
    >
      <div
        className={cn(
          "relative min-w-0 flex-1 overflow-hidden border-[0.5px] border-stroke bg-paper shadow-card",
          isFeatured ? "rounded-sheet md:rounded-sheet-lg" : "rounded-sheet",
          SHEET_HEIGHT[variant],
        )}
      >
        <div
          className={cn(
            "absolute overflow-hidden border-[0.5px] border-stroke shadow-card transition-transform duration-[800ms] ease-standard motion-reduce:transition-none",
            "group-hover:scale-105",
            isPhone
              ? PHONE_FRAME
              : cn("top-8 left-8 origin-top-left rounded-window md:top-12 md:left-12", WINDOW_WIDTH[variant]),
          )}
        >
          <Image
            src={project.image.src}
            alt={`${project.name} screenshot`}
            width={project.image.width}
            height={project.image.height}
            priority={priority}
            loading={priority ? undefined : "lazy"}
            sizes={isPhone ? PHONE_SIZES : SIZES[variant]}
            className="block h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
}
