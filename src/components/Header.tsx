import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "../config";
import { useScrollSpy } from "../hooks/useScrollSpy";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useScrollSpy(site.sections);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="header-bar">
        <a href="#top" className="brand" onClick={close} aria-label={`${site.person.name} — back to top`}>
          <span className="brand-mark" aria-hidden="true">{site.person.initials}</span>
          <span className="brand-name">{site.person.name}</span>
        </a>

        <nav id="primary-nav" className={`nav ${open ? "is-open" : ""}`} aria-label="Primary">
          <ul>
            {site.sections.map(id => (
              <li key={id}>
                <a href={`#${id}`} onClick={close} aria-current={active === id ? "true" : undefined}>{site.navLabels[id]}</a>
              </li>
            ))}
          </ul>
        </nav>

        <button type="button" className="menu-btn" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-controls="primary-nav" aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}
