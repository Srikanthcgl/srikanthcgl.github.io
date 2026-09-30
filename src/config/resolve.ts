import type { PortfolioConfig, SectionId } from "./types";

export const isPlaceholder = (value: string | undefined): boolean => !value || /TODO/i.test(value);

/** True if any string anywhere inside `value` is a TODO placeholder. */
export function containsPlaceholder(value: unknown): boolean {
  if (typeof value === "string") return /TODO/i.test(value);
  if (Array.isArray(value)) return value.some(containsPlaceholder);
  if (value && typeof value === "object") return Object.values(value).some(containsPlaceholder);
  return false;
}

/**
 * Returns the config the UI should render.
 * In production (`hidePlaceholders`), unfinished TODO entries are removed so visitors never see them;
 * in development they are kept so you can spot what still needs filling in.
 */
export function resolveConfig(raw: PortfolioConfig, hidePlaceholders: boolean): PortfolioConfig {
  if (!hidePlaceholders) return raw;
  const keep = <T,>(items: T[]) => items.filter(item => !containsPlaceholder(item));

  const out: PortfolioConfig = {
    ...raw,
    person: {
      ...raw.person,
      email: isPlaceholder(raw.person.email) ? "" : raw.person.email,
      photo: isPlaceholder(raw.person.photo) ? "" : raw.person.photo,
      resume: isPlaceholder(raw.person.resume) ? "" : raw.person.resume,
    },
    social: raw.social.filter(s => !isPlaceholder(s.url) && !containsPlaceholder(s.url)),
    hero: { ...raw.hero, highlights: keep(raw.hero.highlights) },
    apps: { ...raw.apps, items: keep(raw.apps.items) },
    about: { ...raw.about, facts: keep(raw.about.facts) },
    experience: { ...raw.experience, jobs: keep(raw.experience.jobs), education: keep(raw.experience.education) },
  };

  const hasContent: Partial<Record<SectionId, boolean>> = {
    experience: out.experience.jobs.length + out.experience.education.length > 0,
    apps: out.apps.items.length > 0,
    projects: out.projects.items.length > 0,
    skills: out.skills.groups.length > 0,
  };
  out.sections = raw.sections.filter(id => hasContent[id] !== false);
  return out;
}
