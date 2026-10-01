import { useEffect, useRef } from "react";
import { cursorEffectsEnabled, pointer, trackPointer } from "./pointer";

interface Magnet { el: HTMLElement; x: number; y: number; strength: number }

/**
 * Desktop-only cursor system:
 *  • a soft "field" of light that follows the pointer (not a custom cursor — the real one stays),
 *  • magnetic elements: anything with `data-magnetic` (optionally `data-magnetic="0.2"`) drifts toward
 *    the pointer while it is near. Uses the CSS `translate` property so element transforms are untouched.
 * The loop only runs while the pointer is moving, then settles and stops.
 */
export function CursorField() {
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cursorEffectsEnabled()) return;
    trackPointer();
    const el = glow.current;
    let magnets: Magnet[] = [];
    let raf = 0, gx = pointer.x, gy = pointer.y, idle = 0;

    const collect = () => {
      magnets = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]")).map(m => ({
        el: m, x: 0, y: 0, strength: parseFloat(m.dataset.magnetic || "") || 0.3,
      }));
    };

    const tick = () => {
      raf = 0;
      const tx = pointer.active ? pointer.x : gx, ty = pointer.active ? pointer.y : gy;
      gx += (tx - gx) * 0.18; gy += (ty - gy) * 0.18;
      if (el) {
        el.style.transform = `translate3d(${gx - 260}px, ${gy - 260}px, 0)`;
        el.style.opacity = pointer.active ? "1" : "0";
      }

      // Read all rects first, then write — avoids layout thrashing.
      const rects = magnets.map(m => m.el.getBoundingClientRect());
      let moving = Math.abs(tx - gx) > 0.5 || Math.abs(ty - gy) > 0.5;
      magnets.forEach((m, i) => {
        const r = rects[i];
        const pad = 40;
        const inside = pointer.active && r.bottom > 0 && r.top < innerHeight &&
          pointer.x > r.left - pad && pointer.x < r.right + pad && pointer.y > r.top - pad && pointer.y < r.bottom + pad;
        const max = Math.min(14, Math.max(4, Math.min(r.width, r.height) * 0.12));
        const wantX = inside ? Math.max(-max, Math.min(max, (pointer.x - (r.left + r.width / 2)) * m.strength)) : 0;
        const wantY = inside ? Math.max(-max, Math.min(max, (pointer.y - (r.top + r.height / 2)) * m.strength)) : 0;
        m.x += (wantX - m.x) * 0.2; m.y += (wantY - m.y) * 0.2;
        if (Math.abs(wantX - m.x) > 0.1 || Math.abs(wantY - m.y) > 0.1) moving = true;
        m.el.style.translate = `${m.x.toFixed(2)}px ${m.y.toFixed(2)}px`;
      });

      idle = moving ? 0 : idle + 1;
      if (idle < 20) raf = requestAnimationFrame(tick);
    };

    const wake = () => { idle = 0; if (!raf) raf = requestAnimationFrame(tick); };
    collect();
    const t = window.setTimeout(collect, 1500);
    window.addEventListener("pointermove", wake, { passive: true });
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", collect);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", collect);
      magnets.forEach(m => { m.el.style.translate = ""; });
    };
  }, []);

  return <div ref={glow} className="cursor-field" aria-hidden="true" />;
}
