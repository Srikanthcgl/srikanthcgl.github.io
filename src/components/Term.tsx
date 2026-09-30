import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { site } from "../config";

/**
 * A tag that, when the glossary has an entry for it, shows a "?" with a plain-language
 * explanation on hover, focus or tap. The tooltip is portalled (so cards' blur/overflow can't clip it),
 * kept inside the viewport, and becomes a bottom sheet on phones.
 */
export function Term({ name }: { name: string }) {
  const meaning = site.glossary[name];
  const [open, setOpen] = useState(false);
  const [host, setHost] = useState<Element | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const tipId = useId();
  const btnRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); setOpen(false); } };
    const close = () => setOpen(false);
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("scroll", close, { passive: true });
    return () => { window.removeEventListener("keydown", onKey, true); window.removeEventListener("scroll", close); };
  }, [open]);

  useLayoutEffect(() => { setHost(btnRef.current?.closest("dialog") ?? document.body); }, []);

  useLayoutEffect(() => {
    if (!open || !btnRef.current || !tipRef.current || window.innerWidth <= 600) { setPos(null); return; }
    const b = btnRef.current.getBoundingClientRect();
    const t = tipRef.current.getBoundingClientRect();
    const margin = 12;
    const left = Math.min(Math.max(b.left + b.width / 2 - t.width / 2, margin), window.innerWidth - margin - t.width);
    const above = b.top - t.height - 10;
    setPos({ left, top: above >= margin ? above : b.bottom + 10 });
  }, [open]);

  if (!meaning) return <li className="tag">{name}</li>;

  return (
    <li className="tag tag-hint" onPointerEnter={e => { if (e.pointerType === "mouse") setOpen(true); }} onPointerLeave={e => { if (e.pointerType === "mouse") setOpen(false); }}>
      <button ref={btnRef} type="button" aria-describedby={tipId} aria-expanded={open} onClick={() => setOpen(v => !v)} onFocus={e => { if (e.currentTarget.matches(":focus-visible")) setOpen(true); }} onBlur={() => setOpen(false)}>
        {name}<span className="tag-q" aria-hidden="true">?</span>
      </button>
      {host && createPortal(
        <span
          id={tipId} ref={tipRef} role="tooltip" className={`tip ${open ? "is-open" : ""}`}
          style={pos ? { left: pos.left, top: pos.top } : undefined}
        ><b>{name}</b> {meaning}</span>,
        host,
      )}
    </li>
  );
}

export function TagList({ items, className = "" }: { items: string[]; className?: string }) {
  return <ul className={`tags ${className}`}>{items.map(i => <Term key={i} name={i} />)}</ul>;
}
