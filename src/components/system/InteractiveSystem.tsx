import { useEffect, useRef, useState } from "react";
import { ArrowDownRight } from "lucide-react";
import type { PortfolioConfig } from "../../config/types";
import { cursorEffectsEnabled, pointer, prefersReducedMotion, trackPointer } from "../../engine/pointer";
import { onVisible, useMedia } from "../../hooks/useMedia";

type Domain = PortfolioConfig["hero"]["domains"][number];
interface Link { a: number; b: number }

const PACKETS = 14;
const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });

/** Links: every domain to the core (index -1), neighbours on the ring, and a few cross-connections. */
function buildLinks(n: number): Link[] {
  const links: Link[] = [];
  for (let i = 0; i < n; i++) links.push({ a: -1, b: i });
  for (let i = 0; i < n; i++) links.push({ a: i, b: (i + 1) % n });
  for (let i = 0; i < Math.floor(n / 2); i++) if (n > 4) links.push({ a: i, b: i + Math.floor(n / 2) });
  return links;
}

/**
 * HERO — the system core and its domains. SVG for wires and packets; real <button>s for nodes
 * (focusable, clickable, screen-reader friendly). Animates only while on screen.
 */
function SystemDiagram({ domains }: { domains: Domain[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const packetRefs = useRef<(SVGCircleElement | null)[]>([]);
  const activeRef = useRef(-1);
  const [active, setActive] = useState(-1);
  const links = useRef(buildLinks(domains.length)).current;

  useEffect(() => { activeRef.current = active; }, [active]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    const cursor = cursorEffectsEnabled();
    if (cursor) trackPointer();
    const n = domains.length;
    let W = 0, H = 0, rect = el.getBoundingClientRect();
    let raf = 0, t = 0, last = performance.now(), visible = true;
    const pos = Array.from({ length: n }, () => ({ x: 0, y: 0, ox: 0, oy: 0, prox: 0 }));
    const packets = Array.from({ length: PACKETS }, (_, i) => ({ link: i % links.length, t: Math.random(), dir: Math.random() > 0.5 ? 1 : -1, speed: 70 + Math.random() * 60 }));
    const proxCache = new Array(n).fill(-1);

    const measure = () => { rect = el.getBoundingClientRect(); W = rect.width; H = rect.height; };
    const point = (i: number) => (i < 0 ? { x: W / 2, y: H / 2 } : { x: pos[i].x + pos[i].ox, y: pos[i].y + pos[i].oy });

    const frame = (dt: number) => {
      const heroP = Math.min(1, Math.max(0, window.scrollY / (H * 1.1)));
      const spread = 1 + heroP * 0.35;
      const rx = W * 0.38 * spread, ry = H * 0.37 * spread;
      const px = pointer.active ? pointer.x - rect.left : -9999, py = pointer.active ? pointer.y - rect.top : -9999;

      for (let i = 0; i < n; i++) {
        const ang = -Math.PI / 2 + (i / n) * Math.PI * 2 + (reduced ? 0 : Math.sin(t * 0.08 + i * 1.7) * 0.04);
        const bob = reduced ? 0 : Math.sin(t * 0.6 + i) * 5;
        const p = pos[i];
        p.x = W / 2 + Math.cos(ang) * (rx + bob);
        p.y = H / 2 + Math.sin(ang) * (ry + bob);
        const dx = px - p.x, dy = py - p.y, d = Math.hypot(dx, dy);
        const prox = cursor && d < 230 ? 1 - d / 230 : 0;
        p.prox += (prox - p.prox) * Math.min(1, dt * 8);
        const pull = p.prox * 14;
        p.ox += ((d ? (dx / d) * pull : 0) - p.ox) * Math.min(1, dt * 6);
        p.oy += ((d ? (dy / d) * pull : 0) - p.oy) * Math.min(1, dt * 6);
        const node = nodeRefs.current[i];
        if (node) {
          node.style.transform = `translate3d(${(p.x + p.ox).toFixed(1)}px, ${(p.y + p.oy).toFixed(1)}px, 0) translate(-50%, -50%)`;
          const pr = Math.round(p.prox * 20) / 20;
          if (pr !== proxCache[i]) { proxCache[i] = pr; node.style.setProperty("--prox", String(pr)); }
        }
      }

      const act = activeRef.current;
      links.forEach((l, k) => {
        const line = lineRefs.current[k];
        if (!line) return;
        const A = point(l.a), B = point(l.b);
        line.setAttribute("x1", A.x.toFixed(1)); line.setAttribute("y1", A.y.toFixed(1));
        line.setAttribute("x2", B.x.toFixed(1)); line.setAttribute("y2", B.y.toFixed(1));
        const prox = Math.max(l.a >= 0 ? pos[l.a].prox : 0, pos[l.b].prox);
        const on = act >= 0 && (l.a === act || l.b === act);
        const base = l.a < 0 ? 0.22 : 0.1;
        line.style.opacity = String(Math.min(1, base + prox * 0.55 + (on ? 0.65 : 0)) * (1 - heroP * 0.6));
      });

      packets.forEach((p, k) => {
        const c = packetRefs.current[k];
        if (!c) return;
        const l = links[p.link];
        const A = point(l.a), B = point(l.b);
        const len = Math.hypot(B.x - A.x, B.y - A.y) || 1;
        p.t += (p.dir * p.speed * dt * (1 + heroP)) / len;
        if (p.t > 1 || p.t < 0) {
          const pool = act >= 0 && Math.random() < 0.6 ? links.map((x, i) => (x.a === act || x.b === act ? i : -1)).filter(i => i >= 0) : links.map((_, i) => i);
          p.link = pool[Math.floor(Math.random() * pool.length)];
          p.dir = Math.random() > 0.5 ? 1 : -1;
          p.t = p.dir > 0 ? 0 : 1;
        }
        const tt = Math.min(1, Math.max(0, p.t));
        c.setAttribute("cx", (A.x + (B.x - A.x) * tt).toFixed(1));
        c.setAttribute("cy", (A.y + (B.y - A.y) * tt).toFixed(1));
      });
      el.style.setProperty("--hero-p", heroP.toFixed(3));
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now; t += dt;
      frame(dt);
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const onScroll = () => { rect = el.getBoundingClientRect(); if (reduced) frame(0); };
    window.addEventListener("scroll", onScroll, { passive: true });
    let stopVis = () => {};
    if (reduced) frame(0);
    else {
      stopVis = onVisible(el, v => {
        visible = v;
        if (v && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
      });
    }
    return () => { cancelAnimationFrame(raf); ro.disconnect(); stopVis(); window.removeEventListener("scroll", onScroll); };
  }, [domains, links]);

  const shown = active >= 0 ? domains[active] : null;
  return (
    <div className="system" ref={wrap} onPointerLeave={() => setActive(-1)}>
      <svg className="system-wires" aria-hidden="true">
        {links.map((l, k) => <line key={k} ref={r => { lineRefs.current[k] = r; }} className={l.a < 0 ? "wire wire-core" : "wire"} />)}
        {Array.from({ length: PACKETS }, (_, k) => <circle key={k} ref={r => { packetRefs.current[k] = r; }} r={2.4} className="packet" />)}
      </svg>
      <div className="core" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="core-rings">
          <circle cx="100" cy="100" r="96" className="ring ring-1" />
          <circle cx="100" cy="100" r="78" className="ring ring-2" />
          <circle cx="100" cy="100" r="58" className="ring ring-3" />
        </svg>
        <span className="core-label">SYSTEM<b>CORE</b></span>
      </div>
      {domains.map((d, i) => (
        <button
          key={d.id}
          ref={r => { nodeRefs.current[i] = r; }}
          type="button"
          className={`node ${active === i ? "is-active" : ""}`}
          onPointerEnter={() => setActive(i)}
          onFocus={() => setActive(i)}
          onClick={() => goTo(d.target)}
          aria-describedby="system-readout"
        >
          <span className="node-code">{d.code}</span>
          <span className="node-label">{d.label}</span>
        </button>
      ))}
      <div id="system-readout" className={`readout ${shown ? "is-on" : ""}`} aria-live="polite">
        {shown ? (
          <>
            <p className="readout-head"><span>{shown.code}</span> {shown.label}</p>
            <p className="readout-sum">{shown.summary}</p>
            <ul>{shown.techs.map(t => <li key={t}>{t}</li>)}</ul>
            <p className="readout-go">Click to open <ArrowDownRight size={13} aria-hidden="true" /></p>
          </>
        ) : (
          <p className="readout-idle">Hover a domain to inspect it</p>
        )}
      </div>
    </div>
  );
}

/** MOBILE — not a shrunken diagram: a vertical system bus with tap-to-expand domains. */
function SystemBus({ domains }: { domains: Domain[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="bus">
      <div className="bus-core" aria-hidden="true"><span>SYSTEM</span><b>CORE</b></div>
      <ol className="bus-list">
        {domains.map(d => {
          const isOpen = open === d.id;
          return (
            <li key={d.id} className={isOpen ? "is-open" : ""}>
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : d.id)}>
                <span className="node-code">{d.code}</span>
                <span className="bus-label">{d.label}</span>
                <span className="bus-plus" aria-hidden="true">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <div className="bus-detail">
                  <p>{d.summary}</p>
                  <ul>{d.techs.map(t => <li key={t}>{t}</li>)}</ul>
                  <button type="button" className="bus-go" onClick={() => goTo(d.target)}>Open section <ArrowDownRight size={13} aria-hidden="true" /></button>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function InteractiveSystem({ domains }: { domains: Domain[] }) {
  const mobile = useMedia("(max-width: 760px)");
  return mobile ? <SystemBus domains={domains} /> : <SystemDiagram domains={domains} />;
}
