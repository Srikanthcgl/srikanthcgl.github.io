import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Check, ExternalLink } from "lucide-react";
import { site } from "../config";
import type { PortfolioConfig } from "../config/types";
import { Phone } from "./Phone";
import { TagList } from "./Term";

type App = PortfolioConfig["apps"]["items"][number];

const statusText: Record<App["status"], string> = { live: "Available now", beta: "In beta", "in-development": "Coming soon" };

/** Generated preview screens, used when an app has no screenshots yet. */
function GeneratedScreens({ app }: { app: App }) {
  return (
    <>
      <div className="snap gen gen-1">
        <span className="gen-icon" aria-hidden="true">{app.emoji}</span>
        <p className="gen-name">{app.name}</p>
        <p className="gen-tag">{app.tagline}</p>
        <span className="gen-cta">Get started</span>
      </div>
      <div className="snap gen gen-2">
        <p className="gen-head">What it does</p>
        {app.features.slice(0, 4).map((f, i) => <p key={`${i}-${f}`} className="gen-row"><Check size={14} aria-hidden="true" /> {f}</p>)}
      </div>
      <div className="snap gen gen-3">
        <p className="gen-head">About</p>
        <p className="gen-row gen-row-plain">{statusText[app.status]}{app.year ? ` · ${app.year}` : ""}</p>
        {app.stats.slice(0, 2).map(s => <p key={s.label} className="gen-stat"><b>{s.value}</b> {s.label}</p>)}
        <p className="gen-row gen-row-plain">Built with {app.tags.slice(0, 3).join(", ")}</p>
      </div>
    </>
  );
}

function AppPhone({ app }: { app: App }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = app.screenshots.length || 3;

  const onScroll = () => {
    const el = scroller.current;
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };
  const go = (i: number) => scroller.current?.scrollTo({ left: i * (scroller.current?.clientWidth ?? 0), behavior: "smooth" });

  return (
    <div className="app-phone">
      <Phone color={app.color}>
        {/* Scrollable region: focusable so keyboard users can scroll it with the arrow keys. */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <div className="snaps" ref={scroller} onScroll={onScroll} tabIndex={0} role="region" aria-label={`${app.name} screens — swipe or use arrow keys`}>
          {app.screenshots.length
            ? app.screenshots.map((src, i) => <img key={src} className="snap shot" src={src} alt={`${app.name} screen ${i + 1}`} loading="lazy" />)
            : <GeneratedScreens app={app} />}
        </div>
      </Phone>
      <div className="dots-nav" role="group" aria-label="Choose screen">
        {Array.from({ length: count }, (_, i) => (
          <button key={i} type="button" aria-label={`Screen ${i + 1}`} aria-current={index === i ? "true" : undefined} onClick={() => go(i)} />
        ))}
      </div>
    </div>
  );
}

export function Apps() {
  const { apps } = site;
  return (
    <section id="apps" className="section" aria-labelledby="apps-title">
      <div className="section-head reveal">
        <p className="kicker">{apps.kicker}</p>
        <h2 id="apps-title">{apps.title}</h2>
        <p className="section-intro">{apps.intro}</p>
      </div>
      <div className="app-list">
        {apps.items.map((app, i) => (
          <article key={app.id} className={`app reveal ${i % 2 ? "app-flip" : ""}`} style={{ "--app": app.color } as CSSProperties}>
            <AppPhone app={app} />
            <div className="app-info spot card">
              <p className={`app-status app-${app.status}`}><span className="status-dot" aria-hidden="true" /> {statusText[app.status]}{app.year ? ` · ${app.year}` : ""}</p>
              <h3>
                {app.icon ? <img className="app-icon" src={app.icon} alt="" width={44} height={44} /> : <span className="app-emoji" aria-hidden="true">{app.emoji}</span>}
                {app.name}
              </h3>
              <p className="app-tagline">{app.tagline}</p>
              <p className="app-desc">{app.description}</p>
              <ul className="ticks">{app.features.map((f, i) => <li key={`${i}-${f}`}>{f}</li>)}</ul>
              {app.stats.length > 0 && (
                <dl className="app-stats">{app.stats.map(s => <div key={s.label}><dd>{s.value}</dd><dt>{s.label}</dt></div>)}</dl>
              )}
              <TagList items={app.tags} />
              {app.links.length > 0 && (
                <div className="actions">
                  {app.links.map(l => <a key={l.url} className="btn btn-primary btn-app" href={l.url} target="_blank" rel="noreferrer noopener">{l.label} <ExternalLink size={15} aria-hidden="true" /></a>)}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
