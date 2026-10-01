import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { site } from "../config";
import { prefersReducedMotion } from "../engine/pointer";
import { InteractiveSystem } from "./system/InteractiveSystem";

function RotatingWords({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (words.length < 2 || prefersReducedMotion()) return;
    const id = window.setInterval(() => setI(v => (v + 1) % words.length), 2600);
    return () => window.clearInterval(id);
  }, [words]);
  return (
    <>
      <span className="sr-only">{words.join(", ")}</span>
      <span key={i} className="rotator" aria-hidden="true">{words[i]}</span>
    </>
  );
}

export function Hero() {
  const { person, hero } = site;
  return (
    <section id="top" className="hero env" data-env="core" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow reveal">{person.role}</p>
        <h1 id="hero-title" className="reveal">{hero.headline}</h1>
        <p className="hero-rotate reveal">{hero.rotatingLead} <RotatingWords words={hero.rotatingWords} /></p>
        <p className="lede reveal">{hero.intro}</p>
        <div className="actions reveal">
          <a href={`#${hero.primaryButton.target}`} className="btn btn-primary" data-magnetic="0.25">{hero.primaryButton.label} <ArrowRight size={16} aria-hidden="true" /></a>
          {hero.secondaryButton && <a href={`#${hero.secondaryButton.target}`} className="btn btn-line" data-magnetic="0.25">{hero.secondaryButton.label}</a>}
        </div>
        {hero.highlights.length > 0 && (
          <dl className="highlights reveal">
            {hero.highlights.map(h => <div key={h.label}><dd>{h.value}</dd><dt>{h.label}</dt></div>)}
            <div><dd className="status-inline"><span className={`status-dot status-${person.availability.status}`} aria-hidden="true" /> {person.location}</dd><dt>{person.availability.text}</dt></div>
          </dl>
        )}
      </div>
      <div className="hero-system reveal">
        <InteractiveSystem domains={hero.domains} />
      </div>
      <p className="scroll-cue" aria-hidden="true"><i /> scroll to move through the system</p>
    </section>
  );
}
