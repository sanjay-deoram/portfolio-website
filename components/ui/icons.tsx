type IconProps = {
  className?: string;
};

/** 24×24 stroke arrow, used on project cards and inline links. */
export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

/** 14×14 filled heart, used in the footer's "built with" line. */
export function Heart({ className }: IconProps) {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 21s-6.716-4.35-9.428-8.06C.29 9.87 1.07 6.02 4.2 4.62 6.62 3.52 9 4.4 12 7.2c3-2.8 5.38-3.68 7.8-2.58 3.13 1.4 3.91 5.25 1.63 8.32C18.716 16.65 12 21 12 21z" />
    </svg>
  );
}
