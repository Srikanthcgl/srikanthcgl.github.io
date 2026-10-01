/**
 * One shared pointer state for every interactive layer (cursor glow, magnetic elements, canvases).
 * Cursor effects only run on devices with a fine pointer that can hover, and never with reduced motion.
 */
export const pointer = { x: -9999, y: -9999, active: false, sx: -9999, sy: -9999 };

export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const hasFinePointer = (): boolean =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export const cursorEffectsEnabled = (): boolean => hasFinePointer() && !prefersReducedMotion();

let listening = false;
/** Starts the single passive pointer listener (idempotent). `sx/sy` are smoothed by consumers. */
export function trackPointer(): void {
  if (listening || typeof window === "undefined") return;
  listening = true;
  window.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true;
  }, { passive: true });
  document.addEventListener("pointerleave", () => { pointer.active = false; });
  window.addEventListener("blur", () => { pointer.active = false; });
}
