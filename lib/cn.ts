export type ClassValue = string | number | null | undefined | false;

/** Tiny className joiner — no dependencies. Falsy values are dropped. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
