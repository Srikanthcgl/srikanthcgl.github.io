import { useEffect, useState } from "react";

/** Reactive `matchMedia`. */
export function useMedia(query: string): boolean {
  const [match, setMatch] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

/** Runs `cb(visible)` when the element enters / leaves the viewport. */
export function onVisible(el: Element, cb: (visible: boolean) => void, margin = "120px"): () => void {
  const io = new IntersectionObserver(([e]) => cb(e.isIntersecting), { rootMargin: margin });
  io.observe(el);
  return () => io.disconnect();
}
