# Design System — sanjaydeoram.com

A quiet, typographic, single-page portfolio. Near-white canvas, soft-black ink, one
hot accent used exactly once. Layout sits on a visible dashed column grid. Motion is
rare, fast, and purposeful.

Reference: https://adityamuralidhar.in — this site is a 1:1 structural replication of
that design language, carrying Sanjay's content.

> **Rule zero:** never write a raw hex, px font-size, or font-family in a component.
> Use the tokens and `type-*` utilities below. Arbitrary values are allowed **only**
> for the layout constants listed in §4, and must match them exactly.

---

## 1. Color tokens

Defined in `app/globals.css` under Tailwind v4 `@theme` → available as
`bg-*`, `text-*`, `border-*`, `from-*`, etc.

| Token            | Value        | Use                                                        |
| ---------------- | ------------ | ---------------------------------------------------------- |
| `canvas`         | `#fafafa`    | Page background. Top fade gradient start.                  |
| `paper`          | `#ffffff`    | Inner media card (the white "sheet" holding a screenshot). |
| `surface`        | `#f5f5f5`    | Outer media card tray. Icon buttons.                       |
| `surface-2`      | `#ebebeb`    | Secondary pill button (mobile). `::selection` background.  |
| `hairline`       | `#ebebeb`    | Dashed grid lines + dashed separators. Never solid.        |
| `stroke`         | `#d9d9d9`    | 0.5px border on inner media cards only.                    |
| `ink`            | `#262626`    | Primary text, headings, primary pill bg, focus outline.    |
| `ink-2`          | `#4d4d4d`    | Body copy / descriptions.                                  |
| `ink-3`          | `#737373`    | Labels, metadata, dates, icons, copyright.                 |
| `accent`         | `#ed3f1c`    | **Only** the hero text-reveal block. Nowhere else.         |
| `glass`          | `#b0aaaa1a`  | Desktop nav pill background (with `backdrop-blur-lg`).     |

Contrast: `ink` on `canvas` 14.9:1, `ink-2` 8.6:1, `ink-3` 4.6:1 (AA for body — keep
`ink-3` for labels/meta only, never long paragraphs).

No dark mode (the reference has none). Tokens are semantic so one can be added later by
redefining them under `@media (prefers-color-scheme: dark)`.

## 2. Typography

Three families, loaded with `next/font/google` and exposed as CSS vars:

| Token          | Family              | Role                                     |
| -------------- | ------------------- | ---------------------------------------- |
| `font-heading` | Stack Sans Headline | Name, headlines, card titles, pill text  |
| `font-sans`    | Figtree             | Body copy (the `body` default)           |
| `font-mono`    | JetBrains Mono      | UPPERCASE labels, dates, footer links    |

Type is applied **only** through these composite utilities (`@utility` in
`globals.css`). Mobile-first; the `md` column applies at ≥ 768px.

| Utility            | Family  | Weight | Mobile size / line | ≥ md size / line | Tracking | Case      |
| ------------------ | ------- | ------ | ------------------ | ---------------- | -------- | --------- |
| `type-heading-lg`  | heading | 500    | 22 / 28            | 26 / 30          | -0.02em  | —         |
| `type-heading-sm`  | heading | 400    | 18 / 28            | 20 / 26          | -0.02em  | —         |
| `type-body`        | sans    | 400    | 16 / 26            | 18 / 30          | -0.02em  | —         |
| `type-body-sm`     | sans    | 400    | 14 / 22            | 14 / 22          | -0.02em  | —         |
| `type-label`       | mono    | 500    | 15 / 20            | 14 / 18 (-0.02em)| 0        | UPPERCASE |
| `type-label-light` | mono    | 200    | 14 / 18            | 14 / 18          | 0        | UPPERCASE |
| `type-cta`         | heading | 300    | 14 / 12            | 14 / 12          | 0        | —         |

`body` defaults: `font-sans`, `type-body` metrics, `text-ink`, `bg-canvas`,
`-webkit-font-smoothing: antialiased`, `text-rendering: optimizeLegibility`.
`::selection { color: ink; background: surface-2 }`.

Copy voice: lowercase labels are fine (they render uppercase). Headlines are sentence
case, short, no trailing period on card titles. Use `&` in the hero line, "and" in
running text.

## 3. Shape, depth, spacing

| Token (Tailwind)    | Value                        | Use                             |
| ------------------- | ---------------------------- | ------------------------------- |
| `rounded-pill`      | 36px                         | Pills, icon buttons             |
| `rounded-tray`      | 36px (md: use `rounded-tray-lg` 48px) | Outer media tray        |
| `rounded-sheet`     | 30px (md: `rounded-sheet-lg` 42px)    | Inner media sheet       |
| `rounded-window`    | 12px                         | Screenshot "window" inside sheet |
| `rounded-phone`     | 20px                         | Portrait phone capture inside sheet |
| `shadow-card`       | `0 1px 12px 0 #00000012`     | Inner media sheet + screenshot window |

Spacing uses Tailwind's default 4px scale. No other shadows, no gradients except the
top fade, no solid borders except the 0.5px `stroke` on sheets/windows.

## 4. Layout constants (the grid)

The page is a single centered **frame**:

- Mobile: `w-[min(100%,390px)] px-6` (content 342px max)
- ≥ md: `w-frame` (752px) `px-0`; sections add `md:px-4` → 720px content

**Backdrop grid** (fixed, `pointer-events-none`, `aria-hidden`, z-0): vertical 1px
lines, dashed 8px on / 8px off, color `hairline`:
`bg-[repeating-linear-gradient(to_bottom,var(--color-hairline)_0_8px,transparent_8px_16px)]`

- Mobile container 342px wide, lines at x = 0, 77, 89, 165, 177, 254, 266, 342
- ≥ md container 752px wide, lines at x = 0, 16, 123, 139, 245, 261, 368, 384, 491, 507, 613, 629, 736, 752

**Top fade**: `fixed inset-x-0 top-0 h-14 z-20 bg-gradient-to-b from-canvas to-transparent pointer-events-none`.

**Dashed separator** (`<Separator />`): 1px tall, `hairline` color, masked
`repeating-linear-gradient(90deg,#000 0 8px,transparent 8px 16px)`, wrapped in `md:px-4`.

**Hero columns** (≥ md): left `w-[203px]`, gap `165px`, right `w-[352px]`
(16 + 203 + 165 + 352 = 736 → aligns with grid line pairs). Experience rows reuse the
exact same columns so dates and roles sit on the same verticals as the hero.

Vertical rhythm (px):

| Gap                               | Mobile | ≥ md |
| --------------------------------- | ------ | ---- |
| Page top → hero name              | 216    | 200  |
| Hero → #work                      | 88     | 204  |
| Between featured projects         | 48     | 96   |
| Media card → its meta row         | 24     | 32   |
| #work → #experience               | 120    | 204  |
| Last section → footer separator   | 200    | 200  |
| Footer bottom padding             | 154    | 48   |

## 5. Components

### Hero (`#about`)
- **Left column** (`flex-col gap-3 md:gap-[106px]`)
  - Name — `h1.type-heading-lg.text-ink` `data-testid="hero-name"`
  - Role — `p.type-label.text-ink-3` `min-h-[20px] md:min-h-[18px] whitespace-nowrap`,
    typed out character by character with a blinking `|` caret. `data-testid="hero-role"`
  - (md only) "based in" `type-label-light` + city `type-label` in `ink-3`
- **Right column** (`md:w-[352px] flex-col gap-6 md:gap-3`)
  - (md only) Nav pills: `type-cta rounded-pill px-4 py-3 bg-glass backdrop-blur-lg text-ink`,
    `gap-2`. Each `data-testid="nav-pill"`.
  - Statement — desktop `type-heading-lg` with explicit `<br/>` line breaks; mobile
    `type-heading-sm` single paragraph that opens with "Currently at **MPAC**" (company
    in `ink-3`). Both wrapped in `<TextReveal>`. `data-testid="hero-statement"` on the
    visible one per breakpoint.
  - (md only) Sub-label: `type-label text-ink-3` "currently at <a underline underline-offset-2>mpac</a>"
  - (mobile only) CTA row `flex gap-3`: primary pill `bg-ink text-canvas`, secondary
    pill `bg-surface-2 text-ink`. `data-testid="mobile-cta"`.

### Media card (projects)
Outer **tray** `bg-surface p-3 md:p-4 rounded-tray md:rounded-tray-lg` → inner **sheet**
`relative overflow-hidden bg-paper border-[0.5px] border-stroke shadow-card rounded-sheet md:rounded-sheet-lg`.

Heights: featured sheet `h-[320px] md:h-[488px]`; other-project sheet `h-[240px] md:h-[256px]`
(tray adds its padding, landing at ~288).

Screenshots are dark landscape app captures, so they use the **peek composition**: the
image is a "window" (`rounded-window border-[0.5px] border-stroke shadow-card
overflow-hidden`) absolutely positioned at `top-8 left-8 md:top-12 md:left-12`, width
`w-[190%] md:w-[130%]` (featured) / `w-[160%] md:w-[130%]` (other), height auto. It bleeds
off the right and bottom edges of the sheet, so the app's top-left corner is the focal
point. Never letterbox, never stretch.

Portrait phone captures (`image.frame: "phone"` in content) use the **phone composition**
instead: `rounded-phone`, `w-[168px] md:w-[180px]`, horizontally centered at
`top-8 md:top-10`, bleeding off the bottom, scaling from `origin-top` on hover. Crop
phone screenshots to the device screen before adding them — never ship a phone
sitting in a wide white canvas.

Meta row under featured card (`md:px-4`):
- `p.type-label.text-ink-3` — project name
- `h2.type-heading-lg.text-ink.whitespace-pre-line` — what it is (`w-[240px] md:w-[352px]`)
- md: description `type-body text-ink-2 w-[304px]` beside the title; mobile: below it
- Arrow-up-right icon `size-6 text-ink-3`, top-right
- `<Separator />` closes each featured card

Whole card is one `<a>` (`group`), opens GitHub in a new tab.
`data-testid="project-card"`.

"Other projects": `type-label text-ink-3` heading, then `flex-col gap-12 md:flex-row md:gap-4`
of two cards with title (`type-heading-lg`) + description (`type-body text-ink-2`)
beside the arrow. Separator after the row.

### Experience (`#experience`)
- Heading `p.type-label.text-ink-3 md:px-4` "Experience"
- Each row (`data-testid="experience-row"`): `flex flex-col gap-2 py-8
  md:flex-row md:gap-[165px] md:px-4 md:py-10`
  - Left (`md:w-[203px] shrink-0`): dates, `type-label text-ink-3`, e.g. "2023 — 2024"
  - Right (`md:w-[352px] flex-col gap-1`):
    - Role `h3.type-heading-sm.text-ink`
    - Company `p.type-label.text-ink-3` (linked with `underline underline-offset-2` when a URL exists)
    - Summary `p.type-body-sm.text-ink-2 mt-2`
  - `<Separator />` between rows (not after the last)
- Then a second group with heading "Education", same row anatomy.

### Footer
`flex-col gap-6 pt-[200px] pb-[154px] md:pb-12` → `<Separator />` → row
(`md:flex-row md:items-center md:justify-between md:px-4`):
- md: `type-label text-ink-3` "©{year} Sanjay Deoram | All rights reserved"
- links `flex gap-4`, each `type-label text-ink underline-offset-4 hover:underline`,
  `data-testid="footer-link"`: **email** (a `<button>` that copies the address; label
  crossfades to "copied" for 1.6s), LinkedIn, GitHub, YouTube
- mobile: copyright stacked on two lines at `text-[12px] leading-[14px]`
- last line: `type-label text-ink-3 text-[12px] leading-[14px] md:text-[14px] md:leading-[18px]`
  "Built with Next.js & Claude"

### Icons
Inline SVG only (no icon library). Stroke/fill `currentColor`, `aria-hidden`.
Arrow-up-right is 24×24.

## 6. Motion

Principles (Emil Kowalski): animate only when it has a purpose; ease-out for things
entering; custom curves, never `ease-in`; only `transform`, `opacity`, `clip-path`;
everything off under `prefers-reduced-motion`.

| Token                 | Value                              |
| --------------------- | ---------------------------------- |
| `ease-out-strong`     | `cubic-bezier(0.23, 1, 0.32, 1)`   |
| `ease-in-out-strong`  | `cubic-bezier(0.77, 0, 0.175, 1)`  |
| `ease-standard`       | `cubic-bezier(0.4, 0, 0.2, 1)`     |

| Moment | What | Timing |
| --- | --- | --- |
| Load (once) | Hero left/right blocks fade up: `opacity 0→1`, `translateY 8px→0` | 500ms `ease-out-strong`, 80ms stagger |
| Load (once) | Role types out, then caret blinks (`step-end`, 1s) | 400ms delay, 45ms/char |
| Load (once) | Nav pills slide out from behind the first pill (pill *i* starts translated left by the summed width+gap of pills before it; z-index decreases left→right) | 550ms `ease-out-strong`, 250ms delay |
| Load (once) | Statement **block reveal**: an `accent` block covers each line, then wipes left→right exposing the text | 400ms delay, 700ms `ease-in-out-strong` |
| Hover | Card image `scale 1 → 1.05` | 800ms `ease-standard` (slow on purpose — decorative) |
| Hover | Arrow icon nudges `translate(2px,-2px)` | 200ms `ease-out-strong` |
| Hover | Pill bg `glass → surface-2` | 200ms `ease` (color) |
| Press | Pills & buttons `scale(0.97)` | 160ms `ease-out-strong` |
| Copy email | label crossfade with `blur(2px)` bridge | 200ms `ease` |

**Block reveal implementation:** render the real text normally; overlay an
`aria-hidden` duplicate absolutely on top (`inset-0`) whose inner span has
`color: transparent; background: var(--color-accent); box-decoration-break: clone`.
Animate the overlay's `clip-path` from `inset(0 0 0 0)` to `inset(0 0 0 100%)`.
The real text is never hidden from assistive tech, and with reduced motion the
overlay is simply not rendered.

Hover effects must only apply on hover-capable pointers (Tailwind v4 `hover:` already
does this). No scroll-jacking / smooth-scroll libraries. `scroll-behavior: smooth` on
`html` only when `prefers-reduced-motion: no-preference`.

## 7. Accessibility

- Every interactive element: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`.
- External links: `target="_blank" rel="noopener noreferrer"`.
- Images: meaningful `alt` (project name + "screenshot").
- One `h1` (name). Card titles `h2`, experience roles `h3`.
- Tap targets ≥ 40px tall on mobile (pills are 38–42px: `py-3` + 14px text; fine).

## 8. Testing contract

These `data-testid`s and ids are a contract between components and `tests/ui.spec.ts`.
Don't rename without updating the tests.

| Selector | Count |
| --- | --- |
| `section#about`, `section#work`, `section#experience`, `footer` | 1 each |
| `hero-name`, `hero-role` | 1 |
| `hero-statement` | 1 visible per viewport |
| `nav-pill` | 3 visible on desktop, hidden on mobile |
| `mobile-cta` | visible on mobile only |
| `project-card` | = `projects.length` |
| `experience-row` | = `experience.length + education.length` |
| `footer-link` | 4 |
