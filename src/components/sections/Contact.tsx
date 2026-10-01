import { useState } from "react";
import { ArrowUpRight, Check, Copy, Phone } from "lucide-react";
import { site } from "../../config";
import { socialIcons } from "../icons";

/** CONTACT — the calm, light ending. */
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
    <section id="contact" className="section env env-light contact" data-env="light" aria-labelledby="contact-title">
      <div className="wrap">
        <p className="kicker reveal"><span>05</span>{contact.kicker}</p>
        <h2 id="contact-title" className="contact-title reveal">{contact.title}</h2>
        <p className="contact-text reveal">{contact.text}</p>
        <div className="actions reveal">
          {person.email && (
            <>
              <a className="btn btn-primary btn-lg" href={`mailto:${person.email}`} data-magnetic="0.3">{contact.buttonLabel} <ArrowUpRight size={18} aria-hidden="true" /></a>
              <button type="button" className="btn btn-line" onClick={copy} data-magnetic="0.2">
                {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                <span aria-live="polite">{copied ? "Copied" : person.email}</span>
              </button>
            </>
          )}
          {person.phone && <a className="btn btn-line" href={`tel:${person.phone.replace(/\s/g, "")}`} data-magnetic="0.2"><Phone size={16} aria-hidden="true" /> {person.phone}</a>}
        </div>
        <ul className="contact-meta reveal">
          <li><span>LOCATION</span>{person.location}</li>
          <li><span>STATUS</span><i className={`status-dot status-${person.availability.status}`} aria-hidden="true" />{person.availability.text}</li>
          {social.map(s => {
            const Icon = socialIcons[s.icon];
            return <li key={s.url}><span>{s.label.toUpperCase()}</span><a href={s.url} target="_blank" rel="noreferrer noopener"><Icon size={14} aria-hidden="true" /> {s.url.replace(/^https?:\/\/(www\.)?/, "")}</a></li>;
          })}
          {person.resume && <li><span>RÉSUMÉ</span><a href={person.resume} download>Download PDF</a></li>}
        </ul>
      </div>
      <footer className="footer">
        <span>© {new Date().getFullYear()} {person.name}</span>
        <span>{site.footer.note}</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </section>
  );
}
