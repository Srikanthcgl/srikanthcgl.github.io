import { useEffect, useRef } from "react";
import { envById, envState, rgba } from "./environments";
import type { EnvId } from "./environments";
import { cursorEffectsEnabled, pointer, prefersReducedMotion } from "./pointer";

interface Frame { ctx: CanvasRenderingContext2D; w: number; h: number; t: number; dt: number; sy: number; px: number; py: number; a: number; small: boolean }
interface Layer { draw(f: Frame): void }

const TAU = Math.PI * 2;
const MONO = '500 10px "JetBrains Mono Variable", ui-monospace, monospace';
const rnd = (seed: number) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

/** HERO — slow drifting particles that part around the cursor. */
function coreLayer(w: number, h: number, small: boolean): Layer {
  const r = rnd(7);
  const ps = Array.from({ length: small ? 34 : 90 }, () => ({ x: r() * w, y: r() * h, vx: (r() - 0.5) * 6, vy: (r() - 0.5) * 6, z: 0.3 + r() * 0.7 }));
  const { accent2, text } = envById("core").palette;
  return {
    draw({ ctx, w, h, dt, sy, px, py, a }) {
      for (const p of ps) {
        const dx = p.x - px, dy = p.y - py, d2 = dx * dx + dy * dy;
        if (d2 < 140 * 140) { const d = Math.sqrt(d2) || 1; const f = (1 - d / 140) * 40; p.vx += (dx / d) * f * dt; p.vy += (dy / d) * f * dt; }
        p.vx *= 0.985; p.vy *= 0.985;
        p.x = (p.x + p.vx * dt + w) % w; p.y = (p.y + p.vy * dt + h) % h;
        const y = (((p.y - sy * 0.04 * p.z) % h) + h) % h;
        ctx.fillStyle = rgba(p.z > 0.7 ? accent2 : text, a * (0.18 + p.z * 0.35));
        ctx.fillRect(p.x, y, 1 + p.z, 1 + p.z);
      }
    },
  };
}

/** ABOUT — blueprint grid, dimension marks and a cursor crosshair with coordinates. */
function blueprintLayer(w: number, h: number): Layer {
  const r = rnd(21);
  const marks = Array.from({ length: 9 }, (_, i) => ({ x: r() * w, y: r() * h * 2, label: ["A-1", "Ø240", "R12", "B-3", "0.00", "I/O", "C-7", "Δt", "REV 2"][i], len: 60 + r() * 140 }));
  const { accent, line } = envById("blueprint").palette;
  return {
    draw({ ctx, w, h, sy, px, py, a }) {
      const off = -(sy * 0.25) % 120;
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba(line, a * 0.35);
      ctx.beginPath();
      for (let x = 0; x < w; x += 24) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); }
      for (let y = off % 24; y < h; y += 24) { ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); }
      ctx.stroke();
      ctx.strokeStyle = rgba(line, a * 0.8);
      ctx.beginPath();
      for (let x = 0; x < w; x += 120) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); }
      for (let y = off; y < h; y += 120) { ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); }
      ctx.stroke();

      ctx.font = MONO;
      ctx.fillStyle = rgba(accent, a * 0.45);
      ctx.strokeStyle = rgba(accent, a * 0.3);
      for (const m of marks) {
        const y = ((m.y - sy * 0.25) % (h * 2) + h * 2) % (h * 2) - h * 0.5;
        if (y < -20 || y > h + 20) continue;
        ctx.beginPath();
        ctx.moveTo(m.x, y); ctx.lineTo(m.x + m.len, y);
        ctx.moveTo(m.x, y - 4); ctx.lineTo(m.x, y + 4);
        ctx.moveTo(m.x + m.len, y - 4); ctx.lineTo(m.x + m.len, y + 4);
        ctx.stroke();
        ctx.fillText(m.label, m.x + m.len / 2 - 10, y - 6);
      }

      if (px > -999) {
        ctx.strokeStyle = rgba(accent, a * 0.14);
        ctx.setLineDash([3, 5]);
        ctx.beginPath(); ctx.moveTo(0, py + 0.5); ctx.lineTo(w, py + 0.5); ctx.moveTo(px + 0.5, 0); ctx.lineTo(px + 0.5, h); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = rgba(accent, a * 0.6);
        ctx.fillText(`X ${String(Math.round(px)).padStart(4, "0")}  Y ${String(Math.round(py + sy)).padStart(5, "0")}`, px + 10, py - 10);
      }
    },
  };
}

/** PROJECTS — horizontal signal traces with amber pulses; pulses brighten near the cursor. */
function industrialLayer(w: number, h: number, small: boolean): Layer {
  const r = rnd(5);
  const lanes = Array.from({ length: small ? 5 : 9 }, (_, i) => ({ y: (i + 0.5) * (h / (small ? 5 : 9)) + (r() - 0.5) * 30, speed: 60 + r() * 120, phase: r() * w, len: 50 + r() * 90 }));
  const { accent, line } = envById("industrial").palette;
  return {
    draw({ ctx, w, h, t, sy, px, py, a }) {
      ctx.lineWidth = 1;
      for (const l of lanes) {
        const y = ((l.y - sy * 0.12) % h + h) % h;
        ctx.strokeStyle = rgba(line, a * 0.7);
        ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); ctx.stroke();
        ctx.beginPath();
        for (let x = (l.phase % 80); x < w; x += 80) { ctx.moveTo(x + 0.5, y - 3); ctx.lineTo(x + 0.5, y + 3); }
        ctx.stroke();
        const head = (l.phase + t * l.speed) % (w + l.len);
        const near = Math.abs(py - y) < 90 && px > -999 ? 1 - Math.abs(py - y) / 90 : 0;
        const g = ctx.createLinearGradient(head - l.len, 0, head, 0);
        g.addColorStop(0, rgba(accent, 0));
        g.addColorStop(1, rgba(accent, a * (0.45 + near * 0.45)));
        ctx.strokeStyle = g; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(head - l.len, y + 0.5); ctx.lineTo(head, y + 0.5); ctx.stroke();
        ctx.lineWidth = 1;
      }
    },
  };
}

/** SKILLS — a drifting mesh of nodes; links near the cursor brighten and nodes step aside. */
function networkLayer(w: number, h: number, small: boolean): Layer {
  const r = rnd(13);
  const ns = Array.from({ length: small ? 18 : 46 }, () => ({ x: r() * w, y: r() * h, vx: (r() - 0.5) * 8, vy: (r() - 0.5) * 8, ox: 0, oy: 0 }));
  const { accent, accent2 } = envById("network").palette;
  const LINK = small ? 120 : 150;
  return {
    draw({ ctx, w, h, dt, px, py, a }) {
      for (const n of ns) {
        n.x += n.vx * dt; n.y += n.vy * dt;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        const dx = n.x - px, dy = n.y - py, d = Math.hypot(dx, dy);
        const push = d < 160 ? (1 - d / 160) * 18 : 0;
        n.ox += ((d ? (dx / d) * push : 0) - n.ox) * 0.08;
        n.oy += ((d ? (dy / d) * push : 0) - n.oy) * 0.08;
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < ns.length; i++) {
        const A = ns[i];
        for (let j = i + 1; j < ns.length; j++) {
          const B = ns[j];
          const dx = A.x - B.x, dy = A.y - B.y;
          if (Math.abs(dx) > LINK || Math.abs(dy) > LINK) continue;
          const d = Math.hypot(dx, dy);
          if (d > LINK) continue;
          const mx = (A.x + B.x) / 2 - px, my = (A.y + B.y) / 2 - py;
          const near = Math.max(0, 1 - Math.hypot(mx, my) / 200);
          ctx.strokeStyle = rgba(near > 0.05 ? accent2 : accent, a * ((1 - d / LINK) * 0.22 + near * 0.35));
          ctx.beginPath(); ctx.moveTo(A.x + A.ox, A.y + A.oy); ctx.lineTo(B.x + B.ox, B.y + B.oy); ctx.stroke();
        }
      }
      ctx.fillStyle = rgba(accent, a * 0.6);
      for (const n of ns) ctx.fillRect(n.x + n.ox - 1.5, n.y + n.oy - 1.5, 3, 3);
    },
  };
}

/** EXPERIENCE — radar rings, a slow sweep and a scrolling measurement scale. */
function commandLayer(): Layer {
  const { accent, line } = envById("command").palette;
  return {
    draw({ ctx, w, h, t, sy, a, small }) {
      const cx = w * (small ? 0.9 : 0.86), cy = h * 0.78;
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba(line, a * 0.9);
      for (let r = 90; r < 520; r += 90) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke(); }
      const ang = t * 0.35;
      if (typeof ctx.createConicGradient === "function") {
        const g = ctx.createConicGradient(ang - 0.6, cx, cy);
        g.addColorStop(0, rgba(accent, 0));
        g.addColorStop(0.09, rgba(accent, a * 0.1));
        g.addColorStop(0.1, rgba(accent, 0));
        g.addColorStop(1, rgba(accent, 0));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cx, cy, 520, 0, TAU); ctx.fill();
      }

      ctx.strokeStyle = rgba(line, a * 1.2);
      ctx.fillStyle = rgba(accent, a * 0.4);
      ctx.font = MONO;
      const step = 24, off = -(sy * 0.5) % step, base = Math.floor((sy * 0.5) / step);
      ctx.beginPath();
      for (let i = 0, y = off; y < h; i++, y += step) {
        const major = (base + i) % 5 === 0;
        ctx.moveTo(18, y + 0.5); ctx.lineTo(major ? 34 : 26, y + 0.5);
        if (major && !small) ctx.fillText(String((base + i) * 10).padStart(4, "0"), 40, y + 3);
      }
      ctx.stroke();
    },
  };
}

/** CONTACT — calm, very fine geometry: concentric dashed arcs that rotate slowly. */
function lightLayer(): Layer {
  const { line, accent } = envById("light").palette;
  return {
    draw({ ctx, w, h, t, a }) {
      const cx = w * 0.78, cy = h * 0.5;
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = rgba(i === 1 ? accent : line, a * (i === 1 ? 0.18 : 0.9));
        ctx.setLineDash(i % 2 ? [2, 8] : []);
        ctx.beginPath();
        const r0 = 140 + i * 110, rot = t * 0.03 * (i % 2 ? -1 : 1);
        ctx.arc(cx, cy, r0, rot, rot + Math.PI * 1.4);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    },
  };
}

/**
 * One fixed canvas that draws the geometry of the current environment, cross-fading into the next
 * one during a scroll hand-off. Only environments with weight > 0 are drawn (at most two at a time).
 */
export function AmbientField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = prefersReducedMotion();
    const cursor = cursorEffectsEnabled();
    let w = 0, h = 0, small = false, raf = 0, t = 0, last = performance.now(), skip = false;
    let layers = {} as Record<EnvId, Layer>;
    let spx = -9999, spy = -9999;

    const build = () => {
      small = window.innerWidth < 760;
      const dpr = Math.min(window.devicePixelRatio || 1, small ? 1 : 1.5);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layers = { core: coreLayer(w, h, small), blueprint: blueprintLayer(w, h), industrial: industrialLayer(w, h, small), network: networkLayer(w, h, small), command: commandLayer(), light: lightLayer() };
    };

    const paint = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      if (cursor && pointer.active) {
        spx = spx < -999 ? pointer.x : spx + (pointer.x - spx) * Math.min(1, dt * 8);
        spy = spy < -999 ? pointer.y : spy + (pointer.y - spy) * Math.min(1, dt * 8);
      } else { spx = -9999; spy = -9999; }
      const sy = window.scrollY;
      for (const id of Object.keys(layers) as EnvId[]) {
        const a = envState.weight[id] ?? 0;
        if (a > 0.01) layers[id].draw({ ctx, w, h, t, dt, sy, px: spx, py: spy, a, small });
      }
    };

    build();
    const onResize = () => { build(); if (reduced) paint(0); };
    window.addEventListener("resize", onResize);

    if (reduced) {
      t = 4; paint(0);
      const onScroll = () => requestAnimationFrame(() => paint(0));
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => { window.removeEventListener("resize", onResize); window.removeEventListener("scroll", onScroll); };
    }

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      // Phones: render at ~30fps — the motion is slow enough that it reads the same.
      if (small && (skip = !skip)) return;
      last = now; t += dt;
      paint(dt);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={ref} className="ambient" aria-hidden="true" />;
}
