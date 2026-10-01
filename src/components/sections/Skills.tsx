import { useEffect, useMemo, useRef, useState } from "react";
import { site } from "../../config";
import { cursorEffectsEnabled, pointer, trackPointer } from "../../engine/pointer";
import { onVisible, useMedia } from "../../hooks/useMedia";
import { skillIcons } from "../icons";
import { SectionHead } from "./SectionHead";

type Group = (typeof site.skills.groups)[number];
interface Tech { name: string; hubs: number[] }
type Focus = { kind: "hub"; i: number } | { kind: "tech"; name: string } | null;

/** Unique technologies and which capability groups use them (shared ones become cross-links). */
function useGraph(groups: Group[]) {
  return useMemo(() => {
    const map = new Map<string, number[]>();
    groups.forEach((g, gi) => g.items.forEach(it => map.set(it, [...(map.get(it) ?? []), gi])));
    const techs: Tech[] = Array.from(map, ([name, hubs]) => ({ name, hubs }));
    const idx = new Map(groups.map((g, i) => [g.id, i]));
    const relations = site.skills.relations.map(([a, b]) => [idx.get(a)!, idx.get(b)!] as [number, number]).filter(([a, b]) => a >= 0 && b >= 0);
    return { techs, relations };
  }, [groups]);
}

function layout(groups: Group[], techs: Tech[], W: number, H: number) {
  const cx = W / 2, cy = H / 2, rx = W * 0.34, ry = H * 0.27, n = groups.length;
  const hubs = groups.map((_, i) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    return { x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry, a };
  });
  const R = Math.min(W * 0.09, H * 0.15);
  const perHub = new Map<number, number>();
  const counts = new Map<number, number>();
  techs.forEach(t => { if (t.hubs.length === 1) counts.set(t.hubs[0], (counts.get(t.hubs[0]) ?? 0) + 1); });
  const pos = techs.map((t, k) => {
    if (t.hubs.length === 1) {
      const h = t.hubs[0], c = counts.get(h)!, j = perHub.get(h) ?? 0;
      perHub.set(h, j + 1);
      const spread = Math.min(Math.PI * 1.35, 0.34 * c);
      const ang = hubs[h].a + (c > 1 ? -spread / 2 + (spread * j) / (c - 1) : 0);
      const rr = R * [1, 1.38, 1.76][j % 3];
      return { x: hubs[h].x + Math.cos(ang) * rr * 1.25, y: hubs[h].y + Math.sin(ang) * rr, side: Math.cos(ang) };
    }
    const mx = t.hubs.reduce((s, h) => s + hubs[h].x, 0) / t.hubs.length;
    const my = t.hubs.reduce((s, h) => s + hubs[h].y, 0) / t.hubs.length;
    const jit = (k * 2.399) % (Math.PI * 2);
    return { x: mx + (cx - mx) * 0.18 + Math.cos(jit) * 16, y: my + (cy - my) * 0.18 + Math.sin(jit) * 16, side: 0 };
  });
  return { hubs, pos };
}

/** Desktop / tablet: an interactive capability graph. Hubs are buttons; technologies are drawn in SVG. */
function SkillGraph({ groups }: { groups: Group[] }) {
  const { techs, relations } = useGraph(groups);
  const wrap = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ W: 1000, H: 620 });
  const [focus, setFocus] = useState<Focus>(null);
  const techRefs = useRef<(SVGGElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const { hubs, pos } = useMemo(() => layout(groups, techs, size.W, size.H), [groups, techs, size]);
  const edges = useMemo(() => techs.flatMap((t, ti) => t.hubs.map(h => ({ ti, h }))), [techs]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const W = e.contentRect.width;
      setSize({ W, H: Math.max(560, Math.min(760, W * 0.62)) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Cursor field: technologies step aside from the pointer; their wires follow. Runs only while hovered.
  useEffect(() => {
    const el = wrap.current;
    if (!el || !cursorEffectsEnabled()) return;
    trackPointer();
    let raf = 0, inside = false, visible = false;
    const off = pos.map(() => ({ x: 0, y: 0 }));
    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const px = pointer.x - r.left, py = pointer.y - r.top;
      let moving = false;
      pos.forEach((p, i) => {
        const dx = p.x - px, dy = p.y - py, d = Math.hypot(dx, dy);
        const push = inside && d < 120 ? (1 - d / 120) * 16 : 0;
        const tx = d ? (dx / d) * push : 0, ty = d ? (dy / d) * push : 0;
        off[i].x += (tx - off[i].x) * 0.18; off[i].y += (ty - off[i].y) * 0.18;
        if (Math.abs(tx - off[i].x) > 0.1 || Math.abs(ty - off[i].y) > 0.1) moving = true;
        techRefs.current[i]?.setAttribute("transform", `translate(${(p.x + off[i].x).toFixed(1)} ${(p.y + off[i].y).toFixed(1)})`);
      });
      edges.forEach((e, k) => {
        const l = lineRefs.current[k];
        if (!l) return;
        l.setAttribute("x2", (pos[e.ti].x + off[e.ti].x).toFixed(1));
        l.setAttribute("y2", (pos[e.ti].y + off[e.ti].y).toFixed(1));
      });
      if ((inside || moving) && visible) raf = requestAnimationFrame(tick);
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const enter = () => { inside = true; wake(); };
    const leave = () => { inside = false; wake(); };
    const stop = onVisible(el, v => { visible = v; });
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", wake);
    el.addEventListener("pointerleave", leave);
    return () => { cancelAnimationFrame(raf); stop(); el.removeEventListener("pointerenter", enter); el.removeEventListener("pointermove", wake); el.removeEventListener("pointerleave", leave); };
  }, [pos, edges]);

  const litHubs = new Set<number>();
  const litTechs = new Set<string>();
  if (focus?.kind === "hub") {
    litHubs.add(focus.i);
    groups[focus.i].items.forEach(t => litTechs.add(t));
    relations.forEach(([a, b]) => { if (a === focus.i) litHubs.add(b); if (b === focus.i) litHubs.add(a); });
  } else if (focus?.kind === "tech") {
    litTechs.add(focus.name);
    techs.find(t => t.name === focus.name)?.hubs.forEach(h => litHubs.add(h));
  }
  const dim = focus !== null;

  const focusHub = focus?.kind === "hub" ? groups[focus.i] : null;
  const focusTech = focus?.kind === "tech" ? techs.find(t => t.name === focus.name) : null;
  const related = focus?.kind === "hub" ? relations.filter(([a, b]) => a === focus.i || b === focus.i).map(([a, b]) => groups[a === focus.i ? b : a].title) : [];
  const shared = techs.filter(t => t.hubs.length > 1).length;

  return (
    <div className="graph-wrap">
      <div className={`graph ${dim ? "has-focus" : ""}`} ref={wrap} style={{ height: size.H }} onPointerLeave={() => setFocus(null)}>
        <svg width={size.W} height={size.H} aria-hidden="true">
          {relations.map(([a, b], k) => {
            const A = hubs[a], B = hubs[b];
            const qx = (A.x + B.x) / 2 + (size.W / 2 - (A.x + B.x) / 2) * 0.35, qy = (A.y + B.y) / 2 + (size.H / 2 - (A.y + B.y) / 2) * 0.35;
            const on = litHubs.has(a) && litHubs.has(b) && (focus?.kind !== "hub" || a === focus.i || b === focus.i);
            return <path key={k} d={`M${A.x},${A.y} Q${qx},${qy} ${B.x},${B.y}`} className={`rel ${on ? "is-lit" : ""}`} />;
          })}
          {edges.map((e, k) => {
            const on = litTechs.has(techs[e.ti].name) && litHubs.has(e.h);
            return <line key={k} ref={r => { lineRefs.current[k] = r; }} x1={hubs[e.h].x} y1={hubs[e.h].y} x2={pos[e.ti].x} y2={pos[e.ti].y} className={`spoke ${on ? "is-lit" : dim ? "is-dim" : ""} ${techs[e.ti].hubs.length > 1 ? "is-shared" : ""}`} />;
          })}
          {techs.map((t, i) => {
            const on = litTechs.has(t.name);
            return (
              <g key={t.name} ref={r => { techRefs.current[i] = r; }} transform={`translate(${pos[i].x} ${pos[i].y})`}
                className={`tech ${on ? "is-lit" : dim ? "is-dim" : ""} ${t.hubs.length > 1 ? "is-shared" : ""}`}
                onPointerEnter={() => setFocus({ kind: "tech", name: t.name })}>
                <circle r={t.hubs.length > 1 ? 4.5 : 3} />
                <circle r={12} className="hit" />
                <text x={pos[i].side > 0.3 ? 8 : pos[i].side < -0.3 ? -8 : 0} y={Math.abs(pos[i].side) > 0.3 ? 3.5 : -9} textAnchor={pos[i].side > 0.3 ? "start" : pos[i].side < -0.3 ? "end" : "middle"}>{t.name}</text>
              </g>
            );
          })}
        </svg>
        {groups.map((g, i) => {
          const Icon = skillIcons[g.icon];
          return (
            <button key={g.id} type="button" className={`hub ${litHubs.has(i) ? "is-lit" : dim ? "is-dim" : ""}`}
              style={{ left: hubs[i].x, top: hubs[i].y }}
              onPointerEnter={() => setFocus({ kind: "hub", i })} onFocus={() => setFocus({ kind: "hub", i })} onBlur={() => setFocus(null)}
              aria-describedby="skill-readout">
              <Icon size={15} aria-hidden="true" /> {g.title}
            </button>
          );
        })}
      </div>
      <aside id="skill-readout" className="readout skill-readout" aria-live="polite">
        {focusHub ? (
          <>
            <p className="readout-head"><span>CAPABILITY</span> {focusHub.title}</p>
            <p className="readout-sum">{focusHub.description}</p>
            <ul>{focusHub.items.map(t => <li key={t}>{t}</li>)}</ul>
            {related.length > 0 && <p className="readout-rel"><b>Connects with</b> {related.join(" · ")}</p>}
          </>
        ) : focusTech ? (
          <>
            <p className="readout-head"><span>TECHNOLOGY</span> {focusTech.name}</p>
            {site.glossary[focusTech.name] && <p className="readout-sum">{site.glossary[focusTech.name]}</p>}
            <p className="readout-rel"><b>Used in</b> {focusTech.hubs.map(h => groups[h].title).join(" · ")}</p>
          </>
        ) : (
          <p className="readout-idle">{groups.length} capabilities · {techs.length} technologies · {shared} shared links. Hover a capability or a node to trace its connections.</p>
        )}
      </aside>
    </div>
  );
}

/** Phones: a deliberate list — tap a capability to expand it and see what it connects to. */
function SkillCards({ groups }: { groups: Group[] }) {
  const { relations } = useGraph(groups);
  const [open, setOpen] = useState(groups[0]?.id ?? "");
  return (
    <ul className="cap-cards">
      {groups.map((g, i) => {
        const Icon = skillIcons[g.icon];
        const isOpen = open === g.id;
        const rel = relations.filter(([a, b]) => a === i || b === i).map(([a, b]) => groups[a === i ? b : a]);
        return (
          <li key={g.id} className={`cap reveal ${isOpen ? "is-open" : ""}`}>
            <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? "" : g.id)}>
              <Icon size={17} aria-hidden="true" /> <span>{g.title}</span> <b aria-hidden="true">{isOpen ? "−" : "+"}</b>
            </button>
            {isOpen && (
              <div className="cap-body">
                <p>{g.description}</p>
                <ul className="cap-techs">{g.items.map(t => <li key={t}>{t}</li>)}</ul>
                {rel.length > 0 && (
                  <p className="cap-rel">Connects with {rel.map(r => <button key={r.id} type="button" onClick={() => setOpen(r.id)}>{r.title}</button>)}</p>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function Skills() {
  const { skills } = site;
  const compact = useMedia("(max-width: 900px)");
  return (
    <section id="skills" className="section env env-network" data-env="network" aria-labelledby="skills-title">
      <div className="wrap">
        <SectionHead id="skills-title" index="03" kicker={skills.kicker} title={skills.title} intro={skills.intro} />
        <div className="reveal">
          {compact ? <SkillCards groups={skills.groups} /> : <SkillGraph groups={skills.groups} />}
        </div>
      </div>
    </section>
  );
}
