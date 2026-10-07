import { Separator } from "@/components/ui/separator";
import { site, socials } from "@/content/site";
import { CopyEmail } from "@/components/footer/copy-email";
import { Glyph } from "@/components/ui/icons";

// Logo links: ink-3 at rest, ink on hover (color, 200ms ease), scale(0.97) on
// press (160ms ease-out-strong). p-1/-m-1 grows the hit area without moving the row.
const iconLinkClasses =
  "-m-1 rounded-sm p-1 text-ink-3 transition-[color,scale] duration-200 ease hover:text-ink active:scale-97 active:duration-160 active:ease-out-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

/** `<footer>` — DESIGN.md §5. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex flex-col gap-6 px-0 pt-16 pb-[154px] md:pt-24 md:pb-12">
      <Separator />
      <div className="flex flex-col gap-4 px-0 md:flex-row md:items-center md:justify-between md:px-4">
        <p className="hidden type-label text-ink-3 md:block">
          ©{year} {site.name} | All rights reserved
        </p>

        <div className="flex items-center gap-4">
          <CopyEmail email={site.email} className={iconLinkClasses} />
          {socials.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              data-testid="footer-link"
              className={iconLinkClasses}
            >
              <Glyph name={social.icon} className="size-4.5" />
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-1 md:hidden">
          <p className="type-label text-[12px] leading-[14px] text-ink-3">
            ©{year} {site.name}
          </p>
          <p className="type-label text-[12px] leading-[14px] text-ink-3">All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
