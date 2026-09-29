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
| `rounded-oval`      | 50%                          | Avatar (an ellipse, not a pill)  |
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

**ASCII dragon** (`components/ascii-dragon.tsx` + `dragon-corner.tsx` + `dragon-peek.tsx`). A layer of
decorative ASCII art behind the content: every piece is `aria-hidden`,
`pointer-events-none`, `select-none`, `text-ink-3`, and sits at z-0 (under the z-10
content, so cards and text pass over it). Nothing in it moves with the scroll. The art is
generated from `scripts/dragon-source.png`: `scripts/ascii-art.mjs` writes
`components/ascii-dragon-art.ts` (the full dragon, 64 × 71 glyphs) and
`components/ascii-dragon-head-art.ts` (a crop of its head). Each file records the command that made it. Glyph sizes are `type-ascii-*`
utilities (JetBrains Mono, line-height 1, `white-space: pre`); a glyph is 0.6em wide.

- **Corner dragon** (`components/dragon-corner.tsx`): `fixed right-6 bottom-6 origin-bottom-right -rotate-3` — the full dragon in the
  bottom-right corner, entirely on-screen and slightly tilted, `mix-blend-multiply`. Its frame is the
  corner ASCII art in `type-ascii-lg` (7px, md 10px → 269 × 497 / 384 × 710), rendered `invisible`;
  what shows is a React Bits DitherVeil (`components/dither-veil.tsx`, no intro animation) filling
  it — the colour Chinese dragon (`public/assets/dragon-color.png`, from `scripts/dragon-color.mjs`)
  as Floyd–Steinberg dots in `ink-3` on `paper`, at `opacity-25`. The veil stays at `opacity-0`
  until it has drawn its first frame with the image (its opaque canvas is a flat ink box before
  that), then fades in (500ms `ease-out-strong`). Hover (hover-capable pointers only): the dots
  go to full opacity (500ms `ease-out-strong`) and a 150px full-colour window follows the cursor,
  knitting back into dots over 1.4s. Below md it is at 30% of that opacity (`max-md:opacity-30`), full size, so it stays a quiet
  backdrop on phones.
- **Embers**: 18 ASCII sparks (`. ' * + ,`) in a `fixed inset-0 overflow-hidden` layer,
  two thirds spread over x 55–98% (near the corner dragon), the rest 2–42%; positions
  and timings come from a seeded PRNG so server and client agree. `type-ascii-md`, scaled
  1.1–2.2×.
- **Peek**: the head crop (36 × 17), appended to each `project-card` link (made
  `relative`) after hydration: `absolute top-0 right-[12%] -z-10`, `type-ascii-sm`. The
  negative z-index paints it under the card's tray, so the tray's top edge hides the neck
  until it rises (§6).

**Dashed separator** (`<Separator />`): 1px tall, `hairline` color, masked
`repeating-linear-gradient(90deg,#000 0 8px,transparent 8px 16px)`, wrapped in `md:px-4`.

**Hero columns** (≥ md): left `w-[203px]`, gap `165px`, right `w-[352px]`
(16 + 203 + 165 + 352 = 736 → aligns with grid line pairs). Experience rows use their
own split: details `w-[475px]` on the left (16 → 491 line), `gap-4` (the 491/507 pair),
dates `flex-1 text-right` in 507 → 736.

Vertical rhythm (px):

| Gap                               | Mobile | ≥ md |
| --------------------------------- | ------ | ---- |
| Page top → hero name              | 72     | 128  |
| Hero → #education                 | 40     | 48   |
| Between featured projects         | 48     | 96   |
| Media card → its meta row         | 24     | 32   |
| #education → #experience          | 40     | 48   |
| #experience → #work               | 64     | 72   |
| Last section → footer separator   | 200    | 200  |
| Footer bottom padding             | 154    | 48   |

## 5. Components

### Hero (`#about`)
- **Left column** (`flex-col gap-3`)
  - Name + role are wrapped in `group relative w-fit` so hovering either reveals the avatar.
  - **Avatar** (`data-testid="hero-avatar"`, `aria-hidden`), **desktop only — never on
    mobile**: grayscale photo in an oval — `rounded-oval border-3 border-surface shadow-card`,
    `w-[107px] h-[88px]`. Absolutely positioned `bottom-full left-0 mb-1.5`,
    `origin-bottom-left`, hidden until the name/role block is hovered. Pre-baked grayscale
    webp at 3× (`public/assets/avatar-desktop.webp`).
  - Name — `h1.type-heading-lg.text-ink` `data-testid="hero-name"`
  - Role — `p.type-label.text-ink-3` `min-h-[20px] md:min-h-[18px] whitespace-nowrap`,
    typed out character by character with a blinking `|` caret. `data-testid="hero-role"`
  - (md only) directly under the role: "based in" `type-label-light` + city `type-label` in `ink-3`
- **Right column** (`md:w-[352px] flex-col gap-6 md:gap-3`); columns are top-aligned (`md:items-start`)
  - (md only) Nav pills: `type-cta rounded-pill px-4 py-3 bg-glass backdrop-blur-lg text-ink`,
    `gap-2`. Each `data-testid="nav-pill"`.
  - (mobile only) CTA row `flex gap-3`: primary pill `bg-ink text-canvas`, secondary
    pills (Projects, Resume) `bg-surface-2 text-ink`; wraps if narrow. `data-testid="mobile-cta"`.

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
- Each row (`data-testid="experience-row"`): `flex flex-col gap-2 py-5
  md:flex-row-reverse md:gap-4 md:px-4 md:py-6`
  - Dates (first in DOM; right column on desktop, `md:flex-1 md:text-right`,
    label above the role on mobile): `type-label text-ink-3`, e.g. "2023 — 2024"
  - Details (left column on desktop, `md:w-[475px] shrink-0`): logo tile + `flex-col gap-1`:
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

### Side nav (Branched Menu) — desktop ≥ 1280px only
A port of React Bits' *Branched Menu*: a vertical rail, a trunk per section, curved
branches to each child, and an ink line that draws along the branch to the active child.
It is a scroll-spy table of contents.

- **Placement:** `fixed top-1/2 -translate-y-1/2 z-30 hidden xl:block`, fixed width
  `w-[176px]`, `left-[max(16px,calc(50%-656px))]` — its right edge sits 104px left of the 752px frame
  once the viewport is ≥1312px wide; below that it clamps to 16px from the screen edge. Fixed width so
  folding a section never shifts the trunk.
- **Sections** (page order, all open by default): **Education**
  ([Ontario Tech emblem 16px] Ontario Tech) · **Experience** (PVX Plus, MPAC, Nventure, Windsurf (Codeium),
  Rubicon) · **Projects** (RateMyOrg, MultiPost, AskDocAI, Geass, GoatApp).
  Labels come from `content/site.ts` (`projects[].name`, `experience[].navLabel ?? company`,
  `sideNav.*`). Children link to `#project-<id>`, `#experience-<id>`, `#education-<id>`.
- **Look (tokens only):** rail/trunk/branches `stroke`; idle labels `ink-3`; active child
  label, its drawn line and the rail marker `ink`. Section heads `type-label`; children
  `type-body-sm`. Row 32px, indent 40, trunk 14, branch radius 10, line 1.5px.
- **Behavior:** scroll-spy picks the last anchor whose top is above 35% of the viewport
  (nothing is active over the hero; at the page bottom the last item wins). Clicking a child/leaf smooth-scrolls to it (instant
  under reduced motion), updates the hash with `replaceState`, and sets it active
  immediately — scroll-spy is paused until the scroll ends so the line doesn't flicker
  through the items in between. Heads fold/unfold their section.
- **Motion:** accent line draws 400ms `ease-out-strong`; fold 300ms `ease-out-strong`;
  marker glides 220ms. Entrance: fades in + `translateX(-8px)→0`, 500ms `ease-out-strong`,
  600ms delay (after the hero). Reduced motion: no draw, fold or entrance.
- **Semantics:** `<nav aria-label="Sections">`; children and leaf are `<a href>`; heads are
  `<button aria-expanded>`; active item has `aria-current="location"`.
- Every scroll target has `scroll-mt-24` so it doesn't land under the top fade.

### Logo tile
`size-10 shrink-0 rounded-window bg-paper border-[0.5px] border-stroke shadow-card`,
emblem centered: square logos at 24px, wide wordmarks (MPAC) scaled to fit 28 × 24.
Experience rows always show one (right column is `flex items-start gap-4`: tile, then
title/company/summary); a role with no `logo` gets its company initial in `type-label
ink-3` so the text column stays aligned. Logos live in `public/assets/logos/`.

### Education row
Identical to an experience row: **logo tile**, degree as `h3.type-heading-sm` (`ink`), and the
school beneath it as a linked `type-label text-ink-3` (like a company name).
Education is its own `<section id="education">` (headed "Education"), rendered
after `#work`. Page order: Hero → Experience → Projects → Education → Footer.

### Icons
Inline SVG only (no icon library). Stroke/fill `currentColor`, `aria-hidden`.
Arrow-up-right is 24×24.

## 6. Motion

Principles (Emil Kowalski): animate only when it has a purpose; ease-out for things
entering; custom curves, never `ease-in`; only `transform`, `opacity`, `clip-path`;
everything off under `prefers-reduced-motion`. Named exceptions: the hero name glare
animates `background-position` (paint-only, no layout) because a text-clipped gradient
can't be moved any other way. Continuous travel (glare, embers) is
`linear` — constant speed, not an entrance.

| Token                 | Value                              |
| --------------------- | ---------------------------------- |
| `ease-out-strong`     | `cubic-bezier(0.23, 1, 0.32, 1)`   |
| `ease-in-out-strong`  | `cubic-bezier(0.77, 0, 0.175, 1)`  |
| `ease-standard`       | `cubic-bezier(0.4, 0, 0.2, 1)`     |

| Moment | What | Timing |
| --- | --- | --- |
| Hover (name) | Avatar: `opacity 0→1`, `translateY 8px→0`, `scale 0.94→1` from bottom-left (desktop only) | 800ms `ease-standard` — matches the reference; decorative, so slow is fine |
| Ambient | Name **glare** (`motion-safe:shine` on a span inside `hero-name`): 140° gradient `ink → ink-3 → ink` clipped to the text, `background-size: 200%`, `background-position 150% → -50%` | 5s `linear`, loops, 4s delay (after the hero intro) — matches the reference |
| Ambient | **Embers** rise from below the viewport to 80vh up, drifting ±60px, `opacity 0 → 0.6 → 0 `; each glyph also sways `translateX ±5px` | 11–20s `linear`, looping, negative delays; sway 2.8s `ease-in-out-strong` alternate; not shown under reduced motion |
| Hover | **Peek**: the dragon head rises `translateY 0 → -66%` from behind the card's tray (hover-capable pointers only, via `group-hover`) | 500ms `ease-out-strong`; instant under reduced motion |
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
| `hero-name`, `hero-role`, `hero-avatar` | 1 |
| `nav-pill` | 3 visible on desktop, hidden on mobile |
| `mobile-cta` | visible on mobile only |
| `project-card` | = `projects.length` |
| `experience-row` | = `experience.length + education.length` |
| `footer-link` | 4 |
| `section#education` | 1 |
| `side-nav` | visible on desktop ≥ 1280px, hidden on mobile |
| `side-nav-item` | = projects + experience + education |
