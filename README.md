# sanjaydeoram.com

Sanjay Deoram's portfolio site — a quiet, typographic, single-page site built with
Next.js (App Router), TypeScript and Tailwind CSS v4.

See `DESIGN.md` for the design system and `CLAUDE.md` for the working rules.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                 | What it does                                  |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Local dev server                                |
| `npm run build`        | Production build                                |
| `npm run start`        | Serve the production build                      |
| `npm run lint`         | ESLint (flat config)                            |
| `npm run typecheck`    | `tsc --noEmit`                                  |
| `npm run test:ui`      | Playwright UI smoke tests (see below)           |
| `npm run test:ui:headed` | Same, with a visible browser                 |
| `npm run test:ui:report` | Open the last Playwright HTML report         |

## Verifying UI changes

This project uses Playwright as a screenshot/smoke harness, not a visual-diff tool:

```bash
npm run test:ui
```

Then look at `test-results/screens/desktop.png` and `test-results/screens/mobile.png` to
eyeball the result. The test also checks structure (sections, testids, image counts) —
see `DESIGN.md` §8 for the full contract.
