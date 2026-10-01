import { useCallback, useRef, useState } from "react";
import { site } from "../../config";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import { SectionHead } from "./SectionHead";

/** The blueprint schematic: phases light up one by one as the section scrolls through the viewport. */
function Blueprint() {
  const { method } = site.about;
  const ref = useRef<HTMLOListElement>(null);
  const [lit, setLit] = useState(0);
  const onProgress = useCallback((p: number) => setLit(Math.min(method.phases.length, Math.floor(p * (method.phases.length + 0.6)))), [method.phases.length]);
  useScrollProgress(ref, onProgress, 0.9, 0.45);

  return (
    <figure className="blueprint reveal" aria-labelledby="method-title">
      <figcaption id="method-title" className="bp-title"><span>FIG. 01</span>{method.title}</figcaption>
      <ol className="bp-flow" ref={ref}>
        {method.phases.map((ph, i) => (
          <li key={ph.id} className={`bp-phase ${i < lit ? "is-lit" : ""}`} style={{ transitionDelay: `${i * 40}ms` }}>
            <span className="bp-code">P-{String(i + 1).padStart(2, "0")}</span>
            <strong>{ph.label}</strong>
            <span className="bp-detail">{ph.detail}</span>
            <span className="bp-covers">{ph.covers.join(" · ")}</span>
          </li>
        ))}
      </ol>
      <p className={`bp-loop ${lit >= method.phases.length ? "is-lit" : ""}`}><span aria-hidden="true">↺</span> {method.feedback}</p>
    </figure>
  );
}

export function About() {
  const { about } = site;
  return (
    <section id="about" className="section env env-blueprint" data-env="blueprint" aria-labelledby="about-title">
      <div className="wrap">
        <SectionHead id="about-title" index="01" kicker={about.kicker} title={about.title} />
        <div className="about-grid">
          <div className="prose reveal">
            {about.paragraphs.map(p => <p key={p}>{p}</p>)}
          </div>
          {about.facts.length > 0 && (
            <dl className="spec reveal" aria-label="Summary">
              <p className="spec-head" aria-hidden="true">SPEC SHEET</p>
              {about.facts.map(f => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
            </dl>
          )}
        </div>
        <Blueprint />
        {about.values.length > 0 && (
          <ul className="principles">
            {about.values.map((v, i) => (
              <li key={v.title} className="reveal">
                <span className="pr-code">PRINCIPLE {String(i + 1).padStart(2, "0")}</span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
