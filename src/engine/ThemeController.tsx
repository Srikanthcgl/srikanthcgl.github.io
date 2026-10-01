import { useEffect } from "react";
import { blendPalette, envPosition, envState, rgba } from "./environments";
import type { EnvId, RGBA } from "./environments";

type Listener = (active: number, order: EnvId[]) => void;
const listeners = new Set<Listener>();
let lastActive = -1;

/** Subscribe to discrete environment changes (which section's environment is dominant). */
export function subscribeEnv(cb: Listener): () => void {
  listeners.add(cb);
  if (lastActive >= 0) cb(lastActive, envState.order);
  return () => { listeners.delete(cb); };
}

const ch = (c: RGBA) => `${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0}`;

/**
 * Reads every `[data-env]` section in document order and, on scroll, interpolates the palette
 * between neighbouring environments. Results are written as CSS custom properties on <html>
 * (only when they change) and mirrored into `envState` for the canvases.
 */
export function ThemeController() {
  useEffect(() => {
    const root = document.documentElement;
    let tops: number[] = [];
    let raf = 0;
    let lastF = -1;

    const measure = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-env]"));
      envState.order = els.map(el => el.dataset.env as EnvId);
      tops = els.map(el => el.getBoundingClientRect().top + window.scrollY);
      lastF = -1;
      update();
    };

    const update = () => {
      raf = 0;
      if (!tops.length) return;
      const vh = window.innerHeight;
      const f = envPosition(tops, window.scrollY + vh * 0.5, vh * 0.3);
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      root.style.setProperty("--page-progress", (window.scrollY / max).toFixed(4));
      if (Math.abs(f - lastF) < 0.0008) return;
      lastF = f;

      const p = blendPalette(f, envState.order);
      envState.f = f;
      envState.palette = p;
      for (const k of Object.keys(envState.weight) as EnvId[]) envState.weight[k] = 0;
      const i = Math.min(Math.floor(f), envState.order.length - 1);
      const t = f - i;
      envState.weight[envState.order[i]] += 1 - t;
      if (envState.order[i + 1]) envState.weight[envState.order[i + 1]] += t;

      const s = root.style;
      s.setProperty("--bg", rgba(p.bg));
      s.setProperty("--surface", rgba(p.surface));
      s.setProperty("--text", rgba(p.text));
      s.setProperty("--muted", rgba(p.muted));
      s.setProperty("--line", rgba(p.line));
      s.setProperty("--accent", rgba(p.accent));
      s.setProperty("--accent-2", rgba(p.accent2));
      s.setProperty("--on-accent", rgba(p.onAccent));
      s.setProperty("--accent-rgb", ch(p.accent));
      s.setProperty("--accent2-rgb", ch(p.accent2));
      s.setProperty("--text-rgb", ch(p.text));
      s.setProperty("--bg-rgb", ch(p.bg));

      const active = Math.round(f);
      if (active !== lastActive) {
        lastActive = active;
        root.dataset.env = envState.order[active];
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", rgba(p.bg));
        listeners.forEach(cb => cb(active, envState.order));
      }
    };

    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(document.body);
    document.fonts?.ready.then(measure);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return null;
}
