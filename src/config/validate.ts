import type { PortfolioConfig } from "./types";

const SECTION_IDS = ["about", "projects", "skills", "experience", "contact"];

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

  dupes(c.hero.domains.map(d => d.id), "hero.domains");
  need(c.hero.domains.length >= 3 && c.hero.domains.length <= 8, "hero.domains: use between 3 and 8 domains so the diagram stays readable");
  for (const d of c.hero.domains) {
    need(SECTION_IDS.includes(d.target), `hero domain "${d.id}": target "${d.target}" is not a section`);
    need(d.code && d.code.length <= 5, `hero domain "${d.id}": code should be a short tag like "ARCH"`);
  }

  dupes(c.about.method.phases.map(p => p.id), "about.method.phases");
  need(c.about.method.phases.length >= 2, "about.method.phases needs at least two phases");

  dupes(c.projects.items.map(p => p.id), "projects.items");
  for (const p of c.projects.items) {
    need(p.title && p.summary && p.whatItIs && p.whyItMatters && p.myRole, `project "${p.id}": title, summary, whatItIs, whyItMatters and myRole are required`);
    need(p.tags.length > 0, `project "${p.id}": add at least one tag`);
    need(p.flow.length >= 2, `project "${p.id}": flow needs at least two steps`);
  }

  const groupIds = c.skills.groups.map(g => g.id);
  dupes(groupIds, "skills.groups");
  for (const g of c.skills.groups) need(g.items.length > 0, `skills group "${g.title}" has no items`);
  for (const [a, b] of c.skills.relations) need(groupIds.includes(a) && groupIds.includes(b), `skills.relations: unknown group in ["${a}", "${b}"]`);

  for (const [term, meaning] of Object.entries(c.glossary)) need(meaning.length > 10, `glossary "${term}" needs a longer explanation`);
  return problems;
}
