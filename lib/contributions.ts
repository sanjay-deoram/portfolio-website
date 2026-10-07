// Shared by the server graph (components/github-graph.tsx) and the client grid
// (components/contribution-grid.tsx). Kept out of the "use client" module so the
// server gets real values, not client references.

export type Day = { date: string; level: number; count: number };

// Level 0 sits on the hairline grey; 1–4 step up through ink. Tokens only.
export const levelFill = ["fill-surface-2", "fill-ink/20", "fill-ink/45", "fill-ink/70", "fill-ink"];

export const CELL = 10;
export const STEP = 13; // cell + 3 gap
