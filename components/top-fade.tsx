/** Fixed top fade over the canvas so content scrolls under the viewport edge. DESIGN.md §4. */
export function TopFade() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-20 h-14 bg-gradient-to-b from-canvas to-transparent"
    />
  );
}
