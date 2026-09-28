import { Heart } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { site, socials } from "@/content/site";
import { CopyEmail } from "@/components/footer/copy-email";

const linkClasses =
  "type-label text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

/** `<footer>` — DESIGN.md §5. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex flex-col gap-6 px-0 pt-[200px] pb-[154px] md:pb-12">
      <Separator />
      <div className="flex flex-col gap-4 px-0 md:flex-row md:items-center md:justify-between md:px-4">
        <p className="hidden type-label text-ink-3 md:block">
          ©{year} {site.name} | All rights reserved
        </p>

        <div className="flex gap-4">
          <CopyEmail email={site.email} className={linkClasses} />
          {socials.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-link"
              className={linkClasses}
            >
              {social.label}
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

      <p className="flex items-center gap-1 px-0 text-ink-3 md:px-4">
        <Heart />
        <span className="type-label text-[12px] leading-[14px] md:text-[14px] md:leading-[18px]">
          Built with Next.js &amp; Claude
        </span>
      </p>
    </footer>
  );
}
