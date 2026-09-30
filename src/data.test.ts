import { describe, expect, it } from "vitest";
import { config } from "./portfolio.config";
import { validateConfig } from "./config/validate";
import { containsPlaceholder, isPlaceholder, resolveConfig } from "./config/resolve";

describe("portfolio.config", () => {
  it("passes the friendly validator with no problems", () => {
    expect(validateConfig(config)).toEqual([]);
  });

  it("validator catches common mistakes", () => {
    const bad = structuredClone(config);
    bad.apps.items[0].color = "purple";
    bad.projects.items.push({ ...bad.projects.items[0] });
    bad.sections.push("nope" as never);
    const problems = validateConfig(bad).join(" | ");
    expect(problems).toMatch(/color/);
    expect(problems).toMatch(/duplicate id/);
    expect(problems).toMatch(/unknown section/);
  });

  it("has unique project ids and every project is complete", () => {
    const ids = config.projects.items.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of config.projects.items) {
      expect(p.title && p.summary && p.whatItIs && p.whyItMatters && p.myRole, p.id).toBeTruthy();
      expect(p.tags.length, p.id).toBeGreaterThan(0);
    }
  });

  it("only references sections that have a menu label", () => {
    for (const id of config.sections) expect(config.navLabels[id], id).toBeTruthy();
    expect(new Set(config.sections).size).toBe(config.sections.length);
  });

  it("explains every glossary-worthy tag it lists", () => {
    for (const key of Object.keys(config.glossary)) expect(config.glossary[key].length, key).toBeGreaterThan(10);
  });
});

describe("placeholders", () => {
  it("detects TODO markers, including nested ones", () => {
    expect(isPlaceholder("")).toBe(true);
    expect(isPlaceholder("TODO@example.com")).toBe(true);
    expect(isPlaceholder("me@real.dev")).toBe(false);
    expect(containsPlaceholder({ a: ["fine", { b: "TODO: fill" }] })).toBe(true);
  });

  it("hides unfinished entries in production but keeps them in development", () => {
    const dev = resolveConfig(config, false);
    const prod = resolveConfig(config, true);
    expect(dev.experience.jobs.length).toBe(config.experience.jobs.length);
    expect(prod.experience.jobs.every(j => !containsPlaceholder(j))).toBe(true);
    expect(prod.person.email === "" || !isPlaceholder(prod.person.email)).toBe(true);
    expect(prod.social.every(s => !containsPlaceholder(s.url))).toBe(true);
  });

  it("drops sections that end up empty", () => {
    const prod = resolveConfig({ ...config, experience: { ...config.experience, jobs: [], education: [] } }, true);
    expect(prod.sections).not.toContain("experience");
  });
});
