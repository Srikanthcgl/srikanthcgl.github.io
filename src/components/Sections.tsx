import { useState } from "react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { ArrowRight, Check, Copy, Mail, Phone } from "lucide-react";
import { site } from "../config";
import type { SectionId } from "../config";
import { skillIcons, socialIcons } from "./icons";
import type { Project } from "./ProjectDialog";
import { TagList } from "./Term";

function Section({ id, kicker, title, intro, children }: { id: SectionId; kicker: string; title: string; intro?: string; children: ReactNode }) {
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="section-head reveal">
        <p className="kicker">{kicker}</p>
        <h2 id={`${id}-title`}>{title}</h2>
        {intro && <p className="section-intro">{intro}</p>}
      </div>
      {children}
    </section>
  );
}

export function About() {
  const { about } = site;
  return (
    <Section id="about" kicker={about.kicker} title={about.title}>
      <div className="about-grid">
        <div className="prose reveal">
          {about.paragraphs.map(p => <p key={p}>{p}</p>)}
        </div>
        {about.facts.length > 0 && (
          <dl className="card spot facts reveal">
            {about.facts.map(f => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
          </dl>
        )}
      </div>
      <ul className="values">
        {about.values.map(v => (
          <li key={v.title} className="card spot reveal">
            <span className="value-emoji" aria-hidden="true">{v.emoji}</span>
            <h3>{v.title}</h3>
            <p>{v.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: (p: Project) => void }) {
  const tilt = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--rx", `${(((e.clientY - r.top) / r.height) - 0.5) * -5}deg`);
    e.currentTarget.style.setProperty("--ry", `${(((e.clientX - r.left) / r.width) - 0.5) * 6}deg`);
  };
  const reset = (e: PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };
  return (
    <li className={`reveal ${index === 0 ? "feat" : ""}`} style={{ transitionDelay: `${(index % 3) * 70}ms` }}>
      <button type="button" className="card spot project-card" onClick={() => onOpen(project)} onPointerMove={tilt} onPointerLeave={reset} aria-haspopup="dialog">
        <span className="cover" style={{ "--i": index } as CSSProperties}>
          {project.image
            ? <img src={project.image} alt="" loading="lazy" />
            : <span className="cover-emoji" aria-hidden="true">{project.emoji}</span>}
          <span className="cover-tag">{project.category}</span>
        </span>
        <span className="project-body">
          <span className="project-title">{project.title}</span>
          <span className="project-summary">{project.summary}</span>
          <span className="project-more">Read the story <ArrowRight size={16} aria-hidden="true" /></span>
        </span>
      </button>
    </li>
  );
}

export function Projects({ onOpen }: { onOpen: (p: Project) => void }) {
  const { projects } = site;
  return (
    <Section id="projects" kicker={projects.kicker} title={projects.title} intro={projects.intro}>
      <ul className="project-grid">
        {projects.items.map((p, i) => <ProjectCard key={p.id} project={p} index={i} onOpen={onOpen} />)}
      </ul>
    </Section>
  );
}

export function Skills() {
  const { skills } = site;
  return (
    <Section id="skills" kicker={skills.kicker} title={skills.title} intro={skills.intro}>
      <ul className="skill-grid">
        {skills.groups.map(g => {
          const Icon = skillIcons[g.icon];
          return (
            <li key={g.title} className="card spot skill-card reveal">
              <span className="skill-icon"><Icon size={20} aria-hidden="true" /></span>
              <h3>{g.title}</h3>
              <p>{g.description}</p>
              <TagList items={g.items} />
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export function Experience() {
  const { experience } = site;
  return (
    <Section id="experience" kicker={experience.kicker} title={experience.title} intro={experience.intro}>
      <div className="exp-grid">
        <ol className="timeline">
          {experience.jobs.map(j => (
            <li key={j.org + j.period} className="reveal">
              <p className="period">{j.period}</p>
              <h3>{j.role}</h3>
              <p className="org">{j.org}</p>
              <p>{j.summary}</p>
              <ul className="ticks">{j.highlights.map(h => <li key={h}>{h}</li>)}</ul>
            </li>
          ))}
        </ol>
        {experience.education.length > 0 && (
          <div className="reveal">
            <h3 className="subhead">{experience.educationTitle}</h3>
            <ul className="edu">
              {experience.education.map(e => (
                <li key={e.school} className="card spot"><strong>{e.school}</strong><span>{e.degree}</span><span className="period">{e.period}</span></li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Section>
  );
}

export function Contact() {
  const { contact, person, social } = site;
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch { /* the mailto link still works */ }
  };
  return (
    <Section id="contact" kicker={contact.kicker} title={contact.title}>
      <div className="card spot contact-card reveal">
        <p>{contact.text}</p>
        <div className="actions center">
          {person.email && (
            <>
              <a className="btn btn-primary" href={`mailto:${person.email}`}><Mail size={17} aria-hidden="true" /> {contact.buttonLabel}</a>
              <button type="button" className="btn btn-soft" onClick={copy}>
                {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />} <span aria-live="polite">{copied ? "Copied!" : person.email}</span>
              </button>
            </>
          )}
          {person.phone && <a className="btn btn-soft" href={`tel:${person.phone}`}><Phone size={16} aria-hidden="true" /> {person.phone}</a>}
        </div>
        {social.length > 0 && (
          <ul className="social">
            {social.map(s => {
              const Icon = socialIcons[s.icon];
              return <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer noopener"><Icon size={18} aria-hidden="true" /> {s.label}</a></li>;
            })}
          </ul>
        )}
        {person.resume && <p className="resume"><a href={person.resume} download>Download my résumé</a></p>}
      </div>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} {site.person.name}</span>
      <span>{site.footer.note}</span>
      <a href="#top">Back to top ↑</a>
    </footer>
  );
}
