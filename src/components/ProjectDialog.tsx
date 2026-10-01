import { Fragment, useEffect, useRef } from "react";
import { ArrowRight, ExternalLink, X } from "lucide-react";
import type { PortfolioConfig } from "../config/types";
import { TagList } from "./Term";

export type Project = PortfolioConfig["projects"]["items"][number];

/** Native <dialog>: focus trap, Esc to close and an inert background come for free. */
export function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project && !dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add("scroll-lock");
    } else if (!project && dialog.open) {
      dialog.close();
    }
  }, [project]);

  return (
    // Backdrop click is a mouse-only convenience; Esc closes natively.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="dialog-title"
      onClose={() => { document.documentElement.classList.remove("scroll-lock"); onClose(); }}
      onClick={e => { if (e.target === ref.current) onClose(); }}
    >
      {project && (
        <div className="dialog-body">
          <button type="button" className="icon-btn dialog-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
          <p className="kicker"><span>DOSSIER</span>{project.category}{project.year ? ` · ${project.year}` : ""}</p>
          <h3 id="dialog-title">{project.title}</h3>
          <p className="dialog-summary">{project.summary}</p>

          <h4>System path</h4>
          <ol className="dossier-flow">
            {project.flow.map((step, i) => (
              <Fragment key={`${i}-${step}`}>
                <li>{step}</li>
                {i < project.flow.length - 1 && <li aria-hidden="true" className="dossier-arrow"><ArrowRight size={13} /></li>}
              </Fragment>
            ))}
          </ol>
          <h4>What it is</h4>
          <p>{project.whatItIs}</p>
          <h4>Why it matters</h4>
          <p>{project.whyItMatters}</p>
          <h4>What I did</h4>
          <p>{project.myRole}</p>
          {project.results.length > 0 && (
            <>
              <h4>Results</h4>
              <ul className="ticks">{project.results.map(r => <li key={r}>{r}</li>)}</ul>
            </>
          )}
          <h4>Built with</h4>
          <TagList items={project.tags} />
          {project.links && project.links.length > 0 && (
            <div className="actions">
              {project.links.map(l => (
                <a key={l.url} className="btn btn-soft" href={l.url} target="_blank" rel="noreferrer noopener">{l.label} <ExternalLink size={15} aria-hidden="true" /></a>
              ))}
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
