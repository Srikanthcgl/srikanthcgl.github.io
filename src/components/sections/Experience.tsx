import { useCallback, useEffect, useRef } from "react";
import { site } from "../../config";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import { SectionHead } from "./SectionHead";

/** Command-center timeline: the rail fills with scroll and milestones come online as they pass. */
export function Experience() {
  const { experience } = site;
  const rail = useRef<HTMLDivElement>(null);
  const setFill = useCallback((p: number) => { rail.current?.style.setProperty("--fill", p.toFixed(3)); }, []);
  useScrollProgress(rail, setFill, 0.75, 0.5);

  useEffect(() => {
    const items = rail.current?.querySelectorAll<HTMLElement>(".ms");
    if (!items?.length) return;
    const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("is-online"); }), { rootMargin: "0px 0px -22% 0px" });
    items.forEach(i => io.observe(i));
    return () => io.disconnect();
  }, []);

  return (
    <section id="experience" className="section env env-command" data-env="command" aria-labelledby="experience-title">
      <div className="wrap">
        <SectionHead id="experience-title" index="04" kicker={experience.kicker} title={experience.title} intro={experience.intro} />
        <div className="console reveal">
          <div className="console-bar" aria-hidden="true">
            <span className="leds"><i /><i /><i /></span>
            <span>SYSTEM TIMELINE</span>
            <span className="console-meta">{experience.jobs.length} ACTIVE · {experience.education.length} ARCHIVED</span>
          </div>
          <div className="rail" ref={rail}>
            <span className="rail-track" aria-hidden="true"><i /></span>
            <ol className="milestones">
              {experience.jobs.map((j, i) => (
                <li key={j.org + j.period} className="ms">
                  <span className="ms-dot" aria-hidden="true" />
                  <p className="ms-meta"><span>NODE {String(i + 1).padStart(2, "0")}</span>{j.period}</p>
                  <h3>{j.role}</h3>
                  <p className="ms-org">{j.org}</p>
                  <p className="ms-sum">{j.summary}</p>
                  <ul className="ms-list">{j.highlights.map(h => <li key={h}>{h}</li>)}</ul>
                </li>
              ))}
              {experience.education.map(e => (
                <li key={e.school} className="ms ms-edu">
                  <span className="ms-dot" aria-hidden="true" />
                  <p className="ms-meta"><span>{experience.educationTitle.toUpperCase()}</span>{e.period}</p>
                  <h3>{e.degree}</h3>
                  <p className="ms-org">{e.school}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
