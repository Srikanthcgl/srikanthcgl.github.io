import { useEffect } from "react";
import type { RefObject } from "react";
import { onVisible } from "./useMedia";

/**
 * Calls `cb(p)` with how far an element has travelled through the viewport (0 = its top just reached
 * `start` of the viewport height, 1 = its bottom reached `end`). rAF-throttled, only while visible.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, cb: (p: number) => void, start = 0.85, end = 0.55): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0, visible = false;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const from = vh * start, to = vh * end;
      const total = r.height + (from - to);
      cb(Math.min(1, Math.max(0, (from - r.top) / total)));
    };
    const schedule = () => { if (visible && !raf) raf = requestAnimationFrame(update); };
    const stop = onVisible(el, v => { visible = v; if (v) schedule(); }, "0px");
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(raf); stop(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
    // cb is expected to be stable (refs / setState); re-binding on every render is unnecessary.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, start, end]);
}
