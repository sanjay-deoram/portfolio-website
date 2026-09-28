import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type PillVariant = "glass" | "primary" | "secondary";

const variantClasses: Record<PillVariant, string> = {
  // Desktop nav pill.
  glass: "bg-glass text-ink backdrop-blur-lg hover:bg-surface-2",
  primary: "bg-ink text-canvas",
  secondary: "bg-surface-2 text-ink",
};

const baseClasses = cn(
  "type-cta inline-flex items-center justify-center rounded-pill px-4 py-3",
  "transition-[background-color,scale] duration-200 ease-standard",
  "active:scale-[0.97] active:duration-[160ms] active:ease-out-strong",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
);

type PillLinkProps = {
  href: string;
  external?: boolean;
  variant?: PillVariant;
  className?: string;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;

type PillButtonProps = {
  href?: undefined;
  variant?: PillVariant;
  className?: string;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export type PillProps = PillLinkProps | PillButtonProps;

function isLinkProps(props: PillProps): props is PillLinkProps {
  return typeof props.href === "string";
}

/**
 * DESIGN.md §5 pill primitive. Renders an anchor when `href` is given
 * (a plain `<a>` for external links, `next/link` otherwise), a `<button>`
 * otherwise.
 */
export function Pill(props: PillProps) {
  const { variant = "primary", className, children } = props;
  const classes = cn(baseClasses, variantClasses[variant], className);

  if (isLinkProps(props)) {
    const { href, external, variant: _v, className: _c, children: _ch, ...anchorProps } = props;

    if (external) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...anchorProps}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const { variant: _v2, className: _c2, children: _ch2, href: _h, ...buttonProps } = props;

  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
