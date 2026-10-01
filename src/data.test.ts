import { describe, expect, it } from "vitest";
import { config } from "./portfolio.config";
import { containsPlaceholder, isPlaceholder, resolveConfig } from "./config/resolve";
import { validateConfig } from "./config/validate";
import { blendPalette, ENVIRONMENTS, envPosition } from "./engine/environments";

describe("portfolio.config", () => {
  it("passes the validator with no problems", () => {
    expect(validateConfig(config)).toEqual([]);
  });

  it("validator catches common mistakes", () => {
    const bad = structuredClone(config);
    bad.projects.items.push({ ...bad.projects.items[0] });
    bad.sections.push("nope" as never);
    bad.skills.relations.push(["architecture", "missing"]);
    bad.hero.domains[0].target = "nowhere" as never;
    const problems = validateConfig(bad).join(" | ");
    expect(problems).toMatch(/duplicate id/);
    expect(problems).toMatch(/unknown section/);
    expect(problems).toMatch(/unknown group/);
    expect(problems).toMatch(/is not a section/);
  });
});

describe("placeholders", () => {
  it("detects TODO markers, including nested ones", () => {
    expect(isPlaceholder("")).toBe(true);
    expect(isPlaceholder("TODO@example.com")).toBe(true);
    expect(isPlaceholder("me@real.dev")).toBe(false);
    expect(containsPlaceholder({ a: ["fine", { b: "TODO: fill" }] })).toBe(true);
  });

  it("hides unfinished entries in production", () => {
    const withTodo = structuredClone(config);
    withTodo.experience.jobs.push({ role: "TODO", org: "TODO", period: "TODO", summary: "TODO", highlights: [] });
    const prod = resolveConfig(withTodo, true);
    expect(prod.experience.jobs.every(j => !containsPlaceholder(j))).toBe(true);
    expect(resolveConfig(withTodo, false).experience.jobs.length).toBe(withTodo.experience.jobs.length);
  });

  it("drops sections that end up empty", () => {
    const prod = resolveConfig({ ...config, experience: { ...config.experience, jobs: [], education: [] } }, true);
    expect(prod.sections).not.toContain("experience");
  });
});

describe("theme engine", () => {
  it("holds a section's palette in the middle of it and blends across boundaries", () => {
    const tops = [0, 1000, 2000];
    expect(envPosition(tops, 500, 200)).toBe(0);
    expect(envPosition(tops, 1500, 200)).toBe(1);
    const mid = envPosition(tops, 1000, 200);
    expect(mid).toBeGreaterThan(0.4);
    expect(mid).toBeLessThan(0.6);
  });

  it("interpolates colours between neighbouring environments", () => {
    const a = blendPalette(0);
    const b = blendPalette(1);
    const half = blendPalette(0.5);
    expect(half.bg[0]).toBeCloseTo((a.bg[0] + b.bg[0]) / 2, 0);
    expect(blendPalette(ENVIRONMENTS.length - 1).bg).toEqual(ENVIRONMENTS[ENVIRONMENTS.length - 1].palette.bg);
  });
});
