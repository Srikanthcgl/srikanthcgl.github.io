import { useEffect } from "react";

/** Adds `.is-visible` to `.reveal` elements as they scroll into view. CSS handles reduced motion. */
export function useReveal(): void {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(el => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries, obs) => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); obs.unobserve(entry.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    items.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
