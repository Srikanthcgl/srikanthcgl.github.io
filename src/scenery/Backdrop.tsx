import { useEffect, useRef } from "react";
import { Flow, WORLD_H, WORLD_W, edgePoint, edges, node, nodes, pipelineStageIds } from "./network";
import type { NodeDef } from "./network";

const TEAL = "143,220,201";
const BLUE = "138,180,248";
const AMBER = "242,192,117";
const TONE: Record<NodeDef["tone"], string> = { client: TEAL, edge: BLUE, service: TEAL, data: BLUE, cloud: AMBER, ops: BLUE };

/** Where the camera rests (in world units) as the page scrolls from top (0) to bottom (1). */
const PATH: [number, number][] = ([
  [0.03, 0.36], [0.3, 0.34], [0.55, 0.42], [0.76, 0.46], [0.86, 0.66], [0.5, 0.9],
] as [number, number][]).map(([x, y]) => [x * WORLD_W, y * WORLD_H] as [number, number]);

const smooth = (t: number) => t * t * (3 - 2 * t);
function cameraAt(p: number): [number, number] {
  const f = Math.min(Math.max(p, 0), 1) * (PATH.length - 1);
  const i = Math.min(Math.floor(f), PATH.length - 2);
  const t = smooth(f - i);
  return [PATH[i][0] + (PATH[i + 1][0] - PATH[i][0]) * t, PATH[i][1] + (PATH[i + 1][1] - PATH[i][1]) * t];
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
}

function drawBot(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, phase: number, carrying: boolean) {
  const bob = Math.sin(t * 5 + phase) * 1.6;
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.beginPath(); ctx.ellipse(0, 17, 13, 3.2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = `rgba(${AMBER},0.9)`; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(0, -19); ctx.stroke();
  ctx.fillStyle = `rgb(${AMBER})`; ctx.beginPath(); ctx.arc(0, -20, 2.6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = `rgb(${TEAL})`; roundRect(ctx, -15, -12, 30, 24, 8); ctx.fill();
  ctx.fillStyle = "#0a141b"; roundRect(ctx, -10, -7, 20, 11, 5); ctx.fill();
  ctx.fillStyle = `rgb(${BLUE})`;
  ctx.beginPath(); ctx.arc(-4, -1.5, 2.1, 0, Math.PI * 2); ctx.arc(4, -1.5, 2.1, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = `rgba(${TEAL},0.55)`; ctx.fillRect(-9, 14, 6, 4); ctx.fillRect(3, 14, 6, 4);
  if (carrying) {
    ctx.fillStyle = `rgb(${AMBER})`; roundRect(ctx, -8, -34, 16, 14, 3); ctx.fill();
    ctx.strokeStyle = "#0a141b"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-8, -27); ctx.lineTo(8, -27); ctx.moveTo(0, -34); ctx.lineTo(0, -20); ctx.stroke();
  }
  ctx.restore();
}

/**
 * Fixed, decorative background: a system-architecture diagram (clients → API → MQTT/services → data → AWS,
 * with a CI/CD → Terraform → Deploy lane). Small robot agents carry data along the wires.
 * Scrolling flies the camera across the diagram; scroll speed speeds up the flow.
 */
export function Backdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, raf = 0;
    let target = 0, prog = 0, lastY = window.scrollY, vel = 0;
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const flow = new Flow(window.innerWidth < 720 ? 4 : 6);
    let last = performance.now();

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 720 ? 1.25 : 1.75);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const readScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      target = Math.min(1, Math.max(0, window.scrollY / max));
    };

    const paint = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const zoom = Math.max(0.45, Math.min(w / 1400, h / 860)) * (1 + Math.min(vel, 1) * 0.035);
      const [cx, cy] = cameraAt(prog);

      // far layer: dot grid that drifts slower than the diagram (depth)
      const gap = 46;
      const ox = ((-cx * 0.3 * zoom - mx * 10) % gap + gap) % gap;
      const oy = ((-cy * 0.3 * zoom - my * 8) % gap + gap) % gap;
      ctx.fillStyle = "rgba(255,255,255,0.07)";
      for (let x = ox; x < w; x += gap) for (let y = oy; y < h; y += gap) ctx.fillRect(x, y, 1.5, 1.5);

      ctx.save();
      ctx.translate(w / 2 - cx * zoom - mx * 22, h / 2 - cy * zoom - my * 14);
      ctx.scale(zoom, zoom);

      // layer captions
      ctx.font = `700 ${15 / Math.max(zoom, 0.7)}px "Plus Jakarta Sans Variable", system-ui, sans-serif`;
      ctx.textAlign = "left"; ctx.fillStyle = "rgba(255,255,255,0.11)";
      for (const [label, x] of [["CLIENTS", 160], ["EDGE", 690], ["SERVICES", 1190], ["DATA", 1720], ["CLOUD", 2240]] as const) ctx.fillText(label, x, 90);
      ctx.fillText("CI / CD  →  INFRASTRUCTURE AS CODE  →  RELEASE", 440, 1310);

      // wires
      for (const e of edges) {
        ctx.beginPath();
        for (let i = 0; i <= 28; i++) { const p = edgePoint(e, i / 28); if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }
        ctx.strokeStyle = `rgba(${TONE[node(e.a).tone]},${e.pipeline ? 0.3 : 0.2})`;
        ctx.lineWidth = e.pipeline ? 2.4 : 1.6;
        if (e.dashed) { ctx.setLineDash([8, 10]); ctx.lineDashOffset = -t * 26; } else ctx.setLineDash([]);
        ctx.stroke();
      }
      ctx.setLineDash([]); ctx.lineDashOffset = 0;

      // nodes
      ctx.font = `600 ${13 / Math.max(zoom, 0.75)}px "Plus Jakarta Sans Variable", system-ui, sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (const n of nodes) {
        const pulse = flow.pulse.get(n.id) ?? 0;
        const rgb = TONE[n.tone];
        const nh = 50;
        if (pulse > 0) { ctx.strokeStyle = `rgba(${rgb},${pulse * 0.45})`; ctx.lineWidth = 2; roundRect(ctx, n.x - n.w / 2 - 6 - (1 - pulse) * 10, n.y - nh / 2 - 6 - (1 - pulse) * 10, n.w + 12 + (1 - pulse) * 20, nh + 12 + (1 - pulse) * 20, 20); ctx.stroke(); }
        ctx.fillStyle = "rgba(9,16,23,0.9)"; roundRect(ctx, n.x - n.w / 2, n.y - nh / 2, n.w, nh, 14); ctx.fill();
        ctx.strokeStyle = `rgba(${rgb},${0.38 + pulse * 0.5})`; ctx.lineWidth = 1.4; ctx.stroke();
        ctx.fillStyle = `rgba(${rgb},${0.9})`; ctx.beginPath(); ctx.arc(n.x - n.w / 2 + 16, n.y, 3.4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(233,238,243,${0.72 + pulse * 0.25})`; ctx.fillText(n.label, n.x + 6, n.y + 1);
      }

      // data packets
      for (const p of flow.packets) {
        const tt = p.rev ? 1 - p.t : p.t;
        for (let k = 0; k < 4; k++) {
          const q = edgePoint(edges[p.e], Math.min(1, Math.max(0, tt + (p.rev ? 1 : -1) * k * 0.012)));
          ctx.fillStyle = `rgba(${p.rev ? AMBER : BLUE},${(1 - k / 4) * 0.85})`;
          ctx.beginPath(); ctx.arc(q.x, q.y, 4.2 - k * 0.7, 0, Math.PI * 2); ctx.fill();
        }
      }

      // robot agents roaming the wires
      for (const b of flow.bots) { const q = edgePoint(edges[b.e], b.t); drawBot(ctx, q.x, q.y - 4, t, b.phase, false); }

      // the release robot carrying a build along the pipeline
      const pb = flow.pipe;
      if (pb.state !== "reset") {
        const pos = pb.state === "wait" ? node(pipelineStageIds[Math.min(pb.stage, 4)]) : edgePoint(edges[pb.onEdge], pb.t);
        drawBot(ctx, pos.x, pos.y - 44, t, 1.3, true);
      }
      ctx.restore();
    };

    build(); readScroll(); prog = target;
    const onResize = () => { build(); readScroll(); if (reduced) paint(0); };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", readScroll, { passive: true });

    if (reduced) {
      for (let i = 0; i < 240; i++) flow.update(1 / 30, 0);
      paint(8);
      const onScroll = () => { prog = target; paint(8); };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => { window.removeEventListener("resize", onResize); window.removeEventListener("scroll", readScroll); window.removeEventListener("scroll", onScroll); };
    }

    const onMove = (e: PointerEvent) => { tmx = e.clientX / w - 0.5; tmy = e.clientY / h - 0.5; };
    window.addEventListener("pointermove", onMove, { passive: true });
    canvas.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, easing: "ease-out" });

    let t = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now; t += dt;
      const y = window.scrollY;
      const speed = Math.abs(y - lastY) / Math.max(dt, 0.001) / 1800; // ~0 idle, ~1 fast scroll
      lastY = y;
      vel += (Math.min(speed, 1.6) - vel) * (1 - Math.exp(-dt * 5));
      prog += (target - prog) * (1 - Math.exp(-dt * 3.2)); // eased camera = smooth glide
      const k = 1 - Math.exp(-dt * 4);
      mx += (tmx - mx) * k; my += (tmy - my) * k;
      flow.update(dt, vel * 1.6);
      paint(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="backdrop" aria-hidden="true">
      <i className="blob blob-1" />
      <i className="blob blob-2" />
      <i className="blob blob-3" />
      <canvas ref={ref} className="scenery" />
    </div>
  );
}
