# CLAUDE.md

## What this is

Sanjay Deoram's portfolio: a quiet, typographic, single-page site (hero → work →
experience → footer) sitting on a visible dashed column grid. 1:1 structural
replication of https://adityamuralidhar.in, carrying Sanjay's content. No dark mode,
no CMS, no backend — a static Next.js app.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5.9 · Tailwind CSS v4
(`@tailwindcss/postcss`) · Playwright for UI smoke tests. ESLint 9 flat config via
`eslint-config-next`. See package.json for exact pinned versions — `typescript` and
`eslint` are intentionally held below their absolute-latest majors; see "Known
deviations" below.

## Commands

```bash
npm run dev            # local dev server
npm run build           # production build (also run before test:ui)
npm run lint             # eslint .
npm run typecheck      # tsc --noEmit
npm run test:ui         # Playwright smoke tests (builds + starts on :3100 first)
npm run test:ui:headed # same, headed browser
npm run test:ui:report # open the last HTML report
```

To verify a UI change: `npm run test:ui`, then look at
`test-results/screens/desktop.png` and `test-results/screens/mobile.png`. This is a
screenshot/smoke harness, not a pixel diff — read the assertions in `tests/ui.spec.ts`
and eyeball the screenshots.

## File map

```
app/
  layout.tsx        root layout, metadata, font variables on <html>
  page.tsx          section order: BackdropGrid, TopFade, Hero, Work, Experience, Footer
  fonts.ts          next/font/google loaders (Stack Sans Headline, Figtree, JetBrains Mono)
  globals.css       @theme tokens + type-* utilities + base layer (source of truth for CSS)
  icon.svg          favicon
components/
  hero.tsx, work.tsx, experience.tsx, footer.tsx   the four page sections
  backdrop-grid.tsx, top-fade.tsx                   fixed decorative layers
  ui/pill.tsx, ui/separator.tsx, ui/icons.tsx        shared primitives
content/
  site.ts           ALL copy + data (projects, experience, education, nav, socials)
lib/cn.ts           className joiner
tests/ui.spec.ts    Playwright smoke tests, driven by content/site.ts
DESIGN.md           the design system spec — authoritative
```

## Golden rules

1. **All copy lives in `content/site.ts`.** Never hardcode strings (names, dates,
   links, descriptions) in a component — import from `content/site.ts`.
2. **DESIGN.md is the source of truth.** No raw hex colors, px font-sizes, or
   font-family names in components — use the color/shape/motion tokens defined in
   `app/globals.css` and the `type-*` utilities. Arbitrary Tailwind values (`w-[…]`,
   `top-[…]`, etc.) are allowed **only** for the layout constants in DESIGN.md §4
   (grid line offsets, column widths, the frame width) — match them exactly.
3. **Motion**: only `transform`, `opacity`, `clip-path` — no layout-triggering
   properties. Use the custom easings (`ease-out-strong`, `ease-in-out-strong`,
   `ease-standard`), never `ease-in` for things entering. Everything must degrade
   under `prefers-reduced-motion` (see the global rule in `globals.css` and per-effect
   guards in components). Hover effects only where `hover:` naturally applies (no
   hover state simulated for touch).
4. **`data-testid` contract** (DESIGN.md §8) — don't rename without updating
   `tests/ui.spec.ts`: `hero-name`, `hero-role`, `hero-statement`, `nav-pill`,
   `mobile-cta`, `project-card`, `experience-row`, `footer-link`, plus the
   `#about` / `#work` / `#experience` section ids and `<footer>`.
5. **To verify UI**: `npm run test:ui`, then look at `test-results/screens/*.png`.

## Known deviations from "always latest"

- `typescript` is pinned to `5.9.3` (last pre-7.0 stable), not the `latest` tag
  (`7.0.2`, the new native/Go port). `typescript-eslint` (bundled inside
  `eslint-config-next`) hard-errors on TS 7 today (`typescript-eslint does not
  support TS 7.0`). Revisit once typescript-eslint ships support.
- `eslint` is pinned to `9.39.5` (the `maintenance` dist-tag), not `latest`
  (`10.11.0`). `eslint-plugin-react` (bundled inside `eslint-config-next@16.3.6`)
  throws on ESLint 10's new rule-context API (`contextOrFilename.getFilename is not
  a function`). Revisit once `eslint-config-next` bumps its bundled
  `eslint-plugin-react`.

## Gotchas

- next/font variables are `--font-stack-sans`, `--font-figtree`, `--font-jetbrains`
  (`app/fonts.ts`). The `@theme` tokens `--font-heading/sans/mono` point at them.
  Never give a next/font variable the same name as a theme token — it creates a
  self-referencing custom property and the fonts silently fall back.
- Project screenshots: landscape captures use `frame: "window"` (peek from top-left);
  portrait phone captures use `frame: "phone"` and must be cropped to the device first.
- If `next start` gets restarted after a rebuild, make sure the old `next-server`
  process is dead — a stale one serves HTML pointing at deleted CSS chunks (page
  renders unstyled).
