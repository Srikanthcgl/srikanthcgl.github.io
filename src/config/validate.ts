import type { PortfolioConfig } from "./types";

const SECTION_IDS = ["about", "apps", "projects", "skills", "experience", "contact"];
const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Friendly sanity checks for portfolio.config.ts. Returns human-readable problems (empty = all good). */
export function validateConfig(c: PortfolioConfig): string[] {
  const problems: string[] = [];
  const need = (ok: unknown, msg: string) => { if (!ok) problems.push(msg); };
  const dupes = (ids: string[], where: string) => {
    const seen = new Set<string>();
    for (const id of ids) { if (seen.has(id)) problems.push(`${where}: duplicate id "${id}"`); seen.add(id); }
  };

  need(c.person.name, "person.name is empty");
  need(c.person.initials, "person.initials is empty");
  need(c.meta.title, "meta.title is empty");

  for (const id of c.sections) need(SECTION_IDS.includes(id), `sections: unknown section "${id}" (use: ${SECTION_IDS.join(", ")})`);
  dupes(c.sections, "sections");
  for (const id of c.sections) need(c.navLabels[id], `navLabels.${id} is missing`);
  need(SECTION_IDS.includes(c.hero.primaryButton.target), `hero.primaryButton.target "${c.hero.primaryButton.target}" is not a section`);

  dupes(c.apps.items.map(a => a.id), "apps.items");
  for (const a of c.apps.items) {
    need(a.name && a.tagline && a.description, `app "${a.id}": name, tagline and description are required`);
    need(HEX.test(a.color), `app "${a.id}": color "${a.color}" should look like "#7c5cff"`);
    need(["live", "beta", "in-development"].includes(a.status), `app "${a.id}": status must be live, beta or in-development`);
    need(a.features.length > 0, `app "${a.id}": add at least one feature`);
  }

  dupes(c.projects.items.map(p => p.id), "projects.items");
  for (const p of c.projects.items) {
    need(p.title && p.summary && p.whatItIs && p.whyItMatters && p.myRole, `project "${p.id}": title, summary, whatItIs, whyItMatters and myRole are required`);
    need(p.tags.length > 0, `project "${p.id}": add at least one tag`);
  }

  for (const g of c.skills.groups) need(g.items.length > 0, `skills group "${g.title}" has no items`);
  for (const [term, meaning] of Object.entries(c.glossary)) need(meaning.length > 10, `glossary "${term}" needs a longer explanation`);
  return problems;
}
