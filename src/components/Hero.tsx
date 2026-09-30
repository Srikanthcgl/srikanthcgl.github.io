import { useEffect, useState } from "react";
import type { PointerEvent } from "react";
import { ArrowRight, Briefcase, Mail, MapPin, Smartphone } from "lucide-react";
import { site } from "../config";
import { Phone } from "./Phone";

const statusLabel = { open: "Available", busy: "Busy right now", closed: "Not taking new work" } as const;

function RotatingWords({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (words.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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

/** The hero shows a phone with "my profile as an Android app". */
function ProfilePhone() {
  const { person, sections } = site;
  const shortcuts = [
    { id: "apps", label: "Apps", icon: Smartphone },
    { id: "projects", label: "Work", icon: Briefcase },
    { id: "contact", label: "Contact", icon: Mail },
  ].filter(s => (sections as string[]).includes(s.id));

  const tilt = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--ry", `${(((e.clientX - r.left) / r.width) - 0.5) * 14}deg`);
    e.currentTarget.style.setProperty("--rx", `${(((e.clientY - r.top) / r.height) - 0.5) * -10}deg`);
  };
  const reset = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--ry", "0deg");
    e.currentTarget.style.setProperty("--rx", "0deg");
  };

  return (
    <div className="hero-visual reveal" onPointerMove={tilt} onPointerLeave={reset}>
      <Phone color="#5cc8b8" className="phone-hero">
        <div className="profile-screen">
          <div className="avatar">
            {person.photo ? <img src={person.photo} alt={person.name} width={120} height={120} /> : <span aria-hidden="true">{person.initials}</span>}
          </div>
          <p className="ps-name">{person.name}</p>
          <p className="ps-role">{person.role}</p>
          <p className="ps-place"><MapPin size={13} aria-hidden="true" /> {person.location}</p>
          <p className={`ps-chip status-${person.availability.status}`}><span className="status-dot" aria-hidden="true" /> {statusLabel[person.availability.status]}</p>
          <div className="ps-actions">
            {shortcuts.map(({ id, label, icon: Icon }) => (
              <a key={id} href={`#${id}`} className="ps-btn"><Icon size={18} aria-hidden="true" /><span>{label}</span></a>
            ))}
          </div>
        </div>
      </Phone>
      <span className="float-chip chip-a" aria-hidden="true">🤖 Android</span>
      <span className="float-chip chip-b" aria-hidden="true">⚙️ Systems</span>
      <span className="float-chip chip-c" aria-hidden="true">☁️ Cloud</span>
    </div>
  );
}

export function Hero() {
  const { person, hero } = site;
  const first = person.firstName ?? person.name.split(" ")[0];
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className={`status status-${person.availability.status}`}>
          <span className="status-dot" aria-hidden="true" /> {statusLabel[person.availability.status]} · {person.availability.text}
        </p>
        <p className="hero-greeting reveal">{hero.greeting}</p>
        <h1 id="hero-title" className="reveal"><span className="grad">{first}.</span> {hero.headline}</h1>
        <p className="hero-rotate reveal">{hero.rotatingLead} <RotatingWords words={hero.rotatingWords} /></p>
        <p className="lede reveal">{hero.intro}</p>
        <div className="actions reveal">
          <a href={`#${hero.primaryButton.target}`} className="btn btn-primary">{hero.primaryButton.label} <ArrowRight size={17} aria-hidden="true" /></a>
          {hero.secondaryButton && <a href={`#${hero.secondaryButton.target}`} className="btn btn-soft">{hero.secondaryButton.label}</a>}
        </div>
        {hero.highlights.length > 0 && (
          <dl className="highlights reveal">
            {hero.highlights.map(h => <div key={h.label}><dt>{h.label}</dt><dd>{h.value}</dd></div>)}
          </dl>
        )}
      </div>
      <ProfilePhone />
    </section>
  );
}
