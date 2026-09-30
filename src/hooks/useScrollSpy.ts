import { useEffect, useState } from "react";

/** Id of the section crossing the upper part of the viewport. */
export function useScrollSpy(ids: readonly string[]): string {
  const [active, setActive] = useState("");
  const key = ids.join("|");
  useEffect(() => {
    const els = key.split("|").map(id => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);
  return active;
}
