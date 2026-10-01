import { Fragment } from "react";
import { ArrowUpRight } from "lucide-react";
import { site } from "../../config";
import type { Project } from "../ProjectDialog";
import { SectionHead } from "./SectionHead";

export const moduleId = (i: number) => `MOD-${String(i + 1).padStart(2, "0")}`;

/** A project drawn as an engineered system module with its signal chain. */
function Module({ project, index, onOpen }: { project: Project; index: number; onOpen: (p: Project) => void }) {
  return (
    <li className="reveal" style={{ transitionDelay: `${(index % 2) * 80}ms` }}>
      <button type="button" className="module" onClick={() => onOpen(project)} aria-haspopup="dialog" data-magnetic="0.06">
        <span className="mod-head">
          <span className="mod-id">{moduleId(index)}</span>
          <span className="mod-cat">{project.category}</span>
          <span className="mod-led" aria-hidden="true" />
        </span>
        <span className="mod-title">{project.title}</span>
        <span className="mod-sum">{project.summary}</span>
        <span className="signal" aria-label={`System path: ${project.flow.join(" to ")}`}>
          {project.flow.map((step, i) => (
            <Fragment key={`${i}-${step}`}>
              <span className="sig-node" style={{ animationDelay: `${i * 0.12}s` }}>{step}</span>
              {i < project.flow.length - 1 && <span className="sig-wire" aria-hidden="true"><i style={{ animationDelay: `${i * 0.12}s` }} /></span>}
            </Fragment>
          ))}
        </span>
        <span className="mod-foot">
          <span className="mod-io"><b>STACK</b> {project.tags.slice(0, 5).join(" · ")}</span>
          <span className="mod-open">Open dossier <ArrowUpRight size={15} aria-hidden="true" /></span>
        </span>
      </button>
    </li>
  );
}

export function Projects({ onOpen }: { onOpen: (p: Project) => void }) {
  const { projects } = site;
  return (
    <section id="projects" className="section env env-industrial" data-env="industrial" aria-labelledby="projects-title">
      <div className="wrap">
        <SectionHead id="projects-title" index="02" kicker={projects.kicker} title={projects.title} intro={projects.intro} />
        <ul className="modules">
          {projects.items.map((p, i) => <Module key={p.id} project={p} index={i} onOpen={onOpen} />)}
        </ul>
      </div>
    </section>
  );
}
